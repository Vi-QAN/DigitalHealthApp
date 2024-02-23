import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StepContextConsumer } from "../../../hooks/useStepContext"


const StepFooter = () => {
  const { currentStepIndex, steps, setCurrentStepIndex } = StepContextConsumer();
  const previous = () => {
    setCurrentStepIndex(
      currentStepIndex <= 1 ? currentStepIndex : currentStepIndex - 1
    );
  };
  const next = () => {
    setCurrentStepIndex(
      currentStepIndex >= steps.length ? currentStepIndex : currentStepIndex + 1
    );
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={previous}>
        <Text style={styles.buttonTitle}>Previous</Text>
      </TouchableOpacity>
        <Text style={styles.buttonTitle}>{currentStepIndex}</Text>



      <TouchableOpacity onPress={next}>
        <Text style={styles.buttonTitle}>
          {currentStepIndex === steps.length ? 'Finish' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default StepFooter;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  buttonTitle: {
    paddingBottom: 15,
  },
});