import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import earth from './earth.jpg';

const Container = styled.div`
  height: 100%;
`;

//https://www.bilibili.com/video/BV14r4y1G7h4?p=49&vd_source=052a4a43fb6ce3b0077fb11d296a0c6e
export const CustomUV = () => {
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

    //创建一个空的几何体
    const geometry = new THREE.BufferGeometry();

    /* prettier-ignore */
    //顶点坐标
    const vertices = new Float32Array([
      0, 0, 0,
      120, 0, 0,
      120, 80, 0,
      0, 80, 0,
    ]);

    //创建属性缓冲区对象
    //3表示三个为一组，表示一个顶点的x、y、z坐标
    const position = new THREE.BufferAttribute(vertices, 3);

    geometry.attributes.position = position;

    const indexes = new Uint16Array([0, 1, 2, 0, 2, 3]);
    geometry.index = new THREE.BufferAttribute(indexes, 1);

    //创建一个空的几何体
    const geometry2 = new THREE.BufferGeometry();

    /* prettier-ignore */
    //顶点坐标
    const vertices2 = new Float32Array([
      -120, 0, 0,
      0, 0, 0,
      0, 80, 0,
      -120, 80, 0,
    ]);

    //创建属性缓冲区对象
    //3表示三个为一组，表示一个顶点的x、y、z坐标
    const position2 = new THREE.BufferAttribute(vertices2, 3);

    geometry2.attributes.position = position2;

    const indexes2 = new Uint16Array([0, 1, 2, 0, 2, 3]);
    geometry2.index = new THREE.BufferAttribute(indexes2, 1);

    const axesHelper = new THREE.AxesHelper(200);
    scene.add(axesHelper);

    const loader = new THREE.TextureLoader();
    const texture = loader.load(earth);

    const meshMaterial = new THREE.MeshBasicMaterial({
      map: texture,
    });

    /* prettier-ignore */
    const uvs = new Float32Array([
       0, 0,
       1, 0,
       1, 1,
       0, 1
    ]);
    geometry.attributes.uv = new THREE.BufferAttribute(uvs, 2);

    /* prettier-ignore */
    const uvs2 = new Float32Array([
        0, 0,
        0.5, 0,
        0.5, 0.5, 
        0, 0.5
     ]);
    geometry2.attributes.uv = new THREE.BufferAttribute(uvs2, 2);

    //按顶点顺序生成三角面
    //按顶点位置绘制三角面，逆时针为三角面正面，顺时针为背面
    const mesh = new THREE.Mesh(geometry, meshMaterial);
    scene.add(mesh);

    const mesh2 = new THREE.Mesh(geometry2, meshMaterial);
    scene.add(mesh2);

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
