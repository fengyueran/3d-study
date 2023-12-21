import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import circle from './1.png';

const Container = styled.div`
  height: 100%;
`;

export const PointStar = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();

    const container = containerRef.current!;

    //https://threejs.org/examples/?q=webgl%20ca#webgl_camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    camera.position.set(0, 0, 1);
    scene.add(camera);

    const particlesGeometry = new THREE.BufferGeometry();
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 1) {
      positions[i] = (Math.random() - 0.5) * 80;
      colors[i] = Math.random();
    }
    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );

    particlesGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(colors, 3)
    );

    // const loader = new THREE.TextureLoader();
    // const texture = loader.load(circle);

    const pointMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      // sizeAttenuation: false, //为true时会根据深度而衰减，z越小，size越小，透视相机有效，默认为true
    });
    // pointMaterial.map = texture;
    // pointMaterial.transparent = true;
    // pointMaterial.alphaMap = texture;

    pointMaterial.depthWrite = false; //为true时当两个物体重合时被覆盖的那个物体不会渲染
    pointMaterial.blending = THREE.AdditiveBlending; //两个物体重合时颜色混合

    pointMaterial.vertexColors = true; //设置为true时上面设置的顶点颜色才会生效

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

    function render() {
      requestAnimationFrame(render);
      webGLRenderer.render(scene, camera);
    }
    render();
  }, []);

  return <Container ref={containerRef} />;
};
