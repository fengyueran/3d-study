import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';

// eslint-disable-next-line
//@ts-ignore
import { PDBLoader } from 'three/examples/jsm/loaders/PDBLoader';
import TWEEN from 'three/examples/jsm/libs/tween.module.js';

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
      // eslint-disable-next-line
      //@ts-ignore
      loader.load(url, function (pdb: any) {
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

const MOLECULES = [
  { url: 'ethanol.pdb', name: 'ethanol', count: 9, offset: -200 },
  { url: 'aspirin.pdb', name: 'aspirin', count: 21, offset: 300 },
];

const initParticlesPosition = () => {
  const atomPositions = [];
  for (let i = 0; i < MOLECULES.length; i += 1) {
    const cur = MOLECULES[i];
    const offset = cur.offset || 0;
    for (let i = 0; i < cur.count; i += 1) {
      atomPositions.push(getRandom() + offset, getRandom(), getRandom());
    }
  }
  return atomPositions;
};

const initSphereParticlesPosition = (particlesCount: number) => {
  const atomPositions = [];
  const radius = 300;

  for (let i = 0; i < particlesCount; i++) {
    const phi = Math.acos(-1 + (2 * i) / particlesCount);
    const theta = Math.sqrt(particlesCount * Math.PI) * phi;

    atomPositions.push(
      radius * Math.cos(theta) * Math.sin(phi),
      radius * Math.sin(theta) * Math.sin(phi),
      radius * Math.cos(phi)
    );
  }
  return atomPositions;
};

const createMolecules = async (atomsInitialPosition: number[]) => {
  const allAtoms = [];
  const allLines = [];
  const atomPositions = [];
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
      atom.position.x = atomsInitialPosition[startIndex + j];
      atom.position.y = atomsInitialPosition[startIndex + j + 1];
      atom.position.z = atomsInitialPosition[startIndex + j + 2];
    }

    lines.forEach((line) => {
      line.position.x += offset;
    });

    allAtoms.push(...atoms);
    allLines.push(...lines);
    startIndex += cur.count;
  }
  return { allAtoms, allLines, atomPositions };
};

const allStepsPositions: number[][] = [];
let current = 1;

const transition = (atoms: THREE.Mesh[], lines: THREE.Mesh[]) => {
  const animationTypeCount = allStepsPositions.length;
  const particlesTotal = atoms.length;

  const atomPositions = allStepsPositions.reduce((p, c) => {
    return [...p, ...c];
  }, []);

  const opacitys = [
    { start: 0, end: 0 },
    { start: 0, end: 1 },
    { start: 1, end: 0 },
  ];

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
            (line.material as THREE.Material).opacity = obj.opacity;
          }
        });
      })
      .easing(TWEEN.Easing.Exponential.InOut);

    positionTween.start();
  }
  new TWEEN.Tween({})
    .to({}, 4000)
    .onComplete(() => transition(atoms, lines))
    .start();
  current = (current + 1) % animationTypeCount;
};

const init = async (scene: THREE.Group) => {
  const atomsInitialPosition: number[] = initParticlesPosition();
  allStepsPositions.push(atomsInitialPosition);

  const { allAtoms, allLines, atomPositions } = await createMolecules(
    atomsInitialPosition
  );
  allStepsPositions.push(atomPositions);

  allAtoms.forEach((atom) => {
    scene.add(atom);
  });
  allLines.forEach((line) => {
    scene.add(line);
  });

  const sphereParticlesPosition = initSphereParticlesPosition(allAtoms.length);
  allStepsPositions.push(sphereParticlesPosition);

  transition(allAtoms, allLines);
};

export const MoleculeAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const start = async () => {
      const container = containerRef.current!;

      const scene = new THREE.Scene();
      const root = new THREE.Group();

      const camera = new THREE.PerspectiveCamera(
        70,
        container.clientWidth / container.clientHeight,
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

      scene.add(root);

      const renderer = new THREE.WebGLRenderer();
      renderer.setClearAlpha(0);
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);

      await init(root);

      renderer.setAnimationLoop(() => {
        TWEEN.update();
        const time = Date.now() * 0.0004;

        root.rotation.x = time * 0.5;
        root.rotation.y = time * 0.07;

        renderer.render(scene, camera);
      });
    };
    start();
  }, []);

  return <Container ref={containerRef} />;
};
