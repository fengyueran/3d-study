import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

//它是一个父文件，同级目录的其它文件也需要，加载时只需要加载gltf文件
import coffeemat from './car/scene.gltf';

const gui = new dat.GUI();

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
 */
export const PhysicalMaterial = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const modalGroup = new THREE.Group();

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
    camera.position.set(0, 10, 30); //旋转到一定角度，根据camera.position得到的位置
    camera.lookAt(0, 0, 0);

    scene.add(camera);

    // cubeTexture.generateMipmaps = false;
    const loader = new GLTFLoader();

    loader.load(
      coffeemat,
      (gltf) => {
        modalGroup.add(gltf.scene);

        // const boundingBox = new THREE.Box3().setFromObject(gltf.scene);
        // //查看模型大小
        // console.log('Bounding Box:', boundingBox);

        const modal = gltf.scene.getObjectByName('body') as THREE.Mesh;

        gltf.scene.traverse((obj) => {
          console.log('obj.name', obj.material);
          //车身
          if (obj.material?.name === 'body') {
            obj.material = new THREE.MeshPhysicalMaterial({
              // color: 'red',
              metalness: 0.9,
              roughness: 0.5,
              clearcoatRoughness: 0.1,
              //清漆层，物体表面透明图层厚度，0-1
              clearcoat: 0.1,
            });
            gui.add(obj.material, 'clearcoat', 0, 1);
          }

          //玻璃
          if (obj.material?.name === 'black_glass') {
            debugger; //eslint-disable-line

            obj.material = new THREE.MeshPhysicalMaterial({
              //透光率0-1，越大越透光
              transmission: 1,
              //折射率15-2.33
              ior: 1.5,
            });
          }
        });
      },
      undefined,
      (error) => {
        console.error('Error loading glTF model', error);
      }
    );

    scene.add(modalGroup);

    //环境贴图影响所有模型
    // scene.environment = cubeTexture;

    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.PointLight(0xffffff, 1000);
    directionalLight.position.set(20, 20, 20);
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
