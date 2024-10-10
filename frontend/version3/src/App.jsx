import styled from 'styled-components';
import AudioList from './components/AudioList/AudioList';

const AppContainer = styled.div`
  font-family: Arial, sans-serif;
  padding: 20px;
`;

const App = () => {
  return (
    <AppContainer>
      <h1>Audio Library</h1>
      <AudioList />
    </AppContainer>
  );
};

export default App;
