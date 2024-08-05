import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Container = styled.div`
  height: 100%;
`;

const createCustomAxesHelper = (size: number) => {
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
    sprite.scale.set(6, 6, 1); // 调整标签的缩放比例

    return sprite;
  };

  const xLabel = createLabel('X', '#ff0000');
  xLabel.position.set(size + 6, 0, 0);
  axesGroup.add(xLabel);

  const yLabel = createLabel('Y', '#00ff00');
  yLabel.position.set(0, size + 6, 0);
  axesGroup.add(yLabel);

  const zLabel = createLabel('Z', '#0000ff');
  zLabel.position.set(0, 0, size + 6);
  axesGroup.add(zLabel);

  return axesGroup;
};

export const AxesHelper = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current!;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    // renderer.setClearColor(new THREE.Color(0x000));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const aspect = container.clientWidth / container.clientHeight;
    const d = 50;
    const camera = new THREE.OrthographicCamera(
      -d * aspect,
      d * aspect,
      d,
      -d,
      1,
      600
    );
    camera.position.set(0, 20, 60);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // 创建轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    // 创建一个立方体表示场景中的物体
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(3, 3, 3),
      new THREE.MeshBasicMaterial({ color: 'red' })
    );

    scene.add(cube);

    // 创建小视图相机
    const insetSize = 200;
    const insetAspect = 1;
    const insetCamera = new THREE.OrthographicCamera(
      -d * insetAspect,
      d * insetAspect,
      d,
      -d,
      1,
      1000
    );
    insetCamera.position.copy(camera.position);
    insetCamera.quaternion.copy(camera.quaternion);

    // 创建小视图场景
    const insetScene = new THREE.Scene();
    const insetArrowHelper = createCustomAxesHelper(30);
    insetScene.add(insetArrowHelper);

    // 动画循环
    function render() {
      requestAnimationFrame(render);
      controls.update();

      // 渲染主视图
      renderer.setViewport(0, 0, container.clientWidth, container.clientHeight);
      renderer.setScissor(0, 0, container.clientWidth, container.clientHeight);
      renderer.setScissorTest(true);
      renderer.render(scene, camera);

      // 渲染小视图
      insetCamera.position.copy(camera.position);
      insetCamera.quaternion.copy(camera.quaternion);
      renderer.setViewport(0, 0, insetSize, insetSize);
      renderer.setScissor(0, 0, insetSize, insetSize);
      renderer.setScissorTest(true);
      renderer.render(insetScene, insetCamera);
    }
    render();
  }, []);

  return <Container ref={containerRef} />;
};
