import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

// 顶点着色器
const vertexShader = `
    varying float vDot;
    void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vec3 worldNormal = normalize(mat3(modelMatrix) * normal);
        vec3 toCamera = normalize(cameraPosition - worldPosition.xyz);
        vDot = max(dot(worldNormal, toCamera), 0.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

// 片段着色器
const fragmentShader = `
    varying float vDot;
    void main() {
        vec3 color = mix(vec3(0.0, 0.0, 0.0), vec3(1.0, 0.0, 0.0), vDot);
        gl_FragColor = vec4(color, 1.0);
    }
`;

export const GradientEdgeSphere = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  console.log('99999');
  useEffect(() => {
    const container = containerRef.current!;

    // 创建场景
    const scene = new THREE.Scene();

    // 创建透视投影相机
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(2, 2, 10);
    // camera.lookAt(0, 10, 0);

    scene.add(camera);

    // const cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    // //MeshBasicMaterial不受光照影响
    // const cubeMaterial = new THREE.MeshBasicMaterial({
    //   color: 0xffff00,
    //   transparent: true,
    //   opacity: 0.5,
    //   // wireframe: true,
    // });
    // const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    // cube.position.set(0, 10, 0);
    // scene.add(cube);

    // 创建着色器材质
    const shaderMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    // 创建球体几何体并应用着色器材质
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const sphere = new THREE.Mesh(geometry, shaderMaterial);
    scene.add(sphere);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(new THREE.Color(0xffffff));
    renderer.setSize(container.clientWidth, container.clientHeight);
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    container.appendChild(renderer.domElement);

    const render = () => {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
    };

    render();
  }, []);

  return <Container ref={containerRef} />;
};
