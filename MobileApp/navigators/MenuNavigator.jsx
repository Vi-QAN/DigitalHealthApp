import { createStackNavigator } from '@react-navigation/stack';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

import MenuScreen from '../screens/MenuScreen';
import ExportDataScreen from '../screens/ExportDataScreen';
import RequestDocumentScreen from '../screens/RequestDocumentScreen';
import SharedWithMeScreen from '../screens/SharedWithMeScreen'
import HL7MessageScreen from '../screens/HL7MessageScreen';
import DICOMScreen from '../screens/DICOMScreen';
import FileOpenerScreen from '../screens/FileOpenerScreen';
import SummaryScreen from '../screens/SummaryScreen';

const Stack = createStackNavigator();

export default function MenuNavigator(){

    return (
            <Stack.Navigator 
                initialRouteName={"Default"} 
                screenOptions={({route}) => ({
                    headerShown: false
                })}>
                <Stack.Screen name="Default" component={MenuScreen} />
                <Stack.Screen name="ExportData" component={ExportDataScreen} />
                <Stack.Screen name="SharedWithMe" component={gestureHandlerRootHOC(SharedWithMeScreen)} />
                <Stack.Screen name="Summary" component={gestureHandlerRootHOC(SummaryScreen)} />
                <Stack.Screen name="RequestRecords" component={RequestDocumentScreen}/>
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