import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Container = styled.div`
  height: 100%;
`;

export const PointMaterial = () => {
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

    camera.position.set(0, 0, 10);
    scene.add(camera);

    const sphereGeometry = new THREE.SphereGeometry(3, 20, 20);

    const pointMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 10,
      sizeAttenuation: false, //为true时会根据深度而衰减，z越小，size越小，透视相机有效，默认为true
    });

    // pointMaterial.depthWrite = false; //为true时当两个物体重合时被覆盖的那个物体不会渲染
    // pointMaterial.blending = THREE.AdditiveBlending; //两个物体重合时颜色混合

    const points = new THREE.Points(sphereGeometry, pointMaterial);
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
