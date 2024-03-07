import fetch from 'node-fetch'

const baseUrl = `${process.env.REACT_APP_SERVER_ENDPOINT}/api`;

const headers = {
    "Content-type": "application/json",
    "ngrok-skip-browser-warning" : "0"
};

////////////////////////////////////////
// User Requests
////////////////////////////////////////
export const getUserList = async () => {
    return await fetch(`${baseUrl}/User`, {
        method: "GET",
        headers: headers
    })
    .then((res) => res.json())
    .then(result => result)
    .catch(err => console.error(err)); 
}

////////////////////////////////////////
// Authentication Requests
////////////////////////////////////////
export const loginRequest = async ({account}) => {
    return await fetch(`${baseUrl}/User/` + account, {
        method: "GET",
        headers: headers
    })
    .then((res) => res.json())
    .then(result => result)
    .catch(err => console.error(err)); 
}

export const registerRequest = async ({name, account}) => {
    return await fetch(`${baseUrl}/User/signup`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
            "userName": name,
            "key": account
        })
    }).catch(err => console.error(err))
}

////////////////////////////////////////
// Authorization Requests
////////////////////////////////////////
export const getAuthorizationList = async ({userId}) => {
    return await fetch(`${baseUrl}/user/` + userId +'/authorization/', {
        method: "GET",
        headers: headers
      })
      .then(response => response.json())
      .then(result => result)
      .catch(err => console.error(err));
}

export const authorizeRequest = async ({ownerId, accessorId}) => {
    return await fetch(`${baseUrl}/user/` + ownerId +'/authorization/', {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        "OwnerId": ownerId,
        "AccesserId": accessorId,
      })
    })
    .then(response => response.json())
    .catch(err => console.error(err));
}

export const revokeAuthorizationRequest = async ({ownerId, accessorId}) => {
    return await fetch(`${baseUrl}/user/` + ownerId +'/authorization/', {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({
        "OwnerId": ownerId,
        "AccesserId": accessorId,
      })
    })
    .then(response => response.json())
    .catch(err => console.error(err));
}

////////////////////////////////////////
// File Information Requests
////////////////////////////////////////
export const getFileInfoByOwner = async (owner) => {
    return await fetch(baseUrl + '/information/' + owner, {
        method: "GET",
        headers: headers
    }).then(response => response.json())
    .catch(err => console.error("Failed to get file information by owner: ", err));
}

export const getFileInfoByAccessor = async (accessor) => {
    return await fetch(baseUrl + '/information/accessor/' + accessor, {
        method: "GET",
        headers: headers,
    }).then(response => response.json())
    .catch(err => console.error("Failed to get file information by accessor: ", err))
}

///////////////////////////////////
// File Content Requests
///////////////////////////////////
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

export const getHL7File = async (fileHash, owner, accessor) => {
    if (!owner || !accessor) return; 
    const response =  await getEncryptedFile(fileHash, owner, accessor)
    return await response.json();
}

export const getRegularFile = async (fileHash, owner, accessor) => {
    if (!owner || !accessor) return; 
    const response =  await getEncryptedFile(fileHash, owner, accessor)
    
    // Parse content disposition header to get the file name
    const contentDisposition = response.headers.get('Content-Disposition');
    const fileName = contentDisposition
        ? contentDisposition.split('filename=')[1].trim()
        : new URL(response.url).searchParams.get('fileName') || 'downloadedFile.txt';

    // Create a new Blob from the response's body
    const blob = await response.blob();

    return { blob, fileName }
}

const getEncryptedFile = async (fileHash, owner, accessor) => {
    const queryParams = new URLSearchParams();
    queryParams.append("owner", owner);
    queryParams.append("accessor", accessor);

    const url = `${baseUrl}/file/download/${fileHash}?${queryParams.toString()}`
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        }).catch(err => console.log(err));
    
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response;

        
    } catch (err) {
        console.log(err)
    }
}

export const deleteFile = async (fileId) => {
    const url = `${baseUrl}/file/${fileId}`;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: headers
        }).catch(err => console.log(err));
    
        if (!response.ok) {
            return `Fail to delete the file ${response.status}`;
        } else {
            return `File Deleted Successfully`
        }


        
    } catch (err) {
        console.log(err)
    }
}

/////////////////////////////////////////
// Notification Request 
////////////////////////////////////////
export const getNotifications = async (userId) => {
    return await fetch(`${baseUrl}/notifications/?userId=${userId}`, {
        method: "GET",
        headers: headers,
    })
    .then(result => result.json())
    .catch(err => console.error(err));
}

export const updateNotification = async (id) => {
    return await fetch(`${baseUrl}/notifications/${id}`, {
        method: "PUT",
        headers: headers,
    })
    .catch(err => console.error(err));
}

