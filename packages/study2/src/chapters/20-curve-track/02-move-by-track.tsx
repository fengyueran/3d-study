import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Container = styled.div`
  height: 100%;
`;

export const MoveByTrack = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  let curve;
  let camera;
  let earth;
  useEffect(() => {
    const scene = new THREE.Scene();

    const container = containerRef.current!;

    //https://threejs.org/examples/?q=webgl%20ca#webgl_camera
    camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    camera.position.set(0, 0, 50);
    scene.add(camera);

    const cubeGeometry = new THREE.SphereGeometry(1);
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const moon = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(moon);

    const earthGeometry = new THREE.SphereGeometry(3);
    const earthMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    //基于Catmull-Rom样条的3D曲线,通常用于在一系列给定点之间生成平滑的曲线。这种曲线具有通过所有给定点的性质，并且在相邻点之间有平滑的过渡。
    curve = new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(-10, 0, 10),
        new THREE.Vector3(-5, 5, 5),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(5, -5, 5),
        new THREE.Vector3(10, 0, 10),
      ],
      true //闭合
    );

    //在曲线里获取51个点(分割成50份)
    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const curveObject = new THREE.Line(geometry, material);
    scene.add(curveObject);

    const webGLRenderer = new THREE.WebGLRenderer();
    webGLRenderer.setClearColor(new THREE.Color(0x000));
    webGLRenderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(webGLRenderer.domElement);

    const orbitControls = new OrbitControls(camera, webGLRenderer.domElement);

    const clock = new THREE.Clock();

    function render() {
      requestAnimationFrame(render);
      //getElapsedTime将返回自时钟创建以来经过的秒数
      const elapsed = clock.getElapsedTime();
      const time = (0.1 * elapsed) % 1;
      const point = curve.getPoint(time);
      moon.position.copy(point);
      // camera.position.copy(point);
      // camera.lookAt(earth.position);
      webGLRenderer.render(scene, camera);
    }
    render();
  }, []);

  return <Container ref={containerRef} />;
};
