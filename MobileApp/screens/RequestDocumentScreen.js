import { useState } from 'react'
import { StyleSheet,  View, Text, SafeAreaView, TouchableOpacity} from "react-native"
import { StepContextProvider } from '../hooks/useStepContext';
import StepWizzard from '../components/Screens/RequestDocumenScreen/StepWizard'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'


export default function RequestDocumentScreen({navigation}) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1, width: '100%', alignItems: 'center'}}>
                <View style={{flexDirection: 'row', alignItems: 'center',justifyContent:'center', width: '100%'}}>
                    <Text style={{fontWeight: 500, fontSize: 20, marginBottom: 20}}>Request Medical Data</Text>
                    
                    <TouchableOpacity style={{ marginBottom: 20, alignSelf: 'flex-end'}} onPress={navigation.goBack}>
                        <MaterialCommunityIcons name={'close'} size={35} color={'black'}/>

                    </TouchableOpacity>
                    
                </View>

                <StepContextProvider>
                    <StepWizzard navigation={navigation}/>
                </StepContextProvider>
                    
            </View>
            
                
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: 'white',
        alignItems: 'center',
    }, 

})