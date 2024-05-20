import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

export const OrthographicCameraFullView = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current!;

    // 创建场景
    const scene = new THREE.Scene();

    // 创建正交投影相机

    const camera = new THREE.OrthographicCamera(
      -container.clientWidth / 2,
      container.clientWidth / 2,
      container.clientHeight / 2,
      -container.clientHeight / 2,
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

      const size = new THREE.Vector3();
      boundingBox.getSize(size);

      const aspect = camera.right / camera.top;
      /*
      要将物体充满正交相机，那么正交相机的视椎体宽高刚好能包围住物体的boundingBox
      size.x / size.y > aspect意味着boundingBox的宽度偏大，只要有将相机宽度设置为boundingBox的宽度，再等比例缩放相机高度，就能刚好包围boundingBox
       */
      if (size.x / size.y > aspect) {
        // Wider than tall
        camera.right = size.x / 2;
        camera.left = -size.x / 2;
        camera.top = size.x / 2 / aspect;
        camera.bottom = -size.x / 2 / aspect;
      } else {
        camera.top = size.y / 2;
        camera.bottom = -size.y / 2;
        camera.right = (size.y / 2) * aspect;
        camera.left = (-size.y / 2) * aspect;
      }

      const maxDim = Math.max(size.x, size.y, size.z);
      const offset = maxDim * 1.5; // Ensure the camera is far enough to view the whole bounding box
      const direction = camera.position.clone().sub(center).normalize();
      /*
      newPosition通过从中心点沿着 direction 方向移动 offset 距离得到
      */
      const newPosition = center.clone().add(direction.multiplyScalar(offset));

      camera.position.copy(newPosition);
      camera.lookAt(center);

      camera.updateProjectionMatrix();
      orbitControls.target.copy(center);
      orbitControls.update();
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
