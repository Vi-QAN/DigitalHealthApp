import { createStackNavigator } from '@react-navigation/stack';

import ChatScreen from '../screens/ChatScreen';
import ExportDataScreen from '../screens/ExportDataScreen';
import RequestDocumentScreen from '../screens/RequestDocumentScreen';


const Stack = createStackNavigator();

export default function HomeNavigator(){

    return (
            <Stack.Navigator 
                initialRouteName={"Default"} 
                screenOptions={({route}) => ({
                    headerShown: false
                })}>
                <Stack.Screen name="Default" component={ChatScreen} />
                <Stack.Screen name="ExportData" component={ExportDataScreen} />
                
                <Stack.Screen name="RequestRecords" component={RequestDocumentScreen}/>
            </Stack.Navigator>
    )
}