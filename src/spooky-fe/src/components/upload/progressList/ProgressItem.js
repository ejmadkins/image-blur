import React, { useState, useEffect } from 'react';
import { ImageListItem, Box } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import CircularProgressWithLabel from './CicularProgressWithLabel';
import { v4 as uuidv4 } from 'uuid';
import uploadFileProgress from '../../../firebase/uploadFileProgress';

const ProgressItem = ({ file }) => {
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  // const currentUser = { uid: 'userId' };
  useEffect(() => {
    if (file) {
      console.log(file);
      const uploadImage = async () => {
        console.log(file);
        const imageName = uuidv4() + '.' + file.name.split('.').pop();
        try {
          const url = await uploadFileProgress(file, 'source/', imageName, setProgress);
          console.log(url);
          setImageUrl(null);
        } catch (error) {
          alert(error.message);
          console.log(error);
        }
      };
      console.log('here');
      setImageUrl(URL.createObjectURL(file));
      uploadImage();
    }
  }, [file]);

  return (
    <div>
      {imageUrl && (
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
