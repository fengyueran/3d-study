import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Container = styled.div`
  height: 100%;
`;

export const PerspectiveCamera = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current!;

    const webGLRenderer = new THREE.WebGLRenderer();
    webGLRenderer.setClearColor(new THREE.Color(0x000));
    webGLRenderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(webGLRenderer.domElement);

    // 创建场景
    const scene = new THREE.Scene();

    // 创建透视投影相机
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(10, 5, 20);

    const camera2 = new THREE.OrthographicCamera(-1, 1, 1, -1, 5, 10);
    camera2.position.set(0, 0, 5);
    camera2.lookAt(new THREE.Vector3(0, 0, 0));
    const cameraHelper = new THREE.CameraHelper(camera2);
    scene.add(cameraHelper);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    //设置位置
    // cube.position.set(0, 0, -1.5);
    scene.add(cube);

    const orbitControls = new OrbitControls(camera, webGLRenderer.domElement);

    function render() {
      requestAnimationFrame(render);
      webGLRenderer.render(scene, camera);
    }
    render();
  }, []);

  return <Container ref={containerRef} />;
};
