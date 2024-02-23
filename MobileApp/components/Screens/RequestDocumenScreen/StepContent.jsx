import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { StepContextConsumer } from "../../../hooks/useStepContext"

const StepContent = () => {
  const { steps, currentStepIndex } = StepContextConsumer();

  return (
    <View style={styles.container}>
      <View>
        {steps.length > 0 ? steps[currentStepIndex - 1].component() : <></>}
      </View>
    </View>
  );
};

export default StepContent;

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    padding: 15,
    flex: 2,
  },
});