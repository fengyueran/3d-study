import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import snow from './snow.png';

const Container = styled.div`
  height: 100%;
`;

export const MathGalaxy = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();

    const container = containerRef.current!;

    //https://threejs.org/examples/?q=webgl%20ca#webgl_camera
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );

    camera.position.set(0, 0, 10);
    scene.add(camera);

    const params = {
      count: 10000,
      size: 2,
      radius: 5,
      branch: 1000,
      color: '#ff6030',
      endColor: '#1b3984',
      rotateScale: 0.3,
    };

    const geometry = new THREE.BufferGeometry();

    const generateGalaxy = () => {
      const { count, radius, branch, rotateScale, color } = params;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const centerColor = new THREE.Color(color);
      const endColor = new THREE.Color(params.endColor);
      for (let i = 0; i < count; i++) {
        const current = i * 3;

        //当前点应该在哪一条分支上(角度平分)
        const branchAngel = (i % branch) * ((2 * Math.PI) / branch);

        //当前点距离圆心的距离
        const distance = Math.random() * radius * Math.pow(Math.random(), 3);

        //-1-1
        const randomX =
          (Math.pow(Math.random() * 2 - 1, 3) * (radius - distance)) / 5;
        const randomY =
          (Math.pow(Math.random() * 2 - 1, 3) * (radius - distance)) / 5;
        const randomZ =
          (Math.pow(Math.random() * 2 - 1, 3) * (radius - distance)) / 5;

        positions[current] =
          Math.cos(branchAngel + distance * rotateScale) * distance + randomX;
        positions[current + 1] = randomY;
        positions[current + 2] =
          Math.sin(branchAngel + distance * 0.3) * distance + randomZ;

        //混合颜色，形成渐变色
        const mixColor = centerColor.clone();
        mixColor.lerp(endColor, distance / radius);
        colors[current] = mixColor.r;
        colors[current + 1] = mixColor.g;
        colors[current + 2] = mixColor.b;
      }

      geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
      );
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const pointMaterial = new THREE.PointsMaterial({
        size: params.size,
        sizeAttenuation: false, //为true时会根据深度而衰减，z越小，size越小，透视相机有效，默认为true
        depthWrite: false,
        blending: THREE.AdditiveBlending, //两个物体重合时颜色混合
        transparent: true,
        vertexColors: true,
      });

      const points = new THREE.Points(geometry, pointMaterial);
      return points;
    };

    scene.add(generateGalaxy());

    const axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.PointLight(0xffffff, 1000000);
    directionalLight.position.set(12, 12, 12);
    scene.add(directionalLight);

    const webGLRenderer = new THREE.WebGLRenderer();
    webGLRenderer.setClearColor(new THREE.Color(0x000));
    webGLRenderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(webGLRenderer.domElement);

    const orbitControls = new OrbitControls(camera, webGLRenderer.domElement);
    //设置阻尼器，让控制器更有真实效果
    orbitControls.enableDamping = true;

    webGLRenderer.setAnimationLoop(() => {
      webGLRenderer.render(scene, camera);
      orbitControls.update();
    });
  }, []);

  return <Container ref={containerRef} />;
};
