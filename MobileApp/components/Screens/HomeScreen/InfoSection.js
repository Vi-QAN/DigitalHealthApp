
import React, { useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AuthConsumer } from '../../../hooks/useAuth';
import { Image } from 'react-native-ui-lib';

import { DefaultColors, DefaultShadow } from '../../../constants/styles';

export default function InfoSection () {
    const { user } = AuthConsumer();

    useEffect(() => {
        
    },[])

    return (
        <View style={styles.container}>
                <Image style={styles.image} source={{uri: 'https://images.unsplash.com/photo-1707655096648-1655344fc4d5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}} />
                <View style={styles.infoContainer}>
                    <Text style={{fontSize: 24, color: '#070f25'}}>{user.name}</Text>
                    <Text style={{fontSize: 12, color: '#2c3144'}}>{'Patient'}</Text>
                    
                </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        height: 140,
        width: '100%',
        ...DefaultShadow,
        marginTop: 15,
        backgroundColor: 'white',
        flexDirection: 'row',
    },

    infoContainer: {
        width: '70%',
        height: '100%',
        justifyContent: 'center',
        paddingLeft: '5%',
    },

    image: {
        width: '30%',
        borderRadius: 5,
    }


})