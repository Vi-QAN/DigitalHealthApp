import fetch from 'node-fetch'

const baseUrl =`${process.env.EXPO_PUBLIC_SERVER_ENDPOINT}/api`;
const mockServerUrl = `${process.env.EXPO_PUBLIC_MOCK_SERVER}`;

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
        "ownerId": ownerId,
        "accessorId": accessorId,
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
        "ownerId": ownerId,
        "accessorId": accessorId,
      })
    })
    .then(response => response.json())
    .catch(err => console.error(err));
}

////////////////////////////////////////
// File Information Requests
////////////////////////////////////////
export const getFileInfoByOwner = async (owner) => {
    return await fetch(baseUrl + '/fileinformation/' + owner, {
        method: "GET",
        headers: headers
    }).then(response => response.json())
    .catch(err => console.error("Failed to get file information by owner: ", err));
}

export const getFileInfoByAccessor = async (accessor) => {
    return await fetch(baseUrl + '/fileinformation/accessor/' + accessor, {
        method: "GET",
        headers: headers,
    }).then(response => response.json())
    .catch(err => console.error("Failed to get file information by accessor: ", err))
}

///////////////////////////////////
// File Content Requests
///////////////////////////////////
export const savePlainFilesInformation = (metadata) => {
    fetch('http://localhost:5273/api/fileinformation', {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(metadata)
    }).then(response => response.json()).then(result => result)
    .catch(err => {throw new Error("Failed to add information of plain file: ", err)})
}

export const saveEncryptedFiles = async (formData) => {
    return await fetch(baseUrl + '/File/upload', {
        method: 'POST',
        body: formData,
    })
      .then(response => response.json())
      .catch(error => console.error('Error:', error));
}

export const openWearableFiles = async (fileIds, ownerKey, accessorKey) => {
    if (!ownerKey || !accessorKey || fileIds.length === 0) return; 
    const queryParams = new URLSearchParams();
    queryParams.append("ownerKey", ownerKey);
    queryParams.append("accessorKey", accessorKey);
    queryParams.append("fileExtension", "json");

    fileIds.forEach(id => {
        queryParams.append("fileIds", id);
    })

    return await fetch(`${baseUrl}/file/open?${queryParams.toString()}`, {
        method: "GET",
        headers: headers,
    })
    .then(res => res.json())
    .catch(err => console.error(err));
}

export const openHL7Files = async (fileIds, ownerKey, accessorKey) => {
    if (!ownerKey || !accessorKey || fileIds.length === 0) return; 
    const queryParams = new URLSearchParams();
    queryParams.append("ownerKey", ownerKey);
    queryParams.append("accessorKey", accessorKey);
    queryParams.append("fileExtension", "hl7");

    fileIds.forEach(id => {
        queryParams.append("fileIds", id);
    })

    return await fetch(`${baseUrl}/file/open?${queryParams.toString()}`, {
        method: "GET",
        headers: headers,
    })
    .then(res => res.json())
    .catch(err => console.error(err));
}

// download files
export const getRegularFile = async (fileHash, owner, accessor) => {
    if (!owner || !accessor) return; 
    const response =  await getEncryptedFile(fileHash, owner, accessor)
    
    // Parse content disposition header to get the file name
    const contentDisposition = response.headers.get('Content-Disposition');
    const fileName = contentDisposition
        ? contentDisposition.split('filename=')[1].trim()
        : new URL(response.url).searchParams.get('fileName') || 'downloadedFile.txt';
    const contentType = response.headers.get('Content-Type');
    // Create a new Blob from the response's body
    const blob = await response.blob();

    return { blob, fileName, contentType }
}

// download files
const getEncryptedFile = async (fileHash, owner, accessor) => {
    const queryParams = new URLSearchParams();
    queryParams.append("owner", owner);
    queryParams.append("accessor", accessor);

    const url = `${baseUrl}/file/download/${fileHash}?${queryParams.toString()}`
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "ngrok-skip-browser-warning" : "0"
            },
        }).catch(err => console.log(err));
    
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response;

        
    } catch (err) {
        console.log(err)
    }
}

export const uploadMedicalRequest = async ({data}) => {
    return await fetch(`${baseUrl}/file/upload/medicalrequest`, {
        method: "POST",
        headers: headers,
        body: data
    })
    .then(result => result.json())
    .catch(err => console.error(err));
}

export const uploadWearableData = async (data) => {
    return await fetch(`${baseUrl}/file/upload/wearabledata`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data)
    })
    .then(result => result.json())
    .catch(err => console.error(err));
}

export const summizeFileRequest = async (fileIds, ownerKey, accessorKey) => {
    const queryParams = new URLSearchParams();
    queryParams.append("ownerKey", ownerKey);
    queryParams.append("accessorKey", accessorKey);
    fileIds.forEach(id => {
        queryParams.append("fileIds", id);
    })

    return await fetch(`${baseUrl}/file/summarize?${queryParams.toString()}`, {
        method: "GET",
        headers: headers,
    })
    .then(res => res.json())
    .catch(err => console.error(err));
}

export const getFilesSummaries = async (ownerId) => {
    const queryParams = new URLSearchParams();
    queryParams.append("ownerId", ownerId);
  
    return await fetch(`${baseUrl}/file/summaries?${queryParams.toString()}`, {
        method: "GET",
        headers: headers,
    })
    .then(res => res.json())
    .catch(err => console.error(err));
}

export const deleteFile = async (fileId) => {
    const url = `${baseUrl}/file/${fileId}`;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: headers
        }).catch(err => console.log(err));
    
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
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

/////////////////////////////////////////
// Assistant Request
/////////////////////////////////////////
export const promptMessage = async (userId, message) => {
    return await fetch(`${baseUrl}/assistant/messages`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
            ownerId: userId,
            userMessage: message,
        })
    })
    .then(res => res.json())
    .catch(err => console.error(err));
}

export const promptDetection = async (requests, ownerId) => {
    return await fetch(`${baseUrl}/assistant/detection?ownerId=${ownerId}`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(requests)
    })
    .then(res => res.json())
    .catch(err => console.error(err));
}

export const getMessageHistory = async (userId) => {
    const queryParams = new URLSearchParams();
    queryParams.append("ownerId", userId);
    return await fetch(`${baseUrl}/assistant/messages?${queryParams.toString()}`, {
        method: "GET",
        headers: headers,
    })
    .then(res => res.json())
    .catch(err => console.error(err));
}

////////////////////////////////////
// Mock Server
///////////////////////////////////
export const getLatestWearableData = async () => {
    return await fetch(`${mockServerUrl}/latest`,{
        method: "GET",
        headers: headers,
    })
    .then(res => res.json())
    .catch(err => console.error(err));
}

export const getDataRange = async (startDate, endDate) => {
    const queryParams = new URLSearchParams();
    queryParams.append("start_date", startDate);
    queryParams.append("end_date", endDate);
    return await fetch(`${mockServerUrl}/data?${queryParams.toString()}`,{
        method: "GET",
        headers: headers,
    })
    .then(res => res.json())
    .catch(err => console.error(err));
}