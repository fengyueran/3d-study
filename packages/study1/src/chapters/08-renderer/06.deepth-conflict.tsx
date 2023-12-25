import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { render } from 'react-dom';

const Container = styled.div`
  height: 100%;
  position: relative;
`;

const Button = styled.button`
  margin: 20px;
  position: absolute;
  left: 0;
  top: 0;
`;

//https://www.bilibili.com/video/BV14r4y1G7h4?p=74&spm_id_from=pageDriver&vd_source=052a4a43fb6ce3b0077fb11d296a0c6e
export const DeepthConflict = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  let webGLRenderer: THREE.WebGLRenderer;
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

    scene.add(camera);

    const planeGeometry = new THREE.PlaneGeometry(50, 50);
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      side: THREE.DoubleSide,
    });

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    //对于透视投影相机，当相机很远时，两个物体间隔会进一步缩小
    plane.position.z = 1;

    scene.add(plane);

    //plane和plane2位置一样时可能导致闪烁，因为计算机无法分辨谁在前谁在后
    const planeGeometry2 = new THREE.PlaneGeometry(80, 80);
    const planeMaterial2 = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });
    const plane2 = new THREE.Mesh(planeGeometry2, planeMaterial2);
    scene.add(plane2);

    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    camera.lookAt(0, 0, 0);

    //logarithmicDepthBuffer为true时让两个间隔很近的物体，容易区分谁在前谁在后
    webGLRenderer = new THREE.WebGLRenderer({ logarithmicDepthBuffer: true });
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
