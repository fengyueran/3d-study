import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';

const Container = styled.div`
  height: 100%;
`;

//https://www.bilibili.com/video/BV14r4y1G7h4?p=76&vd_source=052a4a43fb6ce3b0077fb11d296a0c6e
export const PostProcess = () => {
  const containerRef = useRef<HTMLDivElement>(null);

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

    const webGLRenderer = new THREE.WebGLRenderer();
    webGLRenderer.setClearColor(new THREE.Color(0x000));
    webGLRenderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(webGLRenderer.domElement);

    const effectComposer = new EffectComposer(webGLRenderer);
    const renderPass = new RenderPass(scene, camera);
    effectComposer.addPass(renderPass);
    const v2 = new THREE.Vector2(container.clientWidth, container.clientHeight);
    const outlinePass = new OutlinePass(v2, scene, camera);
    outlinePass.selectedObjects = [cube];
    effectComposer.addPass(outlinePass);

    const orbitControls = new OrbitControls(camera, webGLRenderer.domElement);

    function render() {
      requestAnimationFrame(render);
      effectComposer.render();
      // webGLRenderer.render(scene, camera);
    }
    render();
  }, []);

  return <Container ref={containerRef} />;
};
