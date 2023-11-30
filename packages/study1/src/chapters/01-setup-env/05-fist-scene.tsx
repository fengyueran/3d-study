import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';

import metalRust from 'src/assets/textures/general/metal-rust.jpg';
import floorWood from 'src/assets/textures/general/floor-wood.jpg';
import brickWall from 'src/assets/textures/general/brick-wall.jpg';

const Container = styled.div`
  height: 100%;
  border-right: 1px solid #e8e8e8;
`;

const createMesh = (geom: THREE.BufferGeometry, imageFile: string) => {
  const texture = new THREE.TextureLoader().load(imageFile);
  const mat = new THREE.MeshPhongMaterial();
  mat.map = texture;

  const mesh = new THREE.Mesh(geom, mat);
  return mesh;
};

export const FirstScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();

    const container = containerRef.current!;
    // create a camera, which defines where we're looking at.
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    // create a render and set the size
    const webGLRenderer = new THREE.WebGLRenderer();
    webGLRenderer.setClearColor(new THREE.Color(0x000));
    webGLRenderer.setSize(container.clientWidth, container.clientHeight);
    webGLRenderer.shadowMap.enabled = true;

    const polyhedron = createMesh(
      new THREE.IcosahedronGeometry(5, 0),
      metalRust
    );
    polyhedron.position.x = 12;
    scene.add(polyhedron);

    const sphere = createMesh(new THREE.SphereGeometry(5, 20, 20), floorWood);
    scene.add(sphere);

    const cube = createMesh(new THREE.BoxGeometry(5, 5, 5), brickWall);
    cube.position.x = -12;
    scene.add(cube);

    // position and point the camera to the center of the scene
    camera.position.x = 0;
    camera.position.y = 12;
    camera.position.z = 28;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // add spotlight for the shadows
    const ambiLight = new THREE.AmbientLight(0x141414);
    scene.add(ambiLight);

    const light = new THREE.DirectionalLight();
    light.position.set(0, 30, 20);
    scene.add(light);

    container.appendChild(webGLRenderer.domElement);
    let step = 0;
    function render() {
      polyhedron.rotation.y = step += 0.01;
      polyhedron.rotation.x = step;
      cube.rotation.y = step;
      cube.rotation.x = step;
      sphere.rotation.y = step;
      sphere.rotation.x = step;
      // render using requestAnimationFrame
      requestAnimationFrame(render);
      webGLRenderer.render(scene, camera);
    }
    render();
  }, []);

  return <Container ref={containerRef} />;
};
