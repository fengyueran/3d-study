import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';

import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

import { PDBLoader } from 'three/examples/jsm/loaders/PDBLoader';
import {
  CSS2DRenderer,
  CSS2DObject,
} from 'three/examples/jsm/renderers/CSS2DRenderer';
import { GUI } from 'dat.gui';
import TWEEN from 'three/examples/jsm/libs/tween.module.js';

import Al2O3 from './Al2O3.pdb';
import ethanol from './ethanol.pdb';

const gui = new GUI();

const Container = styled.div`
  height: 100%;
`;

export const MoleculeParticleAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current!;

    let camera, scene, renderer, labelRenderer;
    let controls;

    let root;

    const MOLECULES = {
      Ethanol: 'ethanol.pdb',
      Aspirin: 'aspirin.pdb',
      Caffeine: 'caffeine.pdb',
      Nicotine: 'nicotine.pdb',
      LSD: 'lsd.pdb',
      Cocaine: 'cocaine.pdb',
      Cholesterol: 'cholesterol.pdb',
      Lycopene: 'lycopene.pdb',
      Glucose: 'glucose.pdb',
      'Aluminium oxide': 'Al2O3.pdb',
      Cubane: 'cubane.pdb',
      Copper: 'cu.pdb',
      Fluorite: 'caf2.pdb',
      Salt: 'nacl.pdb',
      'YBCO superconductor': 'ybco.pdb',
      Buckyball: 'buckyball.pdb',
      Graphite: 'graphite.pdb',
    };

    const params = {
      molecule: 'caffeine.pdb',
    };

    const loader = new PDBLoader();
    const offset = new THREE.Vector3();

    init();

    function init() {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x050505);

      camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        1,
        5000
      );
      camera.position.z = 1000;
      scene.add(camera);

      const light1 = new THREE.DirectionalLight(0xffffff, 2.5);
      light1.position.set(1, 1, 1);
      scene.add(light1);

      const light2 = new THREE.DirectionalLight(0xffffff, 1.5);
      light2.position.set(-1, -1, 1);
      scene.add(light2);

      root = new THREE.Group();
      scene.add(root);

      renderer = new THREE.WebGLRenderer({ antialias: true });
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

      //

      loadMolecule(params.molecule);

      gui.add(params, 'molecule', MOLECULES).onChange(loadMolecule);
      gui.open();
    }

    const lines = new THREE.Group();
    const atoms = new THREE.Group();
    const atomArray = [];
    const atomPositions = [];

    function loadMolecule(model) {
      const url = ethanol;

      while (root.children.length > 0) {
        const object = root.children[0];
        object.parent.remove(object);
      }

      loader.load(url, function (pdb) {
        const geometryAtoms = pdb.geometryAtoms;
        const geometryBonds = pdb.geometryBonds;
        // const json = pdb.json;

        const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
        const sphereGeometry = new THREE.IcosahedronGeometry(1, 3);

        geometryAtoms.computeBoundingBox();
        geometryAtoms.boundingBox.getCenter(offset).negate();

        geometryAtoms.translate(offset.x, offset.y, offset.z);
        geometryBonds.translate(offset.x, offset.y, offset.z);

        let positions = geometryAtoms.getAttribute('position');
        // const colors = geometryAtoms.getAttribute('color');

        const position = new THREE.Vector3();
        const color = new THREE.Color();

        for (let i = 0; i < positions.count; i++) {
          position.x = positions.getX(i);
          position.y = positions.getY(i);
          position.z = positions.getZ(i);

          // color.r = colors.getX(i);
          // color.g = colors.getY(i);
          // color.b = colors.getZ(i);

          const material = new THREE.MeshPhongMaterial({ color: color });

          const object = new THREE.Mesh(sphereGeometry, material);
          object.position.copy(position);
          object.position.multiplyScalar(75);
          object.scale.multiplyScalar(25);
          atomPositions.push(
            object.position.x,
            object.position.y,
            object.position.z
          );
          atoms.add(object);
          atomArray.push(object);

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
        root.add(atoms);

        positions = geometryBonds.getAttribute('position');

        const start = new THREE.Vector3();
        const end = new THREE.Vector3();

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
              opacity: 1,
            })
          );
          object.position.copy(start);
          object.position.lerp(end, 0.5);
          object.scale.set(5, 5, start.distanceTo(end));
          object.lookAt(end);
          lines.add(object);
        }
        root.add(lines);
        transition();
      });
    }

    const particlesTotal = 9;
    let current = 0;

    for (let i = 0; i < particlesTotal; i++) {
      atomPositions.push(
        Math.random() * 300 - 200,
        Math.random() * 300 - 200,
        Math.random() * 300 - 200
      );
    }

    const transition = () => {
      const offset = current * particlesTotal * 3;
      const duration = 2000;

      for (let i = 0, j = offset; i < particlesTotal; i++, j += 3) {
        const object = atomArray[i];
        // debugger; //eslint-disable-line

        new TWEEN.Tween(object.position)
          .to(
            {
              x: atomPositions[j],
              y: atomPositions[j + 1],
              z: atomPositions[j + 2],
            },
            Math.random() * duration + duration
          )
          .easing(TWEEN.Easing.Exponential.InOut)
          .start();
      }

      new TWEEN.Tween(this)
        .to({}, duration * 3)
        .onComplete(transition)
        .start();

      current = (current + 1) % 2;
    };

    // const tween = new TWEEN.Tween({ opacity: 0, scale: 25, positionX: 0 })
    //   .to({ opacity: 1, scale: 40, positionX: 100 }, 30000)
    //   .onUpdate((object) => {
    //     lines.traverse((line) => {
    //       // debugger; //eslint-disable-line
    //       if (line.material) {
    //         line.material.opacity = 1 - object.opacity;
    //       }
    //     });

    //     atoms.traverse((atom) => {
    //       // debugger; //eslint-disable-line
    //       if (atom.material) {
    //         // line.visible = true;
    //         console.log('atom', atom.position);
    //         // atom.position.x = object.positionX;
    //         // atom.position.y = -object.positionX;
    //         // atom.position.z = object.positionX;
    //         atom.scale.set(object.scale, object.scale, object.scale);
    //       }
    //     });

    //     // 在动画更新时的逻辑，例如修改透明度、位置等
    //     // hydrogen1.position.y = 1 - object.opacity;
    //     // hydrogen2.position.y = 1 - object.opacity;
    //     // oxygen.position.y = 1 - object.opacity;
    //     // // line.visible = true;
    //     // line.material.opacity = object.opacity;
    //   })
    //   .onComplete(() => {
    //     // 动画完成时的逻辑，例如添加更多的水分子等
    //     console.log('Animation complete!');
    //   });

    // // 启动动画
    // tween.start();

    renderer.setAnimationLoop(() => {
      // controls.update();

      TWEEN.update();
      const time = Date.now() * 0.0004;

      root.rotation.x = time;
      root.rotation.y = time * 0.7;

      renderer.render(scene, camera);
      // labelRenderer.render(scene, camera);
    });
  }, []);

  return <Container ref={containerRef} />;
};
