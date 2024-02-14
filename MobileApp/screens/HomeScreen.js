import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Chart from '../components/Screens/ChartComponent';
import { AuthConsumer } from '../hooks/useAuth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

export default function HomeScreen({navigation}) {
    const data=[ {value:50}, {value:80}, {value:90}, {value:70} ]
    const { logout } = AuthConsumer();

    return (
        <View style={styles.container}>
<           TouchableOpacity onPress={() => logout()}>
                <MaterialCommunityIcons name={'logout'} size={18} color={'black'}/>
            </TouchableOpacity>
            <Text>Home Screen</Text>
            <Chart data={data} chartStyle={styles.chart} gradient={styles.gradient}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
    },
    chart: {
      width: '97%',
      height: 100,
      marginTop: 20,
      shadowColor: '#130f55',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 1,
        shadowRadius: 5,
    },
    gradient: {
        width: '100%',
        borderRadius: 5, // Half of the width and height to create a perfect circle
    }
  });