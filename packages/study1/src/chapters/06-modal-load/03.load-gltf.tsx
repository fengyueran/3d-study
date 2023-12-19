import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

//它是一个父文件，同级目录的其它文件也需要，加载时只需要加载gltf文件
import helmet from './glTF/DamagedHelmet.gltf';

const Container = styled.div`
  height: 100%;
`;

//https://www.bilibili.com/video/BV14r4y1G7h4?p=56&vd_source=052a4a43fb6ce3b0077fb11d296a0c6e
export const LoadGltf = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const modal = new THREE.Group();

  useEffect(() => {
    const loader = new GLTFLoader();

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
    // camera.position.set(0, 0, 10); //根据物体尺寸设置位置，尺寸在10，就可以大概设置成0, 0, 10
    camera.position.set(-1.3, 0.77, -9.87); //旋转到一定角度，根据camera.position得到的位置
    // camera.lookAt(0, 0, 0);
    //相机对准哪个物体，哪个物体就在画布的中间，跟拍照似的
    camera.lookAt(-0.78, -0.056, 0.098); // 鼠标右键挪动位置，根据orbitControls.target得到的lookAt值
    scene.add(camera);

    // 在使用 Three.js 加载外部三维模型时，默认情况下，模型的几何中心通常是相对于其局部坐标系的原点。
    // 如果模型文件中的局部坐标系原点与模型的几何中心重合，那么加载到场景中时，模型的几何中心就会自然地位于场景的中心
    loader.load(helmet, (gltf) => {
      modal.add(gltf.scene);
      gltf.scene.traverse((obj) => {
        console.log('obj.name', obj.name);
        obj.material = obj.material.clone(); //解决材质共享的问题
      });
    });

    scene.add(modal);

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

    orbitControls.target.set(-0.78, -0.056, 0.098);
    orbitControls.update();

    function render() {
      // console.log('camera.position', camera.position); //根据camera.position可以在初始化时调整到最佳视角
      // console.log('orbitControls.target', orbitControls.target); //根据orbitControls.target可以在初始化时调整场景中心对准的位置
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
