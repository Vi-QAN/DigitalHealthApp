import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import ConversationScreen from './ConversationScreen';
import MessageScreen from './MessageScreen';
import SearchBar from '../components/Common/SearchBar';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import fetch from 'cross-fetch'

const Stack = createStackNavigator();

const CustomHeader = ({ navigation, title }) => {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {/* Inherit the back button from the original header */}
          <Text style={styles.headerBackText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        {/* Add your custom elements here */}
      </View>
    );
  };

export default function ChatScreen() {
    const [conversations, setConversations] = useState([])
    const { width, height } = Dimensions.get('screen');

    useEffect(() => {
        const init = () => {
            return fetch('https://f50d-2a02-8084-2162-e200-3d09-70ba-3dc6-99c2.ngrok.io/conversation/41A4BC89-95E2-4221-FAF1-08DBC9020DBC', {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            
        }
        
        init()
        .then(response => response.json())
        .then(json => setConversations(json.items))
        .catch(error => {
          console.error(error);
        });    
    },[]);

    

    return (
       
        <Stack.Navigator
            screenOptions={({ route }) => ({
                
            })}>
            <Stack.Screen 
                name="Conversation" 
                component={ConversationScreen} 
                options={{
                    header: () => <SearchBar />,
                }}
            />
            <Stack.Screen 
                name="Message" 
                component={MessageScreen}
                
            />
        </Stack.Navigator>
        
    )
}

const styles = StyleSheet.create({
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'lightgray',
      padding: 10,
    },
    headerBackText: {
      color: 'blue',
      fontSize: 18,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginLeft: 10,
    },
  });
  