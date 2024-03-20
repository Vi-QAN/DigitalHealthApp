import React  from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { StepContextConsumer } from "../../../hooks/useStepContext"
import { DefaultColors } from '../../../constants/styles';

const Circle = ({ index, selectedIndex }) => {
  return (
    <View
      style={
        index === selectedIndex
          ? { ...styles['circle'], backgroundColor: '#fff' }
          : { ...styles['circle'], backgroundColor: DefaultColors.navy }
      }>
      <Text
        style={
          index === selectedIndex
            ? styles['selectedcircleTitle']
            : styles['circleTitle']
        }
      >
        {index}
      </Text>
    </View>
  );
};

const StepHeader = () => {
  const MAX_NUMBER_LINES = 2;
  const { steps, currentStepIndex } = StepContextConsumer();
  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <View key={index} style={styles.stepContainer}>
          <Circle selectedIndex={currentStepIndex} index={++index} />
          <Text
            numberOfLines={MAX_NUMBER_LINES}
            ellipsizeMode='tail'
            style={styles.titleCircle}
          >
            {step.title}
          </Text>
        </View>
      ))}
      <View style={styles.line} />
    </View>
  );
};

export default StepHeader;

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: Dimensions.get('window').width,
      marginBottom: 15,
    },
    stepContainer: {
      flexDirection: 'column',
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
    },
    titleCircle: {
      marginTop: 10,
      fontSize: 12,
      paddingBottom: 10,
    },
    line: {
      borderBottomWidth: 1,
      borderBottomColor: DefaultColors.navy,
      justifyContent: 'center',
      width: '85%',
      position: 'absolute',
      top: 35,
      marginHorizontal: 20,
    },
    circle: {
      borderWidth: 1,
      borderColor: DefaultColors.navy,
      borderRadius: 50,
      width: 30,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
      zIndex: 1,
    },
    circleTitle: {
      fontSize: 12,
      color: '#fff',
    },
    selectedcircleTitle: {
      fontSize: 12,
      color: DefaultColors.navy,
    },
});