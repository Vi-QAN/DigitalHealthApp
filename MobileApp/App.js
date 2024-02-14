import { WagmiConfig } from 'wagmi';
import { localhost, mainnet } from "wagmi/chains";

import { createWeb3Modal, defaultWagmiConfig  } from '@web3modal/wagmi-react-native'

import { StyleSheet, AppState, AppStateStatus } from 'react-native';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { AuthConsumer, AuthProvider } from "./hooks/useAuth";

import HomeScreen from './screens/HomeScreen';
import DetailScreen from './screens/DetailScreen';
import AlertsScreen from './screens/AlertsScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import FileScreen from './screens/FileScreen';
import ConversationScreen from './screens/ConversationScreen';

import SearchBar from './components/Common/SearchBar';



// Web 3
const projectId = '0caac0cf0fc25f80bea5b3fdbd2af07f';



const metadata = {
  name: 'Web3Modal RN',
  description: 'Web3Modal RN Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
  redirect: {
    native: 'digitalhealth://',
    universal: 'YOUR_APP_UNIVERSAL_LINK.com'
  }
}

const customLocalhost = { 
  ...localhost, 
  rpcUrls: {
    public: {
      http: [`${process.env.EXPO_PUBLIC_CHAIN_URL}`]
    },
    default: {
      http: [`${process.env.EXPO_PUBLIC_CHAIN_URL}`]
    }
  }
}

const chains = [customLocalhost]

const wagmiConfig = defaultWagmiConfig({
  chains, // required
  projectId, // required
  metadata, // required
})



// 3. Create modal
createWeb3Modal({
  projectId,
  chains,
  wagmiConfig,
})

// Others

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName={"Login"} 
      screenOptions={({route}) => ({
        headerShown: false
      })}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
};

const Navigator = () => {
  const { authed } = AuthConsumer();
  return authed ? (<AppNavigator /> ) : (<AuthNavigator /> ) 
}

const AppNavigator = () => {
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
      <Tab.Screen name="Details" component={gestureHandlerRootHOC(ConversationScreen)} />
      <Tab.Screen name='Chat' component={gestureHandlerRootHOC(FileScreen)} />
      <Tab.Screen name="Alerts" component={AlertsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {

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


  return (
    <WagmiConfig config={wagmiConfig}>
      <AuthProvider>
        <NavigationContainer>
          <Navigator />        
        </NavigationContainer>
      </AuthProvider>
      
    </WagmiConfig>
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
