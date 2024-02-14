// screens/SignupScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthConsumer } from '../hooks/useAuth';

import { useAccount } from 'wagmi';
import {  Web3Modal, useWeb3Modal } from '@web3modal/wagmi-react-native'

import FeatherIcons from 'react-native-vector-icons/Feather'
import FontistoIcons from 'react-native-vector-icons/Fontisto'
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome'



const SignupScreen = ({navigation}) => {
  const account = useAccount();
  const { open } = useWeb3Modal();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { register } = AuthConsumer();

  const handleSignup = () => {
    // Implement your signup logic here
    register({name: username, email: email, password: password, navigation: navigation})
    console.log('Signup button pressed');
  };

  const goToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={{fontSize: 20, fontWeight: 600, marginBottom: 45}}>SIGN UP</Text>
      <View style={styles.inputContainer} >
        <FeatherIcons name={'user'} size={18} color={'black'}></FeatherIcons>
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={(text) => setUsername(text)}
          value={username}
        />
      </View>
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
        {account.address && <TextInput style={{width: 200, marginRight: 20}} editable={false}>{account.address}</TextInput>}
        <TouchableOpacity onPress={() => open()}>
          <FontAwesomeIcons name={'connectdevelop'} size={18} color={account.address ? 'green' : 'black'}/>
        </TouchableOpacity>
      </View>
        
      
      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={!account.address}>
          <Text style={styles.buttonText}>{account.address ? 'Register' : 'Please link your crypto account'}</Text>
      </TouchableOpacity>
      <View style={{flexDirection: 'row'}}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={goToLogin}>
          <Text style={{color: 'purple'}}>Login here</Text>

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

export default SignupScreen;
