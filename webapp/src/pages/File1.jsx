// Assuming you have a file input in your React component and a button to trigger the upload

import React, { useState, useContext, useEffect } from 'react';
import { authContext } from '../hooks/useAuth';
import { useNavigate} from 'react-router-dom';

const File1 = () => {
  const [file, setFile] = useState(null);
  
  const { contract, authed, user } = useContext(authContext);
  const navigate = useNavigate();


  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    console.log(user);
    console.log(file);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user', JSON.stringify(user));

    fetch('http://localhost:5273/api/File/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  };

  useEffect(() => {
    // if (!authed){
    //   navigate('/login');
    // }
    //setupBlockChain();
    //setupIPFS();
  },[]);

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default File1;
