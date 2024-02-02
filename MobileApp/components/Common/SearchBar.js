import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import {View, TextField, Button } from 'react-native-ui-lib';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import FeatherIcon from 'react-native-vector-icons/Feather';


export default function SearchBar(){
    const [value, onChangeText] = useState('Use less');
    
    return (
        <View  center marginV-20 style={styles.container}>
            
            <View flexS center row  style={styles.textFieldContainer} >
                <FeatherIcon name={'search'} size={30} style={{color: 'grey'}}/>
                <TextField
                    migrate
                    containerStyle={styles.textField}
                    preset={null}
                    placeholder={'Message'}
                    floatingPlaceholder={false}
                    enableErrors={false}
                    
                />
                
            </View>
            
            
            {/* <Button 
                
                enableShadow
                borderRadius={6}
                backgroundColor={'white'}
                style={{  marginLeft: 10}}
                >
                <FontAwesomeIcon name={'pencil-square-o'} size={30} style={{color: 'grey'}} />
            </Button> */}
            
            
            

        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },

  textFieldContainer: {
    height: 50,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 6,
    marginHorizontal: 10
  },

  textField: {
    width: '80%',
    paddingLeft: 10,
    
  },
  
  buttonContainer: {
  }

})