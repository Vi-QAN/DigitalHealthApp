import { StyleSheet, AppState, AppStateStatus } from 'react-native';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import ChatScreen from './screens/ChatScreen';
import AlertsScreen from './screens/AlertsScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import FileScreen from './screens/FileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Details') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Alerts'){
            iconName = focused ? 'bell' : 'bell-outline';
            return <MaterialCommunityIcon name={iconName} size={size} color={color} />
          } else if (route.name === 'Chat'){
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          }

          // Return the icon component with the appropriate name and style
          return <Icon name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        
        tabBarActiveTintColor: "blue",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: [
          {
            "display": "flex"
          },
          null
        ]
        
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Details" component={DetailScreen} />
      <Tab.Screen name='Chat' component={gestureHandlerRootHOC(FileScreen)} />
      <Tab.Screen name="Alerts" component={AlertsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {

  const [userAuthenticated, setUserAuthenticated] = useState(false);



  useEffect(() => {
    // const subscription = AppState.addEventListener('change', handleAppState);

    // return () => {
    //   subscription.remove();
    // };
  }, []);

  const handleNavReady = () => {
    console.log('Navigation container ready!');
  };

  // Simulate checking user authentication status
  useEffect(() => {
    // Implement your authentication logic here
    // For simplicity, consider user authenticated if some condition is met
    const isUserAuthenticated = true; // Replace with your authentication logic
    setUserAuthenticated(isUserAuthenticated);


    
      
  }, []);


  return (
    
    <NavigationContainer>
      {userAuthenticated ? (
        <MainNavigator />
      ) : (
        <AuthNavigator />
      )}
    
    </NavigationContainer>
      
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
