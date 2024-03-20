import { useEffect, useState, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { getRegularFile } from '../utils/fileHandler';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import { Buffer } from 'buffer';



export default function FileOpenerScreen ({navigation, route}) {
    const [ downloadProgress, setDownloadProgress] = useState(0);
    const [ localUri, setLocalUri ] = useState(null); 
    const webViewRef = useRef(null);
    const owner = route.params.key;
    const fileHash = route.params.fileHash;
    const baseURI = "https://vi-qan.github.io/DicomViewer";
    const uri = `${baseURI}/?fileHash=${fileHash}&owner=${owner}&accessor=${owner}`;
    const startDownload = async () => {
        try {

            const { blob, fileName, contentType } = await getRegularFile(fileHash, ownerKey, ownerKey)
            const files = await FileSystem.readDirectoryAsync(`${FileSystem.cacheDirectory}DocumentPicker`);
            for (let file of files){
                console.log(file);
            }
            console.log(await FileSystem.getInfoAsync(`${FileSystem.cacheDirectory}DigitalHealth`))

            const reader = new FileReader();
            reader.onload = async () => {
                const arrayBuffer = reader.result;
                const buff = Buffer.from(arrayBuffer, "base64");
                const base64 = buff.toString("base64");

                await FileSystem.writeAsStringAsync(`${FileSystem.documentDirectory}DigitalHealth/${fileName}`, base64, {
                    encoding: FileSystem.EncodingType.Base64,
                });

                await Sharing.shareAsync(`${FileSystem.documentDirectory}DigitalHealth/${fileName}`)
            
            };
            reader.readAsArrayBuffer(blob);
          } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        //startDownload();
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

