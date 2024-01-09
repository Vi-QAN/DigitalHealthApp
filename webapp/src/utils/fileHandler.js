import fetch from 'node-fetch'

const baseUrl = 'http://localhost:5273/api';

export const getFileInfoByOwner = async (owner) => {
    return await fetch(baseUrl + '/information/' + owner, {
        method: "GET",
        headers: {
            "Content-type": "application/json"
        },
    }).then(response => response.json())
    .catch(err => {throw new Error("Failed to get file information by owner: ", err)})
}

export const getFileInfoByAccessor = async (accessor) => {
    return await fetch(baseUrl + '/information/accessor/' + accessor, {
        method: "GET",
        headers: {
            "Content-type": "application/json"
        },
    }).then(response => response.json())
    .catch(err => {throw new Error("Failed to get file information by accessor: ", err)})
}

export const savePlainFilesInformation = (metadata) => {
    fetch('http://localhost:5273/api/Information', {
        method: "POST",
        headers: {
        "Content-type": "application/json"
        },
        body: JSON.stringify(metadata)
    }).then(response => response.json()).then(result => result)
    .catch(err => {throw new Error("Failed to add information of plain file: ", err)})
}

export const saveEncryptedFiles = (formData) => {
    fetch(baseUrl + '/File/upload', {
        method: 'POST',
        body: formData,
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
}

export const getEncryptedFile = async (fileHash, owner, accessor) => {
    const queryParams = new URLSearchParams();
    queryParams.append("owner", owner);
    queryParams.append("accessor", accessor);

    const url = `${baseUrl}/file/download/${fileHash}?${queryParams.toString()}`
    try {
        const response = await fetch(url, {
            method: 'GET',
        }).catch(err => console.log(err));
    
        console.log(response);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // for await (const chunk of response.body) {
        //     // Do something with each "chunk"
        //     console.log(chunk)
        // }

        // Parse content disposition header to get the file name
        const contentDisposition = response.headers.get('Content-Disposition');
        const fileName = contentDisposition
            ? contentDisposition.split('filename=')[1].trim()
            : new URL(response.url).searchParams.get('fileName') || 'downloadedFile.txt';

        // Create a new Blob from the response's body
        const blob = await response.blob();
    
        return { blob, fileName }
    } catch (err) {
        console.log(err)
    }
   
    
}