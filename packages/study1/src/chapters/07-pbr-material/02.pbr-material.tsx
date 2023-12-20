import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

//它是一个父文件，同级目录的其它文件也需要，加载时只需要加载gltf文件
import coffeemat from './glTF/scene.gltf';

const Container = styled.div`
  height: 100%;
`;

// PBR相关理论介绍文章
// 半小时了解PBR: https://zhuanlan.zhihu.com/p/37639418
// PBR知识体系整理: https://zhuanlan.zhihu.com/p/100596453
// PBR核心知识体系总结与概览:https://zhuanlan.zhihu.com/p/53086060

//https://www.bilibili.com/video/BV14r4y1G7h4?p=56&vd_source=052a4a43fb6ce3b0077fb11d296a0c6e
/**
 threejs中PBR(基于物理光照模型)材质有两个MeshStandardMaterial和MeshPhysicalMaterial,MeshPhysicalMaterial是MeshStandardMaterial子类
 PBR材质没有光源时物体显示为黑色
 */
export const PbrMaterial = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const modal = new THREE.Group();

  useEffect(() => {
    const scene = new THREE.Scene();

    const container = containerRef.current!;

    //https://threejs.org/examples/?q=webgl%20ca#webgl_camera
    //4个参数可以决定视椎体的大小，透视投影，远小近大
    const camera = new THREE.PerspectiveCamera(
      30, //摄像机视锥体垂直视野角度，角度越大椎体体积越大，物体相对就会更小
      container.clientWidth / container.clientHeight,
      0.1,
      3000
    );

    //相机挪得太远，远平面外的物体不会显示，相机位置的挪动不会改变视椎体的大小
    // camera.position.set(0, 0, 10); //根据物体尺寸设置位置，尺寸在10，就可以大概设置成0, 0, 10
    camera.position.set(0, 0, 1); //旋转到一定角度，根据camera.position得到的位置
    camera.lookAt(0, 0, 0);

    scene.add(camera);

    const loader = new GLTFLoader();

    loader.load(
      coffeemat,
      (gltf) => {
        modal.add(gltf.scene);
        const boundingBox = new THREE.Box3().setFromObject(gltf.scene);
        //查看模型大小
        console.log('Bounding Box:', boundingBox);

        gltf.scene.traverse((obj) => {
          console.log('obj.name', obj.material);
          if (obj.material) {
            obj.material.metalness = 0.1; //金属度0-1，像金属的程度，越大越像金属
            obj.material.roughness = 1; //粗糙度0-1，粗糙程度，越大越粗糙，反射能力越弱，1表示完全漫反射，0表示镜面反射
          }
        });
      },
      undefined,
      (error) => {
        console.error('Error loading glTF model', error);
      }
    );

    scene.add(modal);

    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.PointLight(0xffffff, 1000);
    directionalLight.position.set(8, 4, 6);
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

    // orbitControls.target.set(-0.78, -0.056, 0.098);
    // orbitControls.update();

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
