import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import styled from 'styled-components';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

class Wave {
  private vertexShader = `
    attribute float scale;
    
    void main() {
    
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    
      gl_PointSize =  1300.0 / - mvPosition.z;
    
      gl_Position = projectionMatrix * mvPosition;
    
    }
  `;

  private fragmentShader = `
    uniform vec3 color;
    
    void main() {
      gl_FragColor = vec4( color, 1.0 );
    
    }
  `;

  private AmountX = 60;
  private AmountY = 20;
  private Interval = 15;

  private positionYFactor = 0;

  points: THREE.Points<
    THREE.BufferGeometry<THREE.NormalBufferAttributes>,
    THREE.ShaderMaterial
  >;

  constructor() {
    this.points = this.createPoints();
  }

  private createParticlesGeometry = () => {
    const particlesNum = this.AmountX * this.AmountY;

    const positions = new Float32Array(particlesNum * 3);

    let i = 0;

    for (let xNum = 0; xNum < this.AmountX; xNum++) {
      for (let yNum = 0; yNum < this.AmountY; yNum++) {
        positions[i] =
          xNum * this.Interval - (this.AmountX * this.Interval) / 2;
        positions[i + 1] = 0;
        positions[i + 2] =
          yNum * this.Interval - (this.AmountY * this.Interval) / 2;

        i += 3;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    return geometry;
  };

  private createPoints = () => {
    const geometry = this.createParticlesGeometry();

    const material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color('#1677ff') },
      },
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
    });

    const particles = new THREE.Points(geometry, material);
    return particles;
  };

  updatePointsPosition = () => {
    const positions = this.points.geometry.attributes.position.array;

    let i = 0;

    for (let xNum = 0; xNum < this.AmountX; xNum++) {
      for (let yNum = 0; yNum < this.AmountY; yNum++) {
        positions[i + 1] =
          Math.sin((xNum + this.positionYFactor) * 0.3) * 10 +
          Math.sin((yNum + this.positionYFactor) * 0.5) * 10;
        i += 3;
      }
    }

    this.points.geometry.attributes.position.needsUpdate = true;
    this.positionYFactor += 0.1;
  };
}

const initRenderBase = (canvasWidth: number, canvasHeight: number) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    canvasWidth / canvasHeight,
    1,
    10000
  );

  //Obtain the camera position and rotation in advance through OrbitControls
  camera.position.set(-7, 107, 279);
  camera.rotation.set(-0.36, -0.023, -0.009);

  const wave = new Wave();
  scene.add(wave.points);

  const renderer = new THREE.WebGLRenderer();
  renderer.setClearAlpha(0);
  renderer.setSize(canvasWidth, canvasHeight);
  return { wave, renderer, scene, camera };
};

export const PointsWaves = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current!;

    const { wave, renderer, scene, camera } = initRenderBase(
      container.clientWidth,
      container.clientHeight
    );

    // const orbitControls = new OrbitControls(camera, renderer.domElement);
    container.appendChild(renderer.domElement);

    const render = () => {
      requestAnimationFrame(render);
      wave.updatePointsPosition();
      renderer.render(scene, camera);
    };

    render();
  }, []);

  return <Container ref={containerRef} />;
};
