import styled from 'styled-components';
import { Key } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { examples } from './examples';
import { Catalogue } from './features';

const RootContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
`;

const CatalogueWrapper = styled.div`
  width: 300px;
  height: 100%;
  padding-top: 20px;
  border-right: 1px solid rgba(0, 0, 0, 0.2);
`;

const Canvas = styled.div`
  width: calc(100% - 300px);
`;

function App() {
  const naviagte = useNavigate();

  const onSelect = (nodes: Key[]) => {
    const nodeId = nodes[0] as keyof typeof examples;
    if (examples[nodeId]) {
      naviagte(nodeId);
    }
  };

  const First = examples['1'];
  return (
    <RootContainer>
      <CatalogueWrapper>
        <Catalogue onSelect={onSelect} />
      </CatalogueWrapper>
      <Canvas>
        <Routes>
          <Route path="/" element={<First />} />
          {Object.entries(examples).map(([path, Component]) => {
            return <Route key={path} path={path} element={<Component />} />;
          })}
        </Routes>
      </Canvas>
    </RootContainer>
  );
}

export default App;
