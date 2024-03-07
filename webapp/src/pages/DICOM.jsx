import { Container } from '@mui/system';
import { useEffect, useState } from 'react';
import DWVModal from "../modals/DWVModal";
import { getRegularFile } from '../utils/fileHandler';
const DICOM = () => {
  const [isDWVModalOpen, setIsDWVModalOpen] = useState(false);
  const [ file, setFile ] = useState(null);

  const searchParams = new URLSearchParams(document.location.search);

  const handleOpenDWVModal = () =>{
    setIsDWVModalOpen(true);
  }

  const handleCloseDWVModal = () => {
    setIsDWVModalOpen(false);
  }

  const loadData = async () => {
    const fileHash = searchParams.get('fileHash');
    const owner = searchParams.get('owner');
    const accessor = searchParams.get('accessor')
    try {
      const { blob, fileName } = await getRegularFile(fileHash, owner, accessor);
      console.log(blob.type)

      const file = new File([blob], fileName, { type: blob.type });

      setFile(file);
      
    } catch (err) {
      alert(err)
    }
  }

  useEffect(() => {
    loadData();
    handleOpenDWVModal();
  },[])

  return file ? (
    <DWVModal 
        show={isDWVModalOpen}
        onHide={handleCloseDWVModal}
        file={file}
    />
  )  : (<Container>{'Loading ...'}</Container>);
} 

export default DICOM;