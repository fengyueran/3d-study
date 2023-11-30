import styled from 'styled-components';

import { chapter1 } from './chapters';

const RootContainer = styled.div`
  width: 100vw;
  height: 100vh;
`;

function App() {
  return (
    <RootContainer>
      <chapter1.OrbitControl />
    </RootContainer>
  );
}

export default App;
