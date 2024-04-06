import { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator  } from 'react-native';
import { Button, Dialog, PanningProvider, } from 'react-native-ui-lib';

import {DefaultColors} from '../../constants/styles' 

import AntDesign from 'react-native-vector-icons/AntDesign';

import { InfoDialogConsumer } from '../../hooks/useInfoDialog';

export default function InfoDialog({infoDialog, setInfoDialog}){
    const [ color, setColor ] = useState(DefaultColors.success);

    useEffect(() => {

        setColor(() => {return infoDialog.state === 'success' ? DefaultColors.success : DefaultColors.error})
    },[infoDialog])

    return  (
        <Dialog
            visible={infoDialog.visible}
            onDismiss={() => console.log('dismissed')}
            panDirection={PanningProvider.Directions.DOWN}
            containerStyle={{ ...styles.dialogStyle, paddingTop: 0, paddingHorizontal: 0, alignItems: 'center'}} 
        >
            { infoDialog.onload ? 
                <View style={{width: "100%", height: 250, justifyContent: 'center'}}>
                    <ActivityIndicator size="large" color={DefaultColors.navy} />
                </View>
                :
                <View style={{width: "100%", alignItems: 'center',  height: 250}}>
                    <View style={{width: '100%', height: 100, backgroundColor: color, justifyContent: 'center', alignItems: 'center'}}>
                        {infoDialog.state === "success" ? 
                            <AntDesign name={'checkcircleo'} color={'white'} size={50}/> 
                            :
                            <AntDesign name={'closecircleo'} color={'white'} size={50}/> }
                    </View>
                    <Text style={{marginVertical: 20, fontSize: 20, fontWeight: 500}}>{infoDialog.state === 'success' ? 'Success' : 'Error'}</Text>
                    <Text style={{marginBottom: 20, fontSize: 13, opacity: 0.5, width: '50%', textAlign: 'center'}}>{infoDialog.message}</Text>
                    <Button  
                        backgroundColor={color}
                        label={infoDialog.state === "success" ? "Close" : "Try again"} 
                        onPress={() => setInfoDialog((data) => {return{ ...data, visible: false}})}
                                        
                        style={styles.buttonStyle}
                    />
                </View>
            }
        </Dialog>
    )
}

const styles = StyleSheet.create({
    dialogStyle: {
        backgroundColor: 'white', 
        paddingHorizontal: 10, 
        paddingVertical: 20, 
        borderRadius: 10,
    },
    buttonStyle: {
        width: '45%',
    },

})