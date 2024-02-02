import React from 'react';
import { View, Text } from 'react-native';
import { LineChart } from "react-native-gifted-charts";
import { LinearGradient } from 'expo-linear-gradient';

// ...


export default function ChartComponent({data, chartStyle, gradient}){
    const data1 = [
        {value: 70},
        {value: 36},
        {value: 50},
        {value: 40},
        {value: 18},
        {value: 38},
      ];

    return (
        <View style={chartStyle}>
            <LinearGradient
                colors={['#130f55', '#3c3c79']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1}}
                style={gradient}>
                <LineChart 
                    areaChart
                    curved
                    data={data1}
                    hideDataPoints
                    spacing={68}
                    color1="#8a56ce"
                    startFillColor1="#8a56ce"
                    endFillColor1="#8a56ce"
                    startOpacity={0.9}
                    endOpacity={0.2}
                    initialSpacing={0}
                    noOfSections={4}
                    yAxisColor="white"
                    yAxisThickness={0}
                    rulesType="solid"
                    rulesColor="transparent"
                    yAxisTextStyle={{color: 'gray'}}
                    yAxisLabelSuffix="%"
                    xAxisColor="lightgray"
                    pointerConfig={{
                      pointerStripUptoDataPoint: true,
                      pointerStripColor: 'lightgray',
                      pointerStripWidth: 2,
                      strokeDashArray: [2, 5],
                      pointerColor: 'lightgray',
                      radius: 4,
                      pointerLabelWidth: 100,
                      pointerLabelHeight: 120,
                      pointerLabelComponent: items => {
                        return (
                          <View
                            style={{
                              height: 120,
                              width: 100,
                              backgroundColor: '#282C3E',
                              borderRadius: 4,
                              justifyContent: 'center',
                              paddingLeft: 16,
                            }}>
                            <Text style={{color: 'lightgray', fontSize: 12}}>{2018}</Text>
                            <Text style={{color: 'white', fontWeight: 'bold'}}>
                              {items[0].value}
                            </Text>
                            
                          </View>
                        );
                      },
                    }}
                  />
            </LinearGradient>
        </View>
    )
}