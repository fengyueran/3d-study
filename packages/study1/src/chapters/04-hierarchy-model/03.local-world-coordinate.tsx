import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const gui = new dat.GUI();

const Container = styled.div`
  height: 100%;
`;

//https://www.bilibili.com/video/BV14r4y1G7h4?p=42&vd_source=052a4a43fb6ce3b0077fb11d296a0c6e
export const LocalWorldCoordinate = () => {
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
    camera.position.set(0, 0, 400);
    camera.lookAt(0, 0, 0);
    //相机对准哪个物体，哪个物体就在画布的中间
    // camera.lookAt(1000, 0, 1000);
    scene.add(camera);

    const geometry = new THREE.BoxGeometry(20, 20, 20);

    const material = new THREE.MeshLambertMaterial({
      color: 0x00ffff,
    });

    //position属性表示对象的位置，但它的表达方式取决于对象的父级。如果对象有父级，则position属性表示对象相对于其父级的位置，
    //这称为局部坐标。如果对象没有父级，则position属性表示对象相对于全局坐标系(世界坐标系)的位置。
    //mesh1有父级group，因此其位置是相对于group的，是模型自身的position和父级所有对象position之和。
    const mesh1 = new THREE.Mesh(geometry, material);
    mesh1.position.x = 50;
    mesh1.position.y = 50;

    const group = new THREE.Group();
    group.position.x = 50;
    group.add(mesh1);
    scene.add(group);

    //长方体的几何体中心默认于本地坐标原点重合
    const geometry2 = new THREE.BoxGeometry(20, 20, 20);
    //无父级，因此其位置是相对于世界坐标系
    const mesh2 = new THREE.Mesh(geometry2, material);

    //平移几何体顶点坐标，geometry2每个顶点的x相当于都加了25
    geometry2.translate(20 / 2, 0, 0);
    scene.add(mesh2);

    const v3 = new THREE.Vector3();
    mesh1.getWorldPosition(v3);

    console.log('mesh1世界坐标', v3);

    const axesHelper1 = new THREE.AxesHelper(20);
    mesh1.add(axesHelper1);

    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(80, 40, 60);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    const webGLRenderer = new THREE.WebGLRenderer({
      antialias: true, //启用抗锯齿
    });
    webGLRenderer.setClearColor(new THREE.Color(0x000));
    webGLRenderer.setSize(container.clientWidth, container.clientHeight);
    webGLRenderer.setPixelRatio(window.devicePixelRatio);

    container.appendChild(webGLRenderer.domElement);

    //OrbitControls会影响相机lookAt值
    const orbitControls = new OrbitControls(camera, webGLRenderer.domElement);

    // orbitControls.target.set(1000, 0, 1000);
    // orbitControls.update();

    function render() {
      mesh1.rotateY(0.01);
      mesh2.rotateY(0.01); //绕局部坐标系的坐标轴Y轴旋转
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
