import { useEffect, useState, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function DICOMScreen ({navigation, route}) {
    const webViewRef = useRef(null);
    const owner = route.params.key;
    const fileHash = route.params.fileHash;
    const baseURI = process.env.EXPO_PUBLIC_WEB_ENDPOINT;
    const uri = `${baseURI}?owner=${owner}&accessor=${owner}&fileHash=${fileHash}`;
    const encodedUri = encodeURI(uri);
    
    useEffect(() => {
        console.log(uri)
    },[])  

    return (
         <WebView
            ref={webViewRef}
            style={styles.container}
            source={{ uri:  uri}}
            javaScriptEnabled={true}
            onMessage={(event) => {
                const data = JSON.parse(event.nativeEvent.data);
                alert(data.key);
            }}
            onHttpError={err => console.log(err)}
        />
      );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%'
    }
})

