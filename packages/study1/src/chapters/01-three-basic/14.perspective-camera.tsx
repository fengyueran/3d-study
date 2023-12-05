import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Container = styled.div`
  height: 100%;
`;

//https://www.bilibili.com/video/BV14r4y1G7h4?p=18
export const PerspectiveCamera = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();

    const container = containerRef.current!;

    //https://threejs.org/examples/?q=webgl%20ca#webgl_camera
    //4个参数可以决定视椎体的大小
    const camera = new THREE.PerspectiveCamera(
      45, //摄像机视锥体垂直视野角度
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    camera.position.set(200, 200, 200);
    camera.lookAt(0, 0, 0);

    scene.add(camera);

    const cubeGeometry = new THREE.BoxGeometry(100, 100, 100);
    //MeshBasicMaterial不受光照影响
    const cubeMaterial = new THREE.MeshLambertMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.5,
    });
    for (let i = 0; i < 10; i += 1) {
      for (let j = 0; j < 10; j += 1) {
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

        cube.position.set(200 * i, 0, 200 * j);

        scene.add(cube);
      }
    }

    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    const pointLight = new THREE.PointLight(0xffffff, 100000);
    pointLight.position.set(50, 50, 50);
    scene.add(pointLight);

    const pointLightHelper = new THREE.PointLightHelper(pointLight, 4);
    scene.add(pointLightHelper);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const webGLRenderer = new THREE.WebGLRenderer();
    webGLRenderer.setClearColor(new THREE.Color(0x000));
    webGLRenderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(webGLRenderer.domElement);

    const orbitControls = new OrbitControls(camera, webGLRenderer.domElement);

    function render() {
      requestAnimationFrame(render);
      webGLRenderer.render(scene, camera);
    }
    render();

    window.onresize = () => {
      webGLRenderer.setSize(container.clientWidth, container.clientHeight);
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
    };
  }, []);

  return <Container ref={containerRef} />;
};
