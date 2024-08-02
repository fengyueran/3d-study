import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Container = styled.div`
  height: 100%;
`;

function createCustomAxesHelper(size: number) {
  const axesGroup = new THREE.Group();

  // X轴（红色）
  const xMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
  const xGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(size, 0, 0),
  ]);
  const xAxis = new THREE.Line(xGeometry, xMaterial);
  axesGroup.add(xAxis);

  // Y轴（绿色）
  const yMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
  const yGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, size, 0),
  ]);
  const yAxis = new THREE.Line(yGeometry, yMaterial);
  axesGroup.add(yAxis);

  // Z轴（蓝色）
  const zMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
  const zGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, size),
  ]);
  const zAxis = new THREE.Line(zGeometry, zMaterial);
  axesGroup.add(zAxis);

  // 添加标签
  const createLabel = (text: string, color: string) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    const fontSize = 24;
    const fontFace = 'Arial';
    context.font = `${fontSize}px ${fontFace}`;
    const textWidth = context.measureText(text).width;

    canvas.width = textWidth;
    canvas.height = fontSize;

    context.font = `${fontSize}px ${fontFace}`;
    context.fillStyle = color;
    context.fillText(text, 0, fontSize);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(0.2, 0.2, 1); // 调整标签的缩放比例

    return sprite;
  };

  const xLabel = createLabel('X', '#ff0000');
  xLabel.position.set(size + 0.2, 0, 0);
  axesGroup.add(xLabel);

  const yLabel = createLabel('Y', '#00ff00');
  yLabel.position.set(0, size + 0.2, 0);
  axesGroup.add(yLabel);

  const zLabel = createLabel('Z', '#0000ff');
  zLabel.position.set(0, 0, size + 0.2);
  axesGroup.add(zLabel);

  return axesGroup;
}

export const AxesHelper = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current!;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    // renderer.setClearColor(new THREE.Color(0x000));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // 创建场景
    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);

    // 设置相机的位置和朝向
    camera.position.set(0, 0, 3);
    camera.lookAt(0, 0, 0);

    const axesHelper = new THREE.AxesHelper(1);
    scene.add(axesHelper);

    // 创建一个立方体表示场景中的物体
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.3, 0.3),
      new THREE.MeshBasicMaterial({ color: 'red' })
    );
    scene.add(cube);

    const orbitControls = new OrbitControls(camera, renderer.domElement);

    const axesScene = new THREE.Scene();
    const axesCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    axesCamera.position.set(0.5, 0.5, 1);
    axesCamera.lookAt(axesScene.position);

    const customAxesHelper = createCustomAxesHelper(0.6);

    axesScene.add(customAxesHelper);

    function render() {
      orbitControls.update();
      requestAnimationFrame(render);

      // 渲染主视图
      renderer.setViewport(0, 0, container.clientWidth, container.clientHeight);
      renderer.setScissor(0, 0, container.clientWidth, container.clientHeight);
      renderer.setScissorTest(true);
      renderer.clear(); // 清除主视图区域
      renderer.render(scene, camera);

      // 渲染左下角的小视图
      const axesViewportWidth = 100;
      const axesViewportHeight = 100;

      // 设置小视图的视口和剪裁区域
      renderer.setViewport(0, 0, axesViewportWidth, axesViewportHeight);
      renderer.setScissor(0, 0, axesViewportWidth, axesViewportHeight);
      renderer.setScissorTest(true);

      // 调整小视图的摄像机位置和方向，使其独立于主视图
      axesCamera.position.copy(camera.position);
      axesCamera.quaternion.copy(camera.quaternion);

      renderer.render(axesScene, axesCamera);

      renderer.setScissorTest(false);
    }
    render();
  }, []);

  return <Container ref={containerRef} />;
};
