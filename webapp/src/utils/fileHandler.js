import fetch from 'node-fetch'

export const getFileInfoByOwner = async (owner) => {
    return await fetch('http://localhost:5273/api/information/' + owner, {
        method: "GET",
        headers: {
            "Content-type": "application/json"
        },
    }).then(response => response.json())
    .catch(err => {throw new Error("Failed to get file information by owner: ", err)})
}

export const getFileInfoByAccessor = async (accessor) => {
    return await fetch('http://localhost:5273/api/information/accessor/' + accessor, {
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
    fetch('http://localhost:5273/api/File/upload', {
        method: 'POST',
        body: formData,
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
}