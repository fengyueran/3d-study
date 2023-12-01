import styled from 'styled-components';
import { Key } from 'react';
import { lessons } from './chapters';
import { Catalogue } from './features';
import { useState } from 'react';

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
  flex-grow: 1;
`;

function App() {
  const [nodeId, setNodeId] = useState<keyof typeof lessons>();

  const onSelect = (nodes: Key[]) => {
    const nodeId = nodes[0] as keyof typeof lessons;
    setNodeId(nodeId);
  };

  const Lesson = nodeId && lessons[nodeId];

  return (
    <RootContainer>
      <CatalogueWrapper>
        <Catalogue onSelect={onSelect} />
      </CatalogueWrapper>
      <Canvas>{Lesson && <Lesson />}</Canvas>
    </RootContainer>
  );
}

export default App;
