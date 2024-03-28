import React, { useEffect, useState} from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { ListItem, Avatar} from 'react-native-ui-lib';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthConsumer } from '../hooks/useAuth';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';


import { DefaultColors } from '../constants/styles';


const Stack = createStackNavigator();

export default function MenuScreen({navigation}) {
  const { logout, user } = AuthConsumer();
  const { width, height } = Dimensions.get('screen');

    useEffect(() => {
      
    },[]);
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white', paddingHorizontal: 40}}>
          <ListItem
            style={{ marginVertical: 10 }}
            >
            <ListItem.Part marginR-10 >
                <Avatar size={70} source={{uri: 'https://images.unsplash.com/photo-1707655096648-1655344fc4d5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}}>
                </Avatar>
              </ListItem.Part>
              <ListItem.Part containerStyle={{justifyContent:'center'}} column>
                <Text style={{fontSize: 10, opacity: 0.5}}>{user.userId}</Text>
                <Text style={{fontWeight: 500, fontSize: 16}}>{user.name}</Text>
                <TextInput style={{fontSize: 10, width: 100, opacity: 0.5  }} editable={false}>{user.key}</TextInput>
              </ListItem.Part>
          </ListItem>
          <TouchableOpacity style={styles.buttonStyle} onPress={() => {navigation.navigate('RequestRecords')}} >
            <View style={{flexDirection: 'row', width: '100%'}}>
                <View style={styles.iconContainer}>
                  <AntDesign name={'form'} size={20} color={DefaultColors.navy}/>
                </View>
                <View style={{justifyContent: 'center', marginLeft: 20, width: '75%'}}>
                  <Text style={{color: DefaultColors.navy}}>{'Request Medical Document'}</Text>
                </View>
                <View style={{justifyContent: 'center', opacity: 0.9}}>
                  <FontAwesome name={"angle-right"} size={30} color={DefaultColors.navy} />
                </View>
              </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonStyle} onPress={() => {navigation.navigate('ExportData')}}>
           <View style={{flexDirection: 'row', width: '100%'}}>
              <View style={styles.iconContainer}>
                <AntDesign name={'export'} size={20} color={DefaultColors.navy}/>
              </View>
              <View style={{justifyContent: 'center', marginLeft: 20, width: '75%'}}>
                <Text style={{color: DefaultColors.navy}}>{'Export Wearable Data'}</Text>
              </View>
              <View style={{justifyContent: 'center', opacity: 0.9}}>
                <FontAwesome name={"angle-right"} size={30} color={DefaultColors.navy} />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonStyle} onPress={() => {navigation.navigate('SharedWithMe')}}>
           <View style={{flexDirection: 'row', width: '100%'}}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={'share-variant-outline'} size={20} color={DefaultColors.navy}/>
              </View>
              <View style={{justifyContent: 'center', marginLeft: 20, width: '75%'}}>
                <Text style={{color: DefaultColors.navy}}>{'Shared With Me'}</Text>
              </View>
              <View style={{justifyContent: 'center', opacity: 0.9}}>
                <FontAwesome name={"angle-right"} size={30} color={DefaultColors.navy} />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonStyle} onPress={() => {navigation.navigate('Summary')}}>
           <View style={{flexDirection: 'row', width: '100%'}}>
              <View style={styles.iconContainer}>
                <Ionicons name={'analytics-outline'} size={20} color={DefaultColors.navy}/>
              </View>
              <View style={{justifyContent: 'center', marginLeft: 20, width: '75%'}}>
                <Text style={{color: DefaultColors.navy}}>{'File Summaries'}</Text>
              </View>
              <View style={{justifyContent: 'center', opacity: 0.9}}>
                <FontAwesome name={"angle-right"} size={30} color={DefaultColors.navy} />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonStyle} onPress={() => logout()}>
            <View style={{flexDirection: 'row', width: '100%'}}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={'logout'} size={20} color={DefaultColors.navy}/>
              </View>
              <View style={{justifyContent: 'center', marginLeft: 20, width: '75%'}}>
                <Text style={{color: DefaultColors.navy}}>{'Logout'}</Text>
              </View>
              <View style={{justifyContent: 'center', opacity: 0.9}}>
                <FontAwesome name={"angle-right"} size={30} color={DefaultColors.navy} />
              </View>
            </View>
          </TouchableOpacity>
        </SafeAreaView>
        
    )
}

const styles = StyleSheet.create({
    iconContainer: {
      width: 40, 
      height: 40, 
      borderRadius: 5, 
      backgroundColor: DefaultColors.whiteNavy,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonStyle: {
      paddingVertical: 15, 
      borderBottomWidth: 1, 
      borderBottomColor: DefaultColors.whiteNavy
    }
});
  