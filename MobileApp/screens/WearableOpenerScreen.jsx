import { useState, useEffect} from 'react';

import { SafeAreaView, StyleSheet, ScrollView, View, ActivityIndicator } from "react-native"

import { openWearableFiles } from '../utils/fileHandler';

import { HeartRateChart, BloodPressureChart, OxygenLevelChart} from '../components/Screens/HomeScreen/ChartComponent';

import { DefaultColors } from '../constants/styles';


export default function WearableOpenerScreen({navigation, route}) {
    const [ bloodPressureData, setBloodPressureData ] = useState([]);
    const [ oxygenLevelData, setOxygenLevelData ] = useState([]);
    const [ heartbeatData, setHeartbeatData ] = useState([]);

    const ownerKey = route.params.ownerKey;
    const accessorKey = route.params.accessorKey;
    const fileIds = route.params.fileIds;

    const mapData = (filteredData) => {
        const bpData = filteredData.map((item, index) => { 
            const date = new Date(item.dateTime)
            return { value: item.bloodPressure, datetime: item.dateTime, label: date.toLocaleDateString() }
        })
        const olData = filteredData.map((item, index) => { 
            
            return {  value: item.oxygenLevel, datetime: item.dateTime }
        })
        const hbData = filteredData.map((item, index) => {
            const date = new Date(item.dateTime)

            return { value: item.heartRate, datetime: item.dateTime, label: date.toLocaleDateString() }
        })
        setBloodPressureData(bpData);
        setOxygenLevelData(olData);
        setHeartbeatData(hbData);
    }

    const loadData = async () => {
        const data = await openWearableFiles(fileIds, ownerKey, accessorKey);
        if (!data) return;
        mapData(data[0]);
    }

    useEffect(() => {
        loadData();    
    },[])

    return heartbeatData.length > 0 && (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{paddingHorizontal: 10}}>
                
                {heartbeatData.length > 0 && <HeartRateChart data={heartbeatData} chartStyle={styles.chart} gradient={styles.gradient} />}
                {bloodPressureData.length > 0 && <BloodPressureChart data={bloodPressureData} chartStyle={styles.chart} gradient={styles.gradient}/>}
                {oxygenLevelData.length > 0 && <OxygenLevelChart data={oxygenLevelData} chartStyle={styles.chart} gradient={styles.gradient} /> }
            </ScrollView>
        </SafeAreaView>
    )
        
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    chart: {
        marginTop: 20,
        width: '100%',
        shadowColor: '#130f55',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        height: '200px',
        shadowOpacity: 1,
        shadowRadius: 5,
      },
      gradient: {
          justifyContent: 'center',
          width: '100%',
          height: '200px',
          borderRadius: 5, // Half of the width and height to create a perfect circle
          padding: 16,
      }
    }
  )