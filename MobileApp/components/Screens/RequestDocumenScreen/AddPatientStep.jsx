import { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text, ScrollView,   } from 'react-native';
import { TextField, Button, Dialog } from 'react-native-ui-lib';
import { StepContextConsumer } from '../../../hooks/useStepContext';

import * as ImagePicker from 'expo-image-picker';
import { DefaultColors } from '../../../constants/styles';

import Ionicons from 'react-native-vector-icons/Ionicons'


export default function PatientSection(){
    const { patient, setPatient } = StepContextConsumer();

    
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        
        console.log(result);
        
        if (!result.canceled) {
          setPatient({ ...patient, idImage: result})
        }
    };

    return (
        <ScrollView style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Patient Information</Text>
            <TextField 
                containerStyle={{paddingHorizontal: 5, paddingVertical: 10, borderBottomColor: 'black', borderBottomWidth: 0.2, width: '100%'}}
                label="Name"
                labelStyle={{fontWeight: '500', marginBottom: 5}}
                enableErrors
                validate={['required' ]}
                validationMessage={['Field is required']}
                validationMessageStyle={{marginTop: 10}}
                retainValidationSpace={false}
                validateOnBlur
                validateOnChange
                onChangeText={(text) => setPatient(state => {return { ...state, name: text}}) }
                value={patient.name}
            />
            <TextField 
                containerStyle={{paddingHorizontal: 5, paddingVertical: 10, borderBottomColor: 'black', borderBottomWidth: 0.2, width: '100%'}}
                label="Address"
                labelStyle={{fontWeight: '500', marginBottom: 5}}
                enableErrors
                validate={['required' ]}
                validationMessage={['Field is required']}
                validationMessageStyle={{marginTop: 10}}
                retainValidationSpace={false}
                validateOnBlur
                validateOnChange
                onChangeText={(text) => setPatient(state => {return { ...state, address: text}}) }
                value={patient.address}
            />
            <TextField 
                containerStyle={{paddingHorizontal: 5, paddingVertical: 10, borderBottomColor: 'black', borderBottomWidth: 0.2, width: '100%'}}
                label="Phone"
                labelStyle={{fontWeight: '500', marginBottom: 5}}
                enableErrors
                validate={['required' ]}
                validationMessage={['Field is required']}
                validationMessageStyle={{marginTop: 10}}
                retainValidationSpace={false}
                validateOnBlur
                validateOnChange
                onChangeText={(text) => setPatient(state => {return { ...state, phone: text}}) }
                value={patient.phone}
            />
            <View style={{paddingHorizontal: 5, paddingVertical: 10, width: '100%'}}>
                <Text style={{fontWeight: '500', marginBottom: 5}}>Add Identification Document</Text>
                <Button style={styles.addDocButton} onPress={pickImage}>
                    {patient.idImage ? 
                        <Image source={{ uri: patient.idImage.assets[0].uri }} style={{ width: '100%', height: 200 }} /> 
                        :
                        <Ionicons name='add-outline' size={20} color={DefaultColors.navy}/>} 
                </Button>
                

            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    inputStyle: {
        paddingHorizontal: 5, 
        paddingVertical: 10, 
        borderBottomColor: 'black', 
        borderBottomWidth: 0.2, 
        width: '100%'
    },

    sectionContainer: {
        width: '100%',
        height: '100%'
    },

    sectionTitle: {
        paddingHorizontal: 5,
        fontSize: 20,
        fontWeight: '500'
    },

    addDocButton: {
        borderRadius: 5,  
        backgroundColor: 'white',
        borderColor: DefaultColors.navy,
        borderWidth: '1px',
        borderStyle: 'dashed',
        marginTop: 5
    }
})