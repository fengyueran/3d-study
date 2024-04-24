import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

export const FullView = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current!;

    // 创建场景
    const scene = new THREE.Scene();

    // 创建透视投影相机
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 350);

    scene.add(camera);

    // 创建球体几何体并应用着色器材质
    const geometry = new THREE.SphereGeometry(40);
    const material = new THREE.MeshBasicMaterial({
      color: 'blue',
      wireframe: true,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(new THREE.Color(0xffffff));
    renderer.setSize(container.clientWidth, container.clientHeight);
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    container.appendChild(renderer.domElement);

    const zoomTo = () => {
      const boundingBox = new THREE.Box3();

      scene.traverse(function (object) {
        if (object.isMesh) {
          // 确保只计算网格对象
          boundingBox.expandByObject(object);
        }
      });

      const boxHelper = new THREE.Box3Helper(boundingBox, 'black'); // 使用黄色标识边界盒

      // 将边界盒helper添加到场景中
      scene.add(boxHelper);

      // 计算包围盒中心
      const center = new THREE.Vector3();
      boundingBox.getCenter(center);

      const boundingSphere = new THREE.Sphere();
      /*
      半径是从中心点到任一角点的直线距离。由于盒子是对称的，并且中心位于原点，我们可以直接计算从原点到点(40, 40, 40)的距离，这也是盒子任一角的距离。
      半径 r 的计算公式是：
      r=√(x^2+y^2+z^2)=√(40^2+40^2+40^2)=69.28
      算出来会比球体大：可以想象这个盒子是包围着球的，到盒子各个角到球心的距离(69.28)是大于球体半径的。
      */
      boundingBox.getBoundingSphere(boundingSphere); // 传递Sphere对象给getBoundingSphere
      const radius = boundingSphere.radius;

      // 计算相机位置，使包围盒充满视图
      //60度的视野角度，40的半径，distance为80时刚好球体可以充满整个视图，但是getBoundingSphere获得的半径实际上是比球体半径大的，导致distance增大
      //球体也就不会充满整个视图
      const distance = radius / Math.sin((Math.PI / 180.0) * camera.fov * 0.5);
      const direction = camera.position.clone().sub(center).normalize();
      const newPosition = center
        .clone()
        .add(direction.multiplyScalar(distance));

      // 设置相机位置和视角
      camera.position.copy(newPosition);
      orbitControls.target.copy(center);
      camera.lookAt(center);

      // 更新视图
      orbitControls.update();
      render();
    };

    const render = () => {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
    };

    render();
    setTimeout(() => {
      zoomTo();
    }, 2000);
  }, []);

  return <Container ref={containerRef} />;
};
