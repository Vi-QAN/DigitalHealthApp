// Assuming you have a file input in your React component and a button to trigger the upload

import React, { useState } from 'react';

const File1 = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    console.log(file)
    const formData = new FormData();
    formData.append('file', file);

    fetch('http://localhost:5273/api/Cryptographic/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default File1;
