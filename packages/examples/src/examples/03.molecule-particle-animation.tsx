import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { PDBLoader } from 'three/examples/jsm/loaders/PDBLoader';
import {
  CSS2DRenderer,
  CSS2DObject,
} from 'three/examples/jsm/renderers/CSS2DRenderer';
import { GUI } from 'dat.gui';
import TWEEN from 'three/examples/jsm/libs/tween.module.js';

import Al2O3 from './pdb/Al2O3.pdb';
import aspirin from './pdb/aspirin.pdb';
import buckyball from './pdb/buckyball.pdb';
import caf2 from './pdb/caf2.pdb';
import caffeine from './pdb/caffeine.pdb';
import cholesterol from './pdb/cholesterol.pdb';
import cocaine from './pdb/cocaine.pdb';
import cu from './pdb/cu.pdb';
import ethanol from './pdb/ethanol.pdb';

const gui = new GUI();

const Container = styled.div`
  height: 100%;
`;
const getRandom = () => Math.random() * 600 - 200;

const loadMolecule = (
  url: string
): Promise<{ atoms: THREE.Mesh[]; lines: THREE.Mesh[] }> =>
  new Promise((reslove) => {
    {
      const loader = new PDBLoader();
      const offset = new THREE.Vector3();
      const lines = [] as THREE.Mesh[];
      const atoms = [] as THREE.Mesh[];
      // while (root.children.length > 0) {
      //   const object = root.children[0];
      //   object.parent.remove(object);
      // }

      loader.load(url, function (pdb) {
        const geometryAtoms = pdb.geometryAtoms;
        const geometryBonds = pdb.geometryBonds;
        // const json = pdb.json;

        const sphereGeometry = new THREE.IcosahedronGeometry(1, 3);

        geometryAtoms.computeBoundingBox();
        geometryAtoms.boundingBox.getCenter(offset).negate();

        geometryAtoms.translate(offset.x, offset.y, offset.z);
        geometryBonds.translate(offset.x, offset.y, offset.z);

        let positions = geometryAtoms.getAttribute('position');
        const colors = geometryAtoms.getAttribute('color');

        const position = new THREE.Vector3();
        const color = new THREE.Color();

        for (let i = 0; i < positions.count; i++) {
          position.x = positions.getX(i);
          position.y = positions.getY(i);
          position.z = positions.getZ(i);

          color.r = colors.getX(i);
          color.g = colors.getY(i);
          color.b = colors.getZ(i);

          const material = new THREE.MeshPhongMaterial({ color: color });

          const object = new THREE.Mesh(sphereGeometry, material);
          object.position.copy(position);
          object.position.multiplyScalar(75);
          object.scale.multiplyScalar(25);

          atoms.push(object);

          // const atom = json.atoms[i];

          // const text = document.createElement('div');
          // text.className = 'label';
          // text.style.color =
          //   'rgb(' + atom[3][0] + ',' + atom[3][1] + ',' + atom[3][2] + ')';
          // text.textContent = atom[4];

          // const label = new CSS2DObject(text);
          // label.position.copy(object.position);
          // root.add(label);
        }
        // root.add(atoms);

        positions = geometryBonds.getAttribute('position');

        const start = new THREE.Vector3();
        const end = new THREE.Vector3();

        const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
        for (let i = 0; i < positions.count; i += 2) {
          start.x = positions.getX(i);
          start.y = positions.getY(i);
          start.z = positions.getZ(i);

          end.x = positions.getX(i + 1);
          end.y = positions.getY(i + 1);
          end.z = positions.getZ(i + 1);

          start.multiplyScalar(75);
          end.multiplyScalar(75);

          const object = new THREE.Mesh(
            boxGeometry,
            new THREE.MeshPhongMaterial({
              color: 0xffffff,
              transparent: true,
              opacity: 0,
            })
          );
          object.position.copy(start);
          object.position.lerp(end, 0.5);
          object.scale.set(5, 5, start.distanceTo(end));
          object.lookAt(end);
          lines.push(object);
        }

        reslove({ atoms, lines });
      });
    }
  });

export const MoleculeParticleAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const start = async () => {
      const container = containerRef.current!;

      let labelRenderer;
      let controls;

      const scene = new THREE.Scene();
      const root = new THREE.Group();

      scene.background = new THREE.Color(0x050505);

      const camera = new THREE.PerspectiveCamera(
        70,
        container.clientWidth / container.clientHeight,
        1,
        5000
      );
      camera.position.z = 1000;
      scene.add(camera);

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      const MOLECULES = [
        { url: ethanol, name: 'ethanol', count: 9, offset: -200 },
        // { url: Al2O3, name: 'Al2O3', count: 9 },
        { url: aspirin, name: 'aspirin', count: 21, offset: 300 },
        // { url: caf2, name: 'caf2', count: 22, offset: -500 },
        // { url: cu, name: 'cu', count: 45, offset: 0 },
        // { url: Al2O3, name: 'Al2O3' },
        // { url: Al2O3, name: 'Al2O3' },
        // { url: Al2O3, name: 'Al2O3' },
        // { url: Al2O3, name: 'Al2O3' },
        // { url: Al2O3, name: 'Al2O3' },
      ];

      const params = {
        molecule: 'caffeine.pdb',
      };

      const atomPositions: number[] = [];

      const particlesTotal = MOLECULES.reduce((p, c) => {
        return p + c.count;
      }, 0);
      const animationTypeCount = 3;
      let current = 1;

      // for (let i = 0; i < particlesTotal; i++) {
      //   atomPositions.push(getRandom(), getRandom(), getRandom() - offset);
      // }

      const opacitys = [
        { start: 0, end: 0 },
        { start: 0, end: 1 },
        { start: 1, end: 0 },
      ];
      const transition = (atoms: THREE.Mesh[], lines: THREE.Mesh[]) => {
        const offset = current * particlesTotal * 3;
        const duration = 3000;

        const currentOpacity = opacitys[current];

        for (let i = 0, j = offset; i < particlesTotal; i++, j += 3) {
          const object = atoms[i];

          const positionTween = new TWEEN.Tween({
            x: object.position.x,
            y: object.position.y,
            z: object.position.z,
            opacity: currentOpacity.start,
          })
            .to(
              {
                x: atomPositions[j],
                y: atomPositions[j + 1],
                z: atomPositions[j + 2],
                opacity: currentOpacity.end,
              },
              duration
            )
            .onUpdate((obj) => {
              object.position.x = obj.x;
              object.position.y = obj.y;
              object.position.z = obj.z;
              lines.forEach((line) => {
                if (line.material) {
                  line.material.opacity = obj.opacity;
                }
              });
            })
            .easing(TWEEN.Easing.Exponential.InOut);

          positionTween.start();
        }

        new TWEEN.Tween(this)
          .to({}, 4000)
          .onComplete(() => transition(atoms, lines))
          .start();
        current = (current + 1) % animationTypeCount;
      };

      const init = async () => {
        const light1 = new THREE.DirectionalLight(0xffffff, 2.5);
        light1.position.set(1, 1, 1);
        scene.add(light1);

        const light2 = new THREE.DirectionalLight(0xffffff, 1.5);
        light2.position.set(-1, -1, 1);
        scene.add(light2);

        scene.add(root);

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // labelRenderer = new CSS2DRenderer();
        // labelRenderer.setSize(container.clientWidth, container.clientHeight);
        // labelRenderer.domElement.style.position = 'absolute';
        // labelRenderer.domElement.style.top = '0px';
        // labelRenderer.domElement.style.pointerEvents = 'none';

        // container.appendChild(labelRenderer.domElement);

        // controls = new TrackballControls(camera, renderer.domElement);
        // controls.minDistance = 500;
        // controls.maxDistance = 2000;

        const allAtoms = [];
        const allLines = [];

        for (let i = 0; i < MOLECULES.length; i += 1) {
          const cur = MOLECULES[i];
          const offset = cur.offset || 0;
          for (let i = 0; i < cur.count; i += 1) {
            atomPositions.push(getRandom() + offset, getRandom(), getRandom());
          }
        }
        let startIndex = 0;
        for (let i = 0; i < MOLECULES.length; i += 1) {
          const cur = MOLECULES[i];
          const { atoms, lines } = await loadMolecule(cur.url);

          const offset = cur.offset || 0;

          for (let j = 0; j < atoms.length; j += 1) {
            const atom = atoms[j];
            atomPositions.push(
              atom.position.x + offset,
              atom.position.y,
              atom.position.z
            );
            atom.position.x = atomPositions[startIndex + j];
            atom.position.y = atomPositions[startIndex + j + 1];
            atom.position.z = atomPositions[startIndex + j + 2];

            root.add(atom);
          }

          lines.forEach((line) => {
            line.position.x += offset;

            root.add(line);
          });

          allAtoms.push(...atoms);
          allLines.push(...lines);
          startIndex += cur.count;
        }

        const radius = 275;

        for (let i = 0; i < particlesTotal; i++) {
          const phi = Math.acos(-1 + (2 * i) / particlesTotal);
          const theta = Math.sqrt(particlesTotal * Math.PI) * phi;

          atomPositions.push(
            radius * Math.cos(theta) * Math.sin(phi),
            radius * Math.sin(theta) * Math.sin(phi),
            radius * Math.cos(phi)
          );
        }

        transition(allAtoms, allLines);
        gui.add(params, 'molecule', MOLECULES).onChange(loadMolecule);
        gui.open();
      };

      const axesHelper = new THREE.AxesHelper(400);
      scene.add(axesHelper);

      const orbitControls = new OrbitControls(camera, renderer.domElement);

      await init();

      renderer.setAnimationLoop(() => {
        // controls.update();

        TWEEN.update();
        const time = Date.now() * 0.0004;

        root.rotation.x = time * 0.5;
        root.rotation.y = time * 0.07;

        renderer.render(scene, camera);
        // labelRenderer.render(scene, camera);
      });
    };
    start();
  }, []);

  return <Container ref={containerRef} />;
};
