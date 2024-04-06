import React, { useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StepContextConsumer } from "../../../hooks/useStepContext"
import { uploadMedicalRequest } from "../../../utils/fileHandler";
import { AuthConsumer } from "../../../hooks/useAuth";
import { DataConsumer } from '../../../hooks/useData';

import InfoDialog from '../../Common/InfoDialog';


const StepFooter = () => {
  const { user } = AuthConsumer();
  const { setOriginalFileList } = DataConsumer();
  const { currentStepIndex, steps, setCurrentStepIndex, provider, patient, documentList } = StepContextConsumer();
  const [ infoDialog, setInfoDialog ] = useState({state: 'error', message: 'Medical request form has been created successfully', visible: false, onload: false});

  const previous = () => {
    setCurrentStepIndex(
      currentStepIndex <= 1 ? currentStepIndex : currentStepIndex - 1
    );
  };
  const next = () => {
    setCurrentStepIndex(
      currentStepIndex >= steps.length ? currentStepIndex : currentStepIndex + 1
    );
  };

  const createFormData = (uri) => {
    const extraData = {
        ownerId: user.userId,
        content: {
            provider: {
                name: provider.name,
                address: provider.address,
            },
            patient: {
                name: patient.name,
                address: patient.address,
                phone: patient.phone,
            },
            requestedDocuments: documentList.map(item => item.name)
        }
        
    }

    const fileName = uri.split('/').pop();
    const fileType = fileName.split('.').pop();
    const formData = new FormData();
    formData.append('file', { 
        uri, 
        name: fileName, 
        type: `image/${fileType}` 
    });

    formData.append('request', JSON.stringify(extraData));

    return formData;
}

const handleSendRequest = async () => {
    setInfoDialog((data) => {{return {...data, visible: true, onload: true}}})        

    const uri = patient.idImage.assets[0].uri;
    const formData = createFormData(uri);
    
    const result = await uploadMedicalRequest({data: formData})
    if (result){
      setInfoDialog({ state: 'success', message: 'Medical request form has been created successfully', visible: true, onload: false});
    }else {
      setInfoDialog({ state: 'error', message: 'Error encountered while creating medical request form', visible: true, onload: false});
    }
    setOriginalFileList(list => [...list, { ...result, selected: false}])
}
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={previous}>
        <Text style={styles.buttonTitle}>Previous</Text>
      </TouchableOpacity>
        {/* <Text style={styles.buttonTitle}>{currentStepIndex}</Text> */}

      {currentStepIndex === steps.length ? 
      <TouchableOpacity onPress={handleSendRequest}>
        <Text style={styles.buttonTitle}>
          Submit
        </Text>
      </TouchableOpacity> : 
      <TouchableOpacity onPress={next}>
        <Text style={styles.buttonTitle}>Next
        </Text>
      </TouchableOpacity>}
      
      <InfoDialog infoDialog={infoDialog} setInfoDialog={setInfoDialog}/>

      
    </View>
  );
};

export default StepFooter;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  buttonTitle: {
    paddingBottom: 15,
  },
});