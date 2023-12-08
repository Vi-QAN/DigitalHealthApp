/* eslint-disable no-console */
import React, { useState, useEffect } from 'react'
import { extract } from 'it-tar'
import { pipe } from 'it-pipe'
import toBuffer from 'it-to-buffer'
import Pako from 'pako'
import all from 'it-all'
import map from 'it-map'
import { saveAs } from 'file-saver'
import fetch from 'node-fetch'
import {Button, Container, Form, ListGroup } from 'react-bootstrap';


export const SaveFile = ({ ipfs, userId, setFileList }) => {
  // const [isChecked, setIsChecked] = useState(false)
  const [fileHashes, setFileHashes] = useState([])
  const [ files, setFiles] = useState(null)
  const [error, setError] = useState(null)

  const captureFile = (event) => {
    event.preventDefault()
    setFiles(event.target.files);
  }

  // Example #1
  // Add file to IPFS and return a CID
  const saveToIpfs = async ([file]) => {
    if (!userId) return;
    try {
      const added = await ipfs.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      console.log(file);
      const metadata = {
        "UserId": userId,
        "FileHash": added.cid.toString(),
        "MultiAddress": "/ip4/127.0.0.1/tcp/5001",
        "FileName": file.name,
        "FileType": file.type
      }

      const result = await fetch('http://localhost:5273/api/Information', {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(metadata)
        }).then(response => response.json()).then(result => result)

      setFileList((list) => 
        [...list, 
          { fileName: file.name, 
            fileHash: added.cid.toString(),
            fileType: file.type
          }])
    } catch (err) {
      setError(err.message)
    }
  }

  // Example #2
  // Add file to IPFS and wrap it in a directory to keep the original filename
  // const saveToIpfsWithFilename = async ([file]) => {
  //   const fileDetails = {
  //     path: file.name,
  //     content: file
  //   }

  //   const options = {
  //     wrapWithDirectory: true,
  //     progress: (prog) => console.log(`received: ${prog}`)
  //   }

  //   try {
  //     const added = await ipfs.add(fileDetails, options)

  //     setFileHashes((list) => [...list, added.cid.toString()])
  //   } catch (err) {
  //     setError(err.message)
  //   }
  // }

  const handleAddFile = (event) => {
    event.stopPropagation();
    event.preventDefault()
    if (!files) return;
    // isChecked ? saveToIpfsWithFilename(files) : 

    saveToIpfs(files);
  }

  return (
    <Container className="mb-3">
      <Form>
        <Form.Group className="mb-3" >
          <Form.Label>Input File</Form.Label>
          <Form.Control type="file" name='input-file' id='input-file' onChange={(e) => captureFile(e)}/>
        </Form.Group>
        <Button variant="primary" type="submit" onClick={(e) => handleAddFile(e)}>
          Add File
        </Button>
      </Form>
        
        {/* <div className="flex items-center mb2">
          <input className="mr2" type="checkbox" id="keep-filename" name="keep-filename" checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}/>
          <label htmlFor="keep-filename" className="lh-copy">keep filename</label>
        </div> */}

      {error && (
        <div className="bg-red pa3 center mv3 white">
          Error: {error.message || error}
        </div>
      )}
    </Container>
  )
}

// const Details = ({keys, obj}) => {
//   if (!obj || !keys || keys.length === 0) return null
//   return (
//     <>
//       {keys?.map((key) => (
//         <div className='mb4' key={key}>
//           <h2 className='f5 ma0 pb2 aqua fw4'>{key}</h2>
//           <div className='bg-white pa2 br2 truncate monospace' data-test={key}>{obj[key].toString()}</div>
//         </div>
//       ))}
//     </>
//   )
// }

export const FileList  = ({ipfs, fileList}) => {
    const [content, setContent] = useState(null)

    async function * gzipped (source) {
      const inflator = new Pako.Inflate()

      for await (const buf of source) {
        inflator.push(buf, false)
      }

      inflator.push(new Uint8Array(0), true)

      if (inflator.err) {
        throw new Error(`Error ungzipping - message: "${inflator.msg}" code: ${inflator.err}`)
      }

      if (inflator.result instanceof Uint8Array) {
        yield inflator.result
      } else {
        throw new Error('Unexpected gzip data type')
      }
    }

    /**
     * @param {Source} source
     */
     async function * tarballed (source) {
      yield * pipe(
        source,
        extract(),
        async function * (source) {
          for await (const entry of source) {
            yield {
              ...entry,
              body: await toBuffer(map(entry.body, (buf) => buf.slice()))
            }
          }
        }
      )
    }
    const handleClick = async (e,fileHash, fileName, fileExtension, fileType) => {
        e.preventDefault()
        try {
            const output = await pipe(
              ipfs.get(fileHash),
              tarballed,
              (source) => all(source)
            )

            const paths = output.map((file) => { return file.header.name })
            setContent(output[0].body)
            const blob = new Blob([content], {type: fileType})
            const fileURL = URL.createObjectURL(blob);
            window.open(fileURL)
            saveAs(fileURL, fileName + '.' + fileExtension )
            
        } catch (err) {
            console.error(err)
            
        }
    }
    useEffect(() => {

    },[fileList])
    return <>
      <Container className='mb-3'> 
        <Form.Label>File List</Form.Label>
        <ListGroup>
          {fileList.map((item) => (
            <ListGroup.Item key={item.fileHash} className="d-flex justify-content-between">      
              
              <a href={'http://127.0.0.1:8080/ipfs/' + item.fileHash}> 
                { item.fileName.search(/\./) == -1 ? 
                  item.fileName + '.' + item.fileExtension
                  :
                  item.fileName
                } </a>
                
              <Button onClick={(e) => handleClick(e, item.fileHash, item.fileName, item.fileExtension, item.fileType)} >Download</Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Container>        
    </>
}

const IPFSComponent = ({userId}) => {
  const [ipfs, setIpfs] = useState(null)
  // const [version, setVersion] = useState(null)
  // const [id, setId] = useState(null)

  useEffect(() => {
    if (!ipfs) return;
    // const getVersion = async () => {
    //   const nodeId = await ipfs.version();
    //   setVersion(nodeId);
    // }

    // const getId = async () => {
    //   const nodeId = await ipfs.id();
    //   setId(nodeId);
    // }

    // getVersion();
    // getId();
  }, [ipfs])

  useEffect(() => {
  },[])

  return (
    <>
      { ipfs &&
          <Container>
            <SaveFile ipfs={ipfs} userId={userId}></SaveFile>
            <FileList ipfs={ipfs}></FileList>
          </Container>
        }
    </>
  )
}

