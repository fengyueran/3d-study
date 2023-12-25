import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { vec2 } from 'three/examples/jsm/nodes/Nodes.js';

const Container = styled.div`
  height: 100%;
`;

//https://www.bilibili.com/video/BV14r4y1G7h4?p=77&spm_id_from=pageDriver&vd_source=052a4a43fb6ce3b0077fb11d296a0c6e
export const RayCaster = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  let scene;
  let camera;
  let renderer;
  useEffect(() => {
    scene = new THREE.Scene();

    const container = containerRef.current!;

    //https://threejs.org/examples/?q=webgl%20ca#webgl_camera
    //4个参数可以决定视椎体的大小
    camera = new THREE.PerspectiveCamera(
      45, //摄像机视锥体垂直视野角度
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    camera.position.set(200, 200, 200);
    // camera.lookAt(0, 10, 0);

    scene.add(camera);

    const cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    //MeshBasicMaterial不受光照影响
    const cubeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.5,
      // wireframe: true,
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(0, 10, 0);
    scene.add(cube);

    const cube2 = new THREE.Mesh(cubeGeometry, cubeMaterial.clone());
    cube2.position.x = -80;
    scene.add(cube2);

    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    // camera.lookAt(cube.position);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000));
    renderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(renderer.domElement);

    const orbitControls = new OrbitControls(camera, renderer.domElement);

    function render() {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
    }
    render();
  }, []);

  return (
    <Container
      ref={containerRef}
      onClick={(event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        const raycaster = new THREE.Raycaster();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

        const intersects = raycaster.intersectObjects(scene.children);
        console.log('intersects', intersects);
        if (intersects?.length) {
          intersects[0].object.material.color.set('red');
        }
        console.log('intersects', intersects);
      }}
    />
  );
};
