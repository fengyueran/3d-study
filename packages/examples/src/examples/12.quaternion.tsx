import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Container = styled.div`
  height: 100%;
`;

export const Quaternion = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current!;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    // renderer.setClearColor(new THREE.Color(0x000));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -200,
      200,
      -200,
      200,
      0.1,
      1000
    );
    const orbitControls = new OrbitControls(camera, renderer.domElement);

    // 创建一个立方体
    const geometry = new THREE.BoxGeometry(45, 45, 15);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = -45;
    scene.add(cube);

    const rotatedCube = new THREE.Mesh(geometry, material);
    scene.add(rotatedCube);

    // 创建一个四元数
    const quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2); // 沿Y轴旋转90度

    // 应用四元数到物体
    rotatedCube.quaternion.multiply(quaternion);

    // 或者直接设置四元数
    rotatedCube.quaternion.copy(quaternion);

    // 设置相机位置
    camera.position.z = 68;

    // 渲染场景和相机
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();
  }, []);

  return <Container ref={containerRef} />;
};
