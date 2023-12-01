import styled from 'styled-components';

import { chapter1 } from './chapters';
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
  flex-grow: 1;
`;

function App() {
  return (
    <RootContainer>
      <CatalogueWrapper>
        <Catalogue />
      </CatalogueWrapper>
      <Canvas>
        <chapter1.OrbitControl />
      </Canvas>
    </RootContainer>
  );
}

export default App;
