import React, { useState, useEffect } from 'react';
import { ImageListItem, Box } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import CircularProgressWithLabel from './CicularProgressWithLabel';

const ProgressItem = ({ file }) => {
  const [progress] = useState(100);
  const [imageUrl, setImageUrl] = useState(null);
  useEffect(() => {
    if (file) {
      setImageUrl(URL.createObjectURL(file));
    }
  }, [file]);

  return (
    <div>
      {file && (
        <ImageListItem cols={1} rows={1}>
          <img src={imageUrl} alt="gallery" loading="lazy" />
          <Box sx={backDrop}>
            {progress < 100 ? (
              <CircularProgressWithLabel value={progress} />
            ) : (
              <CheckCircleOutline sx={{ width: 60, height: 60, color: 'lightGreen' }} />
            )}
          </Box>
        </ImageListItem>
      )}
    </div>
  );
};

export default ProgressItem;

const backDrop = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(0,0,0, .5)'
};
