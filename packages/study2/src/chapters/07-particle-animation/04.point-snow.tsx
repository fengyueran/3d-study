import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import snow from './snow.png';

const Container = styled.div`
  height: 100%;
`;

export const PointSnow = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();

    const container = containerRef.current!;

    //https://threejs.org/examples/?q=webgl%20ca#webgl_camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      //雪花下降靠的是旋转，因此当近距离的雪花向下运动时，远离相机的部分有可能向上运动，因此裁剪掉远处的雪花
      50
    );

    camera.position.set(0, 0, 70);
    scene.add(camera);

    const particlesGeometry = new THREE.BufferGeometry();
    const count = 5000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 1) {
      positions[i] = (Math.random() - 0.5) * 80;
    }
    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );

    const loader = new THREE.TextureLoader();
    const texture = loader.load(snow);

    const pointMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1,
      // sizeAttenuation: false, //为true时会根据深度而衰减，z越小，size越小，透视相机有效，默认为true
    });
    pointMaterial.map = texture;
    pointMaterial.transparent = true;
    // pointMaterial.alphaMap = texture;

    pointMaterial.depthWrite = false; //为true时当两个物体重合时被覆盖的那个物体不会渲染
    pointMaterial.blending = THREE.AdditiveBlending; //两个物体重合时颜色混合

    const points = new THREE.Points(particlesGeometry, pointMaterial);
    scene.add(points);

    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.PointLight(0xffffff, 1000000);
    directionalLight.position.set(120, 120, 120);
    scene.add(directionalLight);

    const webGLRenderer = new THREE.WebGLRenderer();
    webGLRenderer.setClearColor(new THREE.Color(0x000));
    webGLRenderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(webGLRenderer.domElement);

    const orbitControls = new OrbitControls(camera, webGLRenderer.domElement);
    //设置阻尼器，让控制器更有真实效果
    orbitControls.enableDamping = true;

    const clock = new THREE.Clock();
    webGLRenderer.setAnimationLoop(() => {
      const time = clock.getElapsedTime() * 0.1;
      points.rotation.x = time;
      webGLRenderer.render(scene, camera);
      orbitControls.update();
    });
  }, []);

  return <Container ref={containerRef} />;
};
