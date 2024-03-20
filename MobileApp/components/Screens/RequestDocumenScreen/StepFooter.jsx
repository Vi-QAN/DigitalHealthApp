import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StepContextConsumer } from "../../../hooks/useStepContext"
import { uploadMedicalRequest } from "../../../utils/fileHandler";
import { AuthConsumer } from "../../../hooks/useAuth";



const StepFooter = () => {
  const { user } = AuthConsumer();
  const { currentStepIndex, steps, setCurrentStepIndex, provider, patient, documentList } = StepContextConsumer();
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

const handleSendRequest = () => {
    
    const uri = patient.idImage.assets[0].uri;
    const formData = createFormData(uri);
    console.log(formData);
    

    uploadMedicalRequest({data: formData})
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