import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const gui = new dat.GUI();

const Container = styled.div`
  height: 100%;
`;

//https://www.bilibili.com/video/BV14r4y1G7h4?p=33&vd_source=052a4a43fb6ce3b0077fb11d296a0c6e
export const PlaneNormal = () => {
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
    camera.position.set(300, 300, 700);
    camera.lookAt(0, 0, 0);
    //相机对准哪个物体，哪个物体就在画布的中间
    // camera.lookAt(1000, 0, 1000);
    scene.add(camera);

    //创建一个空的几何体
    const geometry = new THREE.BufferGeometry();

    /* prettier-ignore */
    //顶点坐标
    const vertices = new Float32Array([
      //矩形平面第一个三角形，这俩三角形的方向需要一样，不然正反面不一样
      0, 0, 0,
      80, 0, 0,
      80, 80, 0,
     //矩形平面第二个三角形
      0, 0, 0, 
      80, 80, 0,
      0, 80, 0,
    ]);

    /* prettier-ignore */
    //顶点法线数据，法线改变受光照影响会改变
    const normals = new Float32Array([
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
    ]);

    //没有法线数据，则MeshLambertMaterial材质不会显示
    geometry.attributes.normal = new THREE.BufferAttribute(normals, 3);

    //创建属性缓冲区对象
    //3表示三个为一组，表示一个顶点的x、y、z坐标
    const position = new THREE.BufferAttribute(vertices, 3);

    geometry.attributes.position = position;

    const axesHelper = new THREE.AxesHelper(200);
    scene.add(axesHelper);

    //MeshLambertMaterial受光照影响，对于BufferGeometry需要定义顶点法线数据
    const meshMaterial = new THREE.MeshLambertMaterial({
      color: 0x00fffff,
      side: THREE.DoubleSide,
    });
    //按顶点顺序生成三角面
    //按顶点位置绘制三角面，逆时针为三角面正面，顺时针为背面
    const mesh = new THREE.Mesh(geometry, meshMaterial);
    scene.add(mesh);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(80, 40, 60);
    scene.add(directionalLight);

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
