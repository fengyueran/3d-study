import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Container = styled.div`
  height: 100%;
`;

//https://www.bilibili.com/video/BV14r4y1G7h4?p=20&spm_id_from=pageDriver&vd_source=052a4a43fb6ce3b0077fb11d296a0c6e
export const MeshPhongMaterial = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = new THREE.Scene();

    const container = containerRef.current!;

    //https://threejs.org/examples/?q=webgl%20ca#webgl_camera
    //4个参数可以决定视椎体的大小，透视投影，远小近大
    const camera = new THREE.PerspectiveCamera(
      30, //摄像机视锥体垂直视野角度，角度越大椎体体积越大，物体相对就会更小
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    //相机挪得太远，远平面外的物体不会显示，相机位置的挪动不会改变视椎体的大小
    camera.position.set(0, 0, 200);
    camera.lookAt(0, 0, 0);
    //相机对准哪个物体，哪个物体就在画布的中间
    // camera.lookAt(1000, 0, 1000);
    scene.add(camera);

    //立方体
    const cubeGeometry = new THREE.BoxGeometry(15, 15, 15);
    //MeshBasicMaterial不受光照影响
    const material = new THREE.MeshLambertMaterial({
      color: 0x00ffff,
    });

    const cube = new THREE.Mesh(cubeGeometry, material);
    cube.position.x = -30;
    scene.add(cube);

    //球体
    const sphereGeometry = new THREE.SphereGeometry(10);
    const sphere = new THREE.Mesh(sphereGeometry, material);
    scene.add(sphere);

    //圆柱体
    const cylinderGeometry = new THREE.CylinderGeometry(10, 15, 15);
    const cylinder = new THREE.Mesh(cylinderGeometry, material);
    cylinder.position.x = -60;
    scene.add(cylinder);

    //矩形平面
    const planeGeometry = new THREE.PlaneGeometry(10, 15);
    const planeMaterial = new THREE.MeshLambertMaterial({
      color: 0x00ffff,
      side: THREE.FrontSide, //默认只有正面可见
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.x = 20;
    scene.add(plane);

    //圆形平面
    const circleGeometry = new THREE.CircleGeometry(10);
    const circleMaterial = new THREE.MeshLambertMaterial({
      color: 0x00ffff,
      side: THREE.DoubleSide, //两面可见
    });
    const circle = new THREE.Mesh(circleGeometry, circleMaterial);
    circle.position.x = 40;
    scene.add(circle);

    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    const pointLight = new THREE.PointLight(0xffffff, 100000);
    pointLight.position.set(0, 0, 300);
    scene.add(pointLight);

    const pointLightHelper = new THREE.PointLightHelper(pointLight, 4);
    scene.add(pointLightHelper);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const webGLRenderer = new THREE.WebGLRenderer();
    webGLRenderer.setClearColor(new THREE.Color(0x000));
    webGLRenderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(webGLRenderer.domElement);

    //OrbitControls会影响相机lookAt值
    const orbitControls = new OrbitControls(camera, webGLRenderer.domElement);

    // orbitControls.target.set(1000, 0, 1000);
    // orbitControls.update();

    function render() {
      requestAnimationFrame(render);
      webGLRenderer.render(scene, camera);
    }
    render();

    window.onresize = () => {
      webGLRenderer.setSize(container.clientWidth, container.clientHeight);
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
    };
  }, []);

  return <Container ref={containerRef} />;
};
