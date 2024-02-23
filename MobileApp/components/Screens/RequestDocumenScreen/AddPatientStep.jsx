import { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { TextField, Button, Dialog } from 'react-native-ui-lib';
import { StepContextConsumer } from '../../../hooks/useStepContext';


export default function PatientSection(){
    const { patient, setPatient } = StepContextConsumer();

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
    },

    sectionTitle: {
        paddingHorizontal: 5,
        fontSize: 20,
        fontWeight: '500'
    }
})