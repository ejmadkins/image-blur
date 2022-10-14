import React from 'react';
import { ImageList } from '@mui/material';
import ProgressItem from './ProgressItem';

const ProgressList = ({ files }) => {
  return (
    <ImageList rowHeight={200} cols={4}>
      {files.map((file, index) => (
        <ProgressItem file={file} key={index} />
      ))}
      <ProgressItem />
    </ImageList>
  );
};

export default ProgressList;
