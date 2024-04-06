import { ScrollView, View, StyleSheet,  Text, SafeAreaView, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { Modal } from 'react-native-ui-lib';


import Entypo from 'react-native-vector-icons/Entypo';

import { BarChart } from "react-native-gifted-charts";
import { LinearGradient } from 'expo-linear-gradient';

import { DefaultColors, DefaultShadow } from "../../constants/styles";

function Chart ({wearableSummaries}){
    const ColorMapping = {
        'BloodPressure': '#FF7F97',
        'HeartRate' : '#3BE9DE',
        'OxygenLevel' : '#006DFF',
    }
    const [ chartData, setChartData ] = useState([]);
    const [ maxValue, setMaxValue] = useState(200);
    const renderDot = color => {
        return (
          <View
            style={{
              height: 10,
              width: 10,
              borderRadius: 5,
              backgroundColor: color,
              marginRight: 10,
            }}
          />
        );
      };

    const renderLegendComponent = () => {
        return (
          <>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-around',
                marginBottom: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 5,
                }}>
                {renderDot(ColorMapping['BloodPressure'])}
                <Text style={{color: 'white'}}>{'Blood Pressure Average'}</Text>
              </View>
              <View
                style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
                {renderDot(ColorMapping['HeartRate'])}
                <Text style={{color: 'white'}}>{'Heart Rate Average'}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 5,
                }}>
                {renderDot(ColorMapping['OxygenLevel'])}
                <Text style={{color: 'white'}}>{'Oxygen Level Average'}</Text>
              </View>
            </View>
          </>
        );
    };

    useEffect(() => {
        let tempChartData = []
        wearableSummaries.forEach(item => {
            const arr = [
            {
                value: item.bloodPressureAverage,
                frontColor: ColorMapping['BloodPressure'],
                label: item.name,
                spacing: 8
            },{
                value: item.heartRateAverage,
                frontColor: ColorMapping['HeartRate'],
                spacing: 8
            },{
                value: item.oxygenLevelAverage,
                frontColor: ColorMapping['OxygenLevel']
            }]
            tempChartData = [ ...tempChartData, ...arr];
        })
        const temp = [...tempChartData];
        temp.sort((a, b) => b.value - a.value);
        setMaxValue(temp[0].value)
        setChartData(tempChartData);
    },[wearableSummaries])

    return chartData.length > 0 && (
        <View style={styles.chart}>

            <LinearGradient
                colors={[DefaultColors.navy, '#3c3c79']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1}}
                style={styles.gradient}>
            <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
                Oxygen Level
            </Text>
            <View style={{paddingVertical: 20, width: '100%', alignItems: 'center'}}>
                <BarChart
                    data={chartData}
                    barWidth={50}
                    initialSpacing={10}
                    spacing={50}
                    barBorderRadius={4}
                    yAxisThickness={0}
                    xAxisType={'dashed'}
                    xAxisColor={'lightgray'}
                    yAxisTextStyle={{color: 'lightgray'}}
                    maxValue={maxValue}
                    noOfSections={6}
                    yAxisLabelTexts={["0", "25", "50", "75", "100", "125"]}
                    labelWidth={150}
                    xAxisLabelTextStyle={{color: 'lightgray', textAlign: 'center'}}
                    // showLine
                    // lineConfig={{
                    //   color: '#F29C6E',
                    //   thickness: 3,
                    //   curved: true,
                    //   hideDataPoints: true,
                    //   shiftY: 20,
                    //   initialSpacing: -30,
                    // }}
                    />
            </View>
            {renderLegendComponent()}
        </LinearGradient>
        </View>
    )
}

function SummaryContent ({summary}){
    const [ fileNames, setFileNames] = useState([]);
    useEffect(() => {
        const medicalDataFileNames = summary.medicalDataFiles.map(i => i.name);
        const wearableDataFileNames = summary.wearableDataFilesSummaries.map(i => i.name);
        setFileNames([...medicalDataFileNames, ...wearableDataFileNames ])
    },[summary]) 
    return (
        <View style={{alignItems: 'center',}}>
            <Text>{'This summary is generated based on the following files: '}</Text>
            <ScrollView style={{width: '100%', height: 100}}>
                {fileNames.map((item , index) => {
                    return (
                        <View key={index} style={{width: '100%', height:30, display: 'flex', flexDirection: 'row', alignItems: 'center',}}>
                            <Entypo name={"dot-single"} size={30} color={DefaultColors.navy} />
                            <Text style={{color: DefaultColors.navy}}>{item}</Text>
                        </View>
                    )
                })}
            </ScrollView>
            <Text style={{textAlign: 'justify'}}>{summary.medicalDataSummary.content}</Text>  
        </View>
       
    )
}

function Header ({summary }){

    return (
        <View style={{width: '100%', height: 50, alignItems: 'center', paddingHorizontal: 10}}>
            <Text style={{fontSize: 20, fontWeight: 500}}>{`Summary ${summary.id}`}</Text>

            <Text style={{fontSize: 12, fontWeight: 500, opacity: 0.5}}>{new Date(summary.generatedDate).toLocaleDateString()}</Text>
            
        </View>
        
    )
}

export default function SummaryDialog({summaryDialog, setSummaryDialog}){

    useEffect(() => {
        
    },[summaryDialog])

    return (
        <Modal 
            visible={summaryDialog.visible}
            onDismiss={() => console.log('dismissed')}
        >
            <SafeAreaView>
                <Modal.TopBar
                    onDone={() => setSummaryDialog(data => {return {...data, visible: false}})}
                    doneLabel="Back"
                    doneButtonProps={{
                        labelStyle: {color: DefaultColors.navy}
                    }}
                    containerStyle={{ width: '100%', borderRadius: 5, ...DefaultShadow,}}
                    />
             {summaryDialog.onload ? 
                <View style={{width: "100%", height: 250, justifyContent: 'center'}}>
                    <ActivityIndicator size="large" color={DefaultColors.navy} />
                </View> :
                <ScrollView contentContainerStyle={{paddingBottom: 50}}>
                    
                    {summaryDialog.content && <Header summary={summaryDialog.content} />}
                    {summaryDialog.content && <ScrollView style={{paddingHorizontal: 25, width: '100%', height: '100%'}}>
                        <SummaryContent summary={summaryDialog.content}/>
                        {summaryDialog.content.wearableDataFilesSummaries.length > 0 && <Chart wearableSummaries={summaryDialog.content.wearableDataFilesSummaries}/>}
                    </ScrollView>}
                </ScrollView>
                }
               </SafeAreaView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    chart: {
        marginTop: 20,
        width: '100%',
        shadowColor: '#130f55',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 1,
        shadowRadius: 5,
    },
    gradient: {
        justifyContent: 'center',
        width: '100%',
        borderRadius: 5, // Half of the width and height to create a perfect circle
        padding: 16,
    },
})