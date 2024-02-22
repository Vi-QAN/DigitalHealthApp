import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import ChartComponent from '../components/Screens/HomeScreen/ChartComponent';
import InfoSection from '../components/Screens/HomeScreen/InfoSection';

import { AuthConsumer } from '../hooks/useAuth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'



export default function HomeScreen({navigation}) {
    const { logout } = AuthConsumer();

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <TouchableOpacity onPress={() => logout()}>
                <MaterialCommunityIcons name={'logout'} size={18} color={'black'}/>
            </TouchableOpacity>
            <InfoSection />
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttonStyle}>
                    <Text>Request Document</Text>    
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonStyle} onPress={() => {navigation.navigate('ExportData')}}>
                    <Text>Export Data</Text>    
                </TouchableOpacity>                
            </View>
            <ChartComponent />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flex: 1,
      backgroundColor: 'white',
      paddingHorizontal: 20,
      paddingVertical: 20,
    },

    contentContainer: {
        justifyContent: 'space-between'

    },

    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginVertical: 30,
        width: '100%',
        backgroundColor: 'white',
        justifyContent: 'space-between'
    },

    buttonStyle: {
        backgroundColor: 'white',
        paddingVertical: 20,
        width: '48%',
        alignItems: 'center',
        shadowColor: '#050a18',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        backgroundColor: 'white',
        shadowOpacity: 1,
        shadowRadius: 2,
        borderRadius: 5,
    }
    
});