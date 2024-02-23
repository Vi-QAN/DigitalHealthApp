import { useEffect } from "react";
import { StyleSheet, View } from 'react-native'

import { StepContextConsumer } from "../../../hooks/useStepContext"

import ProviderSection from "./AddProviderStep";
import PatientSection from "./AddPatientStep";
import RequestedDocuments from "./AddRequestedDocuments";
import SubmitSection from "./SubmitStep";

import StepContent from "./StepContent";
import StepHeader from "./StepHeader";
import StepFooter from "./StepFooter";

export default function StepWizzard({navigation}) {
    const { setCurrentStepIndex, setSteps } = StepContextConsumer();

    useEffect(() => {
        setSteps([
            {
                title: 'Provider',
                component: () => <ProviderSection />,
            },
            {
                title: 'Patient',
                component: () => <PatientSection />,
            },
            {
                title: 'Documents',
                component: () => <RequestedDocuments />,
            },
            {
                title: 'Summary',
                component: () => <SubmitSection navigation={navigation}/>
            }
        ]);
        setCurrentStepIndex(1);
    },[])

    return (
        <View style={styles.container}>
            <StepHeader />
            <StepContent />
            <StepFooter />    
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
  });
