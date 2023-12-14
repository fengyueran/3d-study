import { useRef, useEffect, version } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const gui = new dat.GUI();

const Container = styled.div`
  height: 100%;
`;

//https://www.bilibili.com/video/BV14r4y1G7h4?p=42&vd_source=052a4a43fb6ce3b0077fb11d296a0c6e
export const Group = () => {
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

    const geometry = new THREE.BoxGeometry(40, 80, 20);

    const material = new THREE.MeshLambertMaterial({
      color: 0x00ffff,
    });

    const mesh1 = new THREE.Mesh(geometry, material);
    mesh1.name = '1#楼';
    const mesh2 = new THREE.Mesh(geometry, material);
    mesh2.position.x = 50;
    mesh2.name = '2#楼';

    const group1 = new THREE.Group();
    group1.name = '高层';
    group1.add(mesh1, mesh2);

    group1.translateY(30);
    // group1.scale.set(0.5, 0.5, 0.5);

    console.log('group.children', group1.children);
    const geometry2 = new THREE.BoxGeometry(40, 40, 20);
    const material2 = new THREE.MeshLambertMaterial({
      color: 0xffff00,
    });
    const mesh3 = new THREE.Mesh(geometry2, material2);
    mesh3.name = '3#楼';
    mesh3.position.z = 30;
    const mesh4 = new THREE.Mesh(geometry2, material2);
    mesh4.name = '4#楼';
    mesh4.position.x = 50;
    mesh4.position.z = 30;

    const group2 = new THREE.Group();
    group2.name = '洋房';
    group2.add(mesh3, mesh4);

    const group = new THREE.Group();
    group.name = '小区房子';
    group.add(group1, group2);

    group.traverse((modal) => {
      console.log('modal.name', modal.name);
      if (modal.name === '3#楼') {
        modal.material = new THREE.MeshLambertMaterial({
          color: 0x00ff00,
        });
      }
    });

    scene.add(group);

    const modal = scene.getObjectByName('4#楼') as THREE.Mesh;
    modal.material = new THREE.MeshLambertMaterial({
      color: 0xff0000,
    });

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
