// screens/LoginScreen.js
import { useAccount } from 'wagmi';
import {  Web3Modal, useWeb3Modal } from '@web3modal/wagmi-react-native'
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthConsumer } from '../hooks/useAuth';
import FeatherIcons from 'react-native-vector-icons/Feather'
import FontistoIcons from 'react-native-vector-icons/Fontisto'
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome'

const LoginScreen = ({ navigation }) => {
  const account = useAccount();
  const { open } = useWeb3Modal();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = AuthConsumer();

  const handleLogin = () => {
    // Implement your login logic here
    // For simplicity, consider authentication successful if email and password are not empty
    if (email !== '' && password !== '') {
      login({email: email, password: password, navigation: navigation})
    } else {
      console.log('Login failed');
    }
  };

  const goToSignup = () => {
    navigation.navigate('Signup');
  };

  useEffect(() => {
  }, [account]);

  return (
    <View style={styles.container}>
      <Text style={{fontSize: 20, fontWeight: 600, marginBottom: 45}}>SIGN IN</Text>
      <View style={styles.inputContainer}>
        <FontistoIcons name={'email'} size={18} color={'black'} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <FeatherIcons name={'unlock'} size={18} color={'black'} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry
        />
      </View>
      <View style={{maxWidth: 250, flexDirection:'row', margin: 10, padding: 10, justifyContent: 'center'}}>
        {account && <TextInput style={{width: 200, marginRight: 20}} editable={false}>{account.address}</TextInput>}
        <TouchableOpacity onPress={() => open()}>
          <FontAwesomeIcons name={'connectdevelop'} size={18} color={account ? 'green' : 'black'}/>
        </TouchableOpacity>
      </View>
        
      
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={!account}>
          <Text style={styles.buttonText}>{account ? 'Login' : 'Please link your crypto account'}</Text>
      </TouchableOpacity>
      <View style={{flexDirection: 'row'}}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={goToSignup}>
          <Text style={{color: 'purple'}}>Register</Text>

        </TouchableOpacity>
      </View>
      
        <Web3Modal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  inputContainer: {
    flexDirection: 'row',
    height: 40,
    borderColor: 'gray',
    borderWidth: 0,
    borderBottomWidth: 1,
    margin: 10,
    padding: 10,
    width: 250,
  },
  input: {
    padding: 0,
    marginLeft: 5,
    fontSize: 18,
    width: 200,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    margin: 10,
    width: 180,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },

  buttonText: {
    color: 'white'
  }
});

export default LoginScreen;
