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

//https://www.bilibili.com/video/BV14r4y1G7h4?p=7&spm_id_from=pageDriver&vd_source=052a4a43fb6ce3b0077fb11d296a0c6e
export const SaveCanvas = () => {
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
    // camera.lookAt(0, 10, 0);

    scene.add(camera);

    const cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    //MeshBasicMaterial不受光照影响
    const cubeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 0.5,
      // wireframe: true,
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(0, 10, 0);
    scene.add(cube);

    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    // camera.lookAt(cube.position);
    camera.lookAt(0, 0, 0);

    //preserveDrawingBuffer为true时canvas才能转换为图片
    webGLRenderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });
    webGLRenderer.setClearColor(new THREE.Color(0x000), 0.2);
    webGLRenderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(webGLRenderer.domElement);

    const orbitControls = new OrbitControls(camera, webGLRenderer.domElement);

    function render() {
      requestAnimationFrame(render);
      webGLRenderer.render(scene, camera);
    }
    render();
  }, []);

  return (
    <Container ref={containerRef}>
      <Button
        onClick={() => {
          const link = document.createElement('a');
          const canvas = webGLRenderer.domElement;
          link.href = canvas.toDataURL('image/png');
          link.download = 'three.png';
          link.click();
        }}
      >
        保存为图片
      </Button>
    </Container>
  );
};
