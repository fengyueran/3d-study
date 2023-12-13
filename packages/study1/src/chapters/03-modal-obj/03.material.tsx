import { useRef, useEffect, version } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const gui = new dat.GUI();

const Container = styled.div`
  height: 100%;
`;

//https://www.bilibili.com/video/BV14r4y1G7h4/?p=37&spm_id_from=pageDriver&vd_source=052a4a43fb6ce3b0077fb11d296a0c6e
export const Material = () => {
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

    const geometry = new THREE.BoxGeometry(20, 20, 20);

    const material = new THREE.MeshLambertMaterial({
      color: 0x00ffff,
    });

    const mesh1 = new THREE.Mesh(geometry, material);
    const mesh2 = new THREE.Mesh(geometry, material);
    mesh2.position.x = 30;

    const mesh3 = mesh1.clone();
    mesh3.position.x = 60;

    const mesh4 = mesh1.clone();
    //clone后材质不再共享
    mesh4.material = mesh1.material.clone();
    mesh4.position.copy(mesh3.position);
    mesh4.position.y += 25;

    //mesh1,mesh2,mesh3的geometry和material是共享的
    scene.add(mesh1, mesh2, mesh3, mesh4);

    material.color = new THREE.Color(0xffff00);

    const v1 = new THREE.Vector3(1, 2, 3);
    const v2 = v1.clone();
    console.log(v1 === v2); //false

    const v3 = new THREE.Vector3(1, 2, 3);
    const v4 = new THREE.Vector3(4, 5, 6);
    v3.copy(v4);
    console.log(v3); // Vector3 {x: 4, y: 5, z: 6}

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
      mesh4.rotation.copy(mesh1.rotation);
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
