import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Container = styled.div`
  height: 100%;
`;

export const OrthographicCamera = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current!;

    const webGLRenderer = new THREE.WebGLRenderer();
    webGLRenderer.setClearColor(new THREE.Color(0x000));
    webGLRenderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(webGLRenderer.domElement);

    // 创建场景
    const scene = new THREE.Scene();

    // 创建正交投影相机
    const width = 5;
    const height = 5;
    const near = 0.1;
    const far = 6;
    const camera = new THREE.OrthographicCamera(
      -width / 2,
      width / 2,
      height / 2,
      -height / 2,
      near,
      far
    );

    // 设置相机的位置和朝向
    camera.position.set(0, 0, 3);
    camera.lookAt(0, 0, 0);

    const axesHelper = new THREE.AxesHelper(1000);
    scene.add(axesHelper);

    // 创建一个表示相机裁剪空间的长方体
    const cameraFrustum = new THREE.LineSegments(
      new THREE.EdgesGeometry(
        //将长方体缩小，以使相机的长方体空间能包含这个长方体，从而能显示出来，
        //如果和相机裁剪空间宽高一样大，意味着这个长方体会铺满整个画布
        new THREE.BoxGeometry(width - 2, height - 2, far - near - 2)
      ),
      new THREE.LineBasicMaterial({ color: 0xffffff })
    );
    scene.add(cameraFrustum);

    // 创建一个立方体表示场景中的物体
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    scene.add(cube);

    const orbitControls = new OrbitControls(camera, webGLRenderer.domElement);

    function render() {
      requestAnimationFrame(render);
      webGLRenderer.render(scene, camera);
    }
    render();
  }, []);

  return <Container ref={containerRef} />;
};
