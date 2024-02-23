import { useEffect, createContext, useState, useContext } from "react";
import { AuthConsumer } from './useAuth';


const stepContext = createContext();


function useStepContext() {
    const { user } = AuthConsumer();
    const [ currentStepIndex, setCurrentStepIndex ] = useState(0);
    const [ steps, setSteps ] = useState([]);
    const [ currentStep, setCurrentStep ] = useState(null);
    const [ provider, setProvider ] = useState({id: '',name: '', address: ''});
    const [ patient, setPatient ] = useState({name: user.name, address: '', phone: ''});
    const [ documentList, setDocumentList ] = useState([]);

    return {
        currentStep,
        currentStepIndex,
        steps,
        provider,
        patient, 
        documentList, 
        setProvider,
        setPatient,
        setDocumentList,
        setCurrentStepIndex,
        setSteps,
        setCurrentStep
    }
}

function StepContextProvider({children}) {
    const context = useStepContext();
  
    // React.useEffect(() => {
    //     console.log('Auth state changed:', auth.authed);
    //     return () => {
    //     console.log('AuthProvider unmounted');
    //     };
    // }, []);

    return <stepContext.Provider value={context}>{children}</stepContext.Provider>;
}

function StepContextConsumer() {
    return useContext(stepContext);
}

export { StepContextProvider, StepContextConsumer }