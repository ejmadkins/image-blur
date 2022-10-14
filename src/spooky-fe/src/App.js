import React from 'react';
import Nav from './components/nav/Nav';
import DisplayImages from './components/displayImages/DisplayImages';
import Upload from './components/upload/Upload';
import { Container } from '@mui/material';

function App() {
  return (
    <Container>
      <Nav />
      <Upload />
      <DisplayImages />
    </Container>
  );
}

export default App;
