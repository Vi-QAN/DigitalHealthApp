import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import ExportDataScreen from '../screens/ExportDataScreen';
import RequestDocumentScreen from '../screens/RequestDocumentScreen';
import { ChartDataProvider } from '../hooks/useChartData';


const Stack = createStackNavigator();

export default function HomeNavigator(){

    return (
        <ChartDataProvider>
            <Stack.Navigator 
                initialRouteName={"Default"} 
                screenOptions={({route}) => ({
                    headerShown: false
                })}>
                <Stack.Screen name="Default" component={HomeScreen} />
                <Stack.Screen name="ExportData" component={ExportDataScreen} />
                
                <Stack.Screen name="RequestRecords" component={RequestDocumentScreen}/>
            </Stack.Navigator>
        </ChartDataProvider>
    )
}