import { useEffect, useState, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { getRegularFile } from '../utils/fileHandler';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import { Buffer } from 'buffer';



export default function FileOpenerScreen ({navigation, route}) {
    const webViewRef = useRef(null);
    const ownerKey = route.params.ownerKey;
    const accessorKey = route.params.accessorKey;
    const fileHash = route.params.fileHash;
    const baseURI = "https://vi-qan.github.io/DicomViewer";
    const uri = `${baseURI}/?fileHash=${fileHash}&owner=${ownerKey}&accessor=${accessorKey}`;

    useEffect(() => {
        console.log(uri);
      }, []);

    return uri && (
         <WebView
            ref={webViewRef}
            style={styles.container}
            source={{ 
                uri: uri, 
            }}
            originWhitelist={["*"]}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            pullToRefreshEnabled={true}        
            webviewDebuggingEnabled={true}
            mixedContentMode={'always'}
            allowUniversalAccessFromFileURLs={true}
            scrollEnabled={true}
        />
      );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%'
    }
})

