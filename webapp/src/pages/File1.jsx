// Assuming you have a file input in your React component and a button to trigger the upload

import React, { useState, useContext, useEffect } from 'react';
import { authContext } from '../hooks/useAuth';
import { useLocation } from 'react-router-dom';

const File1 = () => {
  const [file, setFile] = useState(null);
  const location = useLocation();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    console.log(location);
    console.log(file);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user', JSON.stringify(location.state));

    
  };

  useEffect(() => {
    console.log(location.state)
  },[]);

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default File1;
