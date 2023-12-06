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
    //4个参数可以决定视椎体的大小，透视投影，远小近大
    const camera = new THREE.PerspectiveCamera(
      30, //摄像机视锥体垂直视野角度，角度越大椎体体积越大，物体相对就会更小
      container.clientWidth / container.clientHeight,
      0.1,
      3000
    );

    // const camera = new THREE.PerspectiveCamera(
    //   30, //摄像机视锥体垂直视野角度
    //   container.clientWidth / container.clientHeight,
    //   0.1,
    //   8000
    // );

    // camera.position.set(200, 200, 200);
    //相机越远，看得越多，想象拍照
    // camera.position.set(800, 800, 800);

    //相机挪得太远，远平面外的物体不会显示，相机位置的挪动不会改变视椎体的大小
    camera.position.set(2000, 2000, 2000);
    camera.lookAt(0, 0, 0);
    //相机对准哪个物体，哪个物体就在画布的中间
    // camera.lookAt(1000, 0, 1000);
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
    pointLight.position.set(400, 200, 300);
    scene.add(pointLight);

    const pointLightHelper = new THREE.PointLightHelper(pointLight, 4);
    scene.add(pointLightHelper);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const webGLRenderer = new THREE.WebGLRenderer();
    webGLRenderer.setClearColor(new THREE.Color(0x000));
    webGLRenderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(webGLRenderer.domElement);

    //OrbitControls会影响相机lookAt值
    const orbitControls = new OrbitControls(camera, webGLRenderer.domElement);

    // orbitControls.target.set(1000, 0, 1000);
    // orbitControls.update();

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
