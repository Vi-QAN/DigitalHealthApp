
import React, { useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AuthConsumer } from '../../../hooks/useAuth';
import { Image } from 'react-native-ui-lib';

export default function InfoSection () {
    const { user } = AuthConsumer();

    useEffect(() => {
        
    },[])

    return (
        <View style={styles.container}>
                <Image style={styles.image} source={{uri: 'https://github.com/wix/react-native-ui-lib/blob/master/demo/src/assets/images/card-example.jpg?raw=true'}} />
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
        shadowColor: '#050a18',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        backgroundColor: 'white',
        shadowOpacity: 1,
        shadowRadius: 5,
        borderRadius: 5,
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