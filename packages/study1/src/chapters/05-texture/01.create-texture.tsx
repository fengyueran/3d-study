import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import earth from './earth.jpg';

const gui = new dat.GUI();

const Container = styled.div`
  height: 100%;
`;

//https://www.bilibili.com/video/BV14r4y1G7h4?p=48
export const CreateTexture = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(earth);

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

    const geometry = new THREE.SphereGeometry(30);

    const material = new THREE.MeshLambertMaterial({
      map: texture,
    });

    const mesh = new THREE.Mesh(geometry, material);

    scene.add(mesh);

    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
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
      mesh.rotateY(0.01);
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
