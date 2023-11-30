// import * as THREE from 'three';
import styled from 'styled-components';

const RootContainer = styled.div`
  width: 100vw;
  height: 100vh;
`;

const Canvas = styled.canvas`
  width: 400px;
  height: 400px;
`;

function App() {
  return (
    <RootContainer>
      <Canvas />
    </RootContainer>
  );
}

export default App;
