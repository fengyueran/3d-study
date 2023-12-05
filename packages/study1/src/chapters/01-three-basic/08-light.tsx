import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Container = styled.div`
  height: 100%;
`;

//https://www.bilibili.com/video/BV14r4y1G7h4?p=7&spm_id_from=pageDriver&vd_source=052a4a43fb6ce3b0077fb11d296a0c6e
export const Light = () => {
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
    // camera.lookAt(0, 10, 0);

    scene.add(camera);

    const cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    //MeshBasicMaterial不受光照影响
    const cubeMaterial = new THREE.MeshLambertMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.5,
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(0, 0, 0);
    scene.add(cube);

    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    // camera.lookAt(cube.position);
    // camera.lookAt(0, 0, 0);

    const pointLight = new THREE.PointLight(0xffffff, 100000);
    pointLight.position.set(50, 50, 50);
    scene.add(pointLight);

    const pointLightHelper = new THREE.PointLightHelper(pointLight, 4);
    scene.add(pointLightHelper);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 100);
    //通过position位置和target设置光的方向
    directionalLight.position.set(20, 100, -50);
    //方向光指向cube模型，默认为(0,0,0)
    directionalLight.target = cube;
    scene.add(directionalLight);

    const directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight,
      4,
      0x00ffff
    );
    scene.add(directionalLightHelper);

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
  }, []);

  return <Container ref={containerRef} />;
};
