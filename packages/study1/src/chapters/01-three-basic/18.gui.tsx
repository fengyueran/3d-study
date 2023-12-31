import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const gui = new dat.GUI();

const Container = styled.div`
  height: 100%;
`;

// gui.domElement.style.width = '50px';

//https://www.bilibili.com/video/BV14r4y1G7h4/?p=22&spm_id_from=pageDriver&vd_source=052a4a43fb6ce3b0077fb11d296a0c6e
export const Gui = () => {
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
    camera.position.set(100, 100, 250);
    camera.lookAt(0, 0, 0);
    //相机对准哪个物体，哪个物体就在画布的中间
    // camera.lookAt(1000, 0, 1000);
    scene.add(camera);

    //高MeshLambertMaterial是漫反射，反射向四周发散
    const material = new THREE.MeshLambertMaterial({
      color: 0x00ffff,
    });

    //立方体
    const cubeGeometry = new THREE.BoxGeometry(50, 50, 50);

    const cube = new THREE.Mesh(cubeGeometry, material);
    scene.add(cube);

    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    // const pointLight = new THREE.PointLight(0xffffff, 10000);
    // pointLight.position.set(80, 40, 60);
    // scene.add(pointLight);

    // const pointLightHelper = new THREE.PointLightHelper(pointLight, 4);
    // scene.add(pointLightHelper);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(80, 40, 60);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    const light = gui.addFolder('光源');
    light.add(ambientLight, 'intensity', 0, 2).name('环境光').step(0.1);
    light.add(directionalLight, 'intensity', 0, 2).name('平行光');
    light.open(); //展开

    gui.add(cube.position, 'x', 0, 100);
    gui.add(cube.position, 'y', 0, 100);
    gui.add(cube.position, 'z', 0, 100);

    const obj = {
      color: 0x00ffff,
      cubeX: 0,
      rotate: false,
    };
    gui.addColor(obj, 'color').onChange((v) => {
      cube.material.color.set(v);
    });

    gui.add(obj, 'cubeX', [-100, 0, 100]).onChange((v) => {
      cube.position.x = v;
    });

    gui.add(obj, 'rotate').onChange((v) => {
      cube.position.x = v;
    });

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
      if (obj.rotate) {
        cube.rotateY(0.01);
      }

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
