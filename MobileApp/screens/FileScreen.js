import React, { useEffect} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FileListScreen from './FileListScreen';
import HL7MessageScreen from './HL7MessageScreen';
import DICOMScreen from './DICOMScreen';
import FileOpenerScreen from './FileOpenerScreen';

const Stack = createStackNavigator();

export default function FileScreen () {


    return (
       
        <Stack.Navigator
            screenOptions={({ route }) => ({
                headerShown: false
            })}>
            <Stack.Screen 
                name="File List" 
                component={FileListScreen} 
                
            />
            <Stack.Screen 
                name="Medical Message" 
                component={HL7MessageScreen}
            />

            <Stack.Screen 
                name="DICOM" 
                component={DICOMScreen}
            />

            <Stack.Screen
                name="File Opener"
                component={FileOpenerScreen}
            />

            
        </Stack.Navigator>
        
    )
}