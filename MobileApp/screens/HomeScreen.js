import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import ChartComponent from '../components/Screens/HomeScreen/ChartComponent';
import InfoSection from '../components/Screens/HomeScreen/InfoSection';
import { ChartDataConsumer } from '../hooks/useChartData';
import { DefaultColors, DefaultShadow } from '../constants/styles';

export default function HomeScreen({navigation}) {
    const { handleChangeFilter, filterMode } = ChartDataConsumer();
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                
                <InfoSection />
                
                <ScrollView style={{paddingVertical: 10}}  horizontal showsHorizontalScrollIndicator={false}>
                    {['Daily', 'Weekly','Monthly','Yearly'].map((item,index) => 
                        <TouchableOpacity key={index} 
                            style={{
                                ...styles.filterContainer,
                                backgroundColor: filterMode === item ? DefaultColors.navy : DefaultColors.whiteNavy,
                                shadowColor: filterMode === item ? DefaultColors.navy : DefaultColors.lighterNavy
                            }} 
                            onPress={() => handleChangeFilter(item)} >
                            <Text style={{
                                color: filterMode === item ? 'white' : DefaultColors.navy
                            }}>{item}</Text>    
                        </TouchableOpacity>
                    )}   
                </ScrollView>
                <ChartComponent />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },

    contentContainer: {
        paddingHorizontal: 10

    },

    filterContainer: {
        marginLeft: 5,
        marginRight: 7, 
        marginTop: 20, 
        paddingHorizontal: 20, 
        paddingVertical: 10, 
        backgroundColor: DefaultColors.whiteNavy,
        ...DefaultShadow,
        shadowColor: DefaultColors.lighterNavy,
        shadowRadius: 5,
        borderRadius: '30%', 
    },

    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 20,
        width: '100%',
        backgroundColor: 'white',
        justifyContent: 'space-between'
    },

    buttonStyle: {
        backgroundColor: 'white',
        paddingVertical: 20,
        width: '48%',
        alignItems: 'center',
        ...DefaultShadow,
        shadowColor: DefaultColors.navy,
        shadowOpacity: 0.5,
        shadowOffset: {
            width: 0,
            height: 1,
        },
    }
    
});