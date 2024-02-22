import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import ExportDataScreen from '../screens/ExportDataScreen';

const Stack = createStackNavigator();

export default function HomeNavigator(){

    return (
        <Stack.Navigator 
            initialRouteName={"Default"} 
            screenOptions={({route}) => ({
                headerShown: false
            })}>
            <Stack.Screen name="Default" component={HomeScreen} />
            <Stack.Screen name="ExportData" component={ExportDataScreen} />
            {/* <Stack.Screen name="RequestRecord" /> */}
        </Stack.Navigator>
    )
}