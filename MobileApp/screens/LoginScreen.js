// screens/LoginScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useSDK } from "@metamask/sdk-react";


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { connect, disconnect, account, chainId, ethereum } = useSDK();

  const handleLogin = () => {
    // Implement your login logic here
    // For simplicity, consider authentication successful if email and password are not empty
    if (email !== '' && password !== '') {
      console.log('Login successful');
      navigation.navigate('Home'); // Redirect to HomeScreen
    } else {
      console.log('Login failed');
    }
  };

  const goToSignup = () => {
    connectWallet();
    // navigation.navigate('Signup');
  };

  const connectWallet = async () => {
    try {
      await connect();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  useEffect(() => {
    
    // Use the 'account' and 'chainId' returned by 'useSDK'
    if (account && chainId) {
      // Handle account and network changes
      console.log(account, chainId);
    }
  }, [account, chainId]);

  return (
    <View style={styles.container}>
      <Text>Login Screen</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={goToSignup}>
        <Text>Create an account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 10,
    width: 200,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
});

export default LoginScreen;
