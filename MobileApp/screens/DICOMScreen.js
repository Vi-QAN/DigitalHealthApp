import { useEffect, useState, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function DICOMScreen ({navigation, route}) {
    const webViewRef = useRef(null);
    const owner = route.params.key;
    const fileHash = route.params.fileHash;
    const baseURI = "https://vi-qan.github.io/DicomViewer";
    const uri = `${baseURI}/?fileHash=${fileHash}&owner=${owner}&accessor=${owner}`;
    const encodedUri = encodeURI(uri);
    
    useEffect(() => {
        console.log(uri)
    },[])  

    return (
         <WebView
            ref={webViewRef}
            style={styles.container}
            source={{ uri: uri }}
            originWhitelist={["*"]}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            pullToRefreshEnabled={true}        
            webviewDebuggingEnabled={true}
            mixedContentMode={'always'}
            allowUniversalAccessFromFileURLs={true}
            scrollEnabled={true}/>
      );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%'
    }
})

