import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { LineChart, PieChart, BarChart } from "react-native-gifted-charts";
import { LinearGradient } from 'expo-linear-gradient';
import { ChartDataConsumer } from '../../../hooks/useChartData';
import { DefaultColors } from '../../../constants/styles'

const ColorMapping = {
  'Low': '#FF7F97',
  'Normal' : '#3BE9DE',
  'High' : '#006DFF',
}

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

function HeartRateChart({data, chartStyle, gradient}){
  const [ heartRateData, setHeartRateData ] = useState([]);
  const [ yAxisLabels, setYAxisLabels ] = useState([])
  const maxValue = 150;
  const step = Math.ceil(maxValue / 6);
  
  const generateYAxisLabels = () => {
    let result = []
    for(let i = 0; i < 150; i += step){
      result.push(i.toString());
    }
    return result;
  }
  const renderLegendComponent = () => {
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {renderDot(ColorMapping['Low'])}
            <Text style={{color: 'white'}}>{'Low < 60'}</Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center'}}>
            {renderDot(ColorMapping['Normal'])}
            <Text style={{color: 'white'}}>Normal</Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {renderDot(ColorMapping['High'])}
            <Text style={{color: 'white'}}>{'High > 100'}</Text>
          </View>
        </View>
      </>
    );
  };

  useEffect(() => {
    const formatted = data.map(item => { 
      if (item.value > 100) return { ...item, frontColor: ColorMapping['High']}
      if (item.value < 60) return { ...item, frontColor: ColorMapping['Low']}
      return { ...item, frontColor: ColorMapping['Normal']}
    })
    setHeartRateData(formatted);
    setYAxisLabels(generateYAxisLabels());
  },[data])

  return heartRateData && yAxisLabels && (
    <View style={chartStyle}>
        <LinearGradient
                colors={[DefaultColors.navy, '#3c3c79']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1}}
                style={gradient}>
      <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
        Heart Rate
      </Text>
      <View style={{paddingVertical: 20, alignItems: 'center'}}>
        <BarChart
          data={heartRateData}
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
          labelWidth={40}
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
  );
}

function BloodPressureChart({ data, chartStyle, gradient}){
    return data.length > 0 ?  (
        <View style={chartStyle}>
            <LinearGradient
                colors={[DefaultColors.navy, '#3c3c79']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1}}
                style={gradient}> 
                <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
                  Blood Pressure
                </Text>
                <View style={{paddingVertical: 20, alignItems: 'center'}}>
                <LineChart 
                    areaChart
                    curved
                    data={data}
                    hideDataPoints
                    spacing={100}
                    color1="#8a56ce"
                    startFillColor1="#8a56ce"
                    endFillColor1="#8a56ce"
                    startOpacity={0.9}
                    endOpacity={0.2}
                    initialSpacing={10}
                    noOfSections={6}
                    yAxisThickness={0}
                    xAxisType={'dashed'}

                    yAxisTextStyle={{color: 'lightgray'}}
                    //rulesType="solid"
                    //rulesColor="transparent"
                    xAxisColor={"lightgray"}
                    xAxisLabelTextStyle={{color: 'lightgray', textAlign: 'center'}}
                    pointerConfig={{
                      pointerStripUptoDataPoint: true,
                      pointerStripColor: 'lightgray',
                      pointerStripWidth: 2,
                      strokeDashArray: [2, 5],
                      pointerColor: 'lightgray',
                      radius: 4,
                      activatePointersOnLongPress: true,
                      autoAdjustPointerLabelPosition: true,
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
                </View>

                
            </LinearGradient>
            
        </View>
    ) : null
}

function OxygenLevelChart ({data, chartStyle, gradient}) {
  const [ activeSection, setActiveSection  ] = useState(null); 
  const [ oxygenLevelData, setOxygenLevelData ] = useState([]);

  const renderLegendComponent = () => {
    return (
      <>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {renderDot(ColorMapping['Low'])}
            <Text style={{color: 'white'}}>{'Low < 90'}</Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center'}}>
            {renderDot(ColorMapping['Normal'])}
            <Text style={{color: 'white'}}>Normal</Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {renderDot(ColorMapping['High'])}
            <Text style={{color: 'white'}}>{'High > 100'}</Text>
          </View>
        </View>
      </>
    );
  };

  const calculatePercentage = () => {
    const noOfLow = data.filter(item => item.value < 90 ).length;
    const noOfHigh = data.filter(item => item.value > 100).length;
    const noOfNormal = data.length - noOfLow - noOfHigh;
    const lowDays = Math.ceil((noOfLow / data.length) * 100);
    const highDays = Math.ceil((noOfHigh / data.length) * 100);
    const normalDays = Math.ceil((noOfNormal / data.length) * 100);
    
    return [
      {
        value: lowDays,
        color: ColorMapping['Low'],
        gradientCenterColor: '#FF7F97',
        focused: true,
        noOfItems: noOfLow 
      },
      {
        value: highDays, 
        color: ColorMapping['High'],  
        gradientCenterColor: '#006DFF',
        noOfItems: noOfHigh,
      },
      {
        value: normalDays, 
        color: ColorMapping['Normal'], 
        gradientCenterColor: '#3BE9DE',
        noOfItems: noOfNormal
      },
    ];
  }

  useEffect(() => {
    const formatted = calculatePercentage();
    setOxygenLevelData(formatted);
    setActiveSection(formatted[0]);
  },[data])

  
  return oxygenLevelData.length > 0 && activeSection && (
   
    <View style={chartStyle}>
        <LinearGradient
                colors={[DefaultColors.navy, '#3c3c79']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1}}
                style={gradient}>
          <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
            Oxygen Level
          </Text>
          <View style={{padding: 20, alignItems: 'center'}}>
            <PieChart
              data={oxygenLevelData}
              donut
              focusOnPress
              onPress={(item) => setActiveSection(item)}
              showGradient
              sectionAutoFocus
              radius={90}
              innerRadius={60}
              innerCircleColor={'#232B5D'}
              centerLabelComponent={() => {
                return (
                  <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text
                      style={{fontSize: 22, color: 'white', fontWeight: 'bold'}}>
                      {activeSection.noOfItems}
                    </Text>
                    <Text style={{fontSize: 14, color: 'white'}}>Records</Text>
                  </View>
                );
              }}
            />
          </View>
          {renderLegendComponent()}
          </LinearGradient>
      </View>
  );
}



export default function ChartComponent() {
  const {heartbeatData, bloodPressureData, oxygenLevelData, filterMode} = ChartDataConsumer();
  const [ hbChartData, setHBChartData ] = useState([]);
  const [ olChartData, setOLChartData ] = useState([]);
  const [ bpChartData, setBPChartData ] = useState([]);
  const [ onLoad, setOnLoad ] = useState(false);

  const processData = () => {
    const bpData = bloodPressureData.map((item, index) => { 
      const date = new Date(item.datetime)
      return { label: filterMode === 'Daily' ? date.toLocaleTimeString() : date.toLocaleDateString(), ...item }
    })
    const olData = oxygenLevelData.map((item, index) => { 
        return { ...item }
    })
    const hbData = heartbeatData.map((item, index) => {
      const date = new Date(item.datetime)

        return { label: filterMode === 'Daily' ? date.toLocaleTimeString() : date.toLocaleDateString(), ...item }
    })

    setHBChartData(hbData);
    setOLChartData(olData);
    setBPChartData(bpData);
    
  }

  useEffect(() => {
    setOnLoad(true);
    
    processData();
  },[heartbeatData, bloodPressureData, oxygenLevelData])
  

  return (
    <View style={styles.container}>
      {hbChartData.length > 0 ? <HeartRateChart data={hbChartData} chartStyle={styles.chart} gradient={styles.gradient} /> : <ActivityIndicator size={'small'} color={DefaultColors.lighterNavy}/>}
      {bpChartData.length > 0 && <BloodPressureChart data={bpChartData} chartStyle={styles.chart} gradient={styles.gradient}/>}
      {olChartData.length > 0 && <OxygenLevelChart data={olChartData} chartStyle={styles.chart} gradient={styles.gradient} /> }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
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
    }
  }
)
