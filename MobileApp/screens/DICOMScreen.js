import { useEffect, useState, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { getEncryptedFile } from '../utils/fileHandler';
import * as WebBrowser from 'expo-web-browser';

const testUrls = ['https://7316-2a02-8084-2162-e200-382e-341-18d2-65bd.ngrok-free.app', 'https://localhost:7210', 'http://localhost:5273']

export default function DICOMScreen ({navigation, route}) {
    const webViewRef = useRef(null);
    const [ blobUrl, setBlobUrl ] = useState(null);
    const owner = route.params.key;
    const fileHash = route.params.fileHash;
    const baseURI = 'https://f04a-2a02-8084-2162-e200-382e-341-18d2-65bd.ngrok-free.app/';
    const uri = `${baseURI}?owner=${owner}&accessor=${owner}&fileHash=${fileHash}`;
    const encodedUri = encodeURI(uri);

    

    const loadData = async () => {
        const { blob, fileName } = await getEncryptedFile(fileHash, 'dcm', owner, owner);
        console.log(fileName);
        console.log(blob)
        const objectURL = URL.createObjectURL(blob);
        setBlobUrl(objectURL);
        const queryParams = new URLSearchParams();
        queryParams.append("owner", owner);
        queryParams.append("accessor", owner);

    }
    
    useEffect(() => {
        console.log(uri)
        //loadData();
    },[])

    // const handleLoadEnd = () => {
    //     console.log(webViewRef.current)
    //     webViewRef.current.injectJavaScript(`
    //         <!DOCTYPE HTML>
    //         <html>
    //         <body>
    //             <p id="demo"></p>
    //             <script>
    //             var init = { method: 'POST' };
    //             fetch('${testUrls[0]}/api/file/download/${fileHash}/?owner=${owner}&accessor=${owner}', {
    //                 method: 'GET',
    //                 headers: {
    //                     "ngrok-skip-browser-warning" : "0"
    //                 }
    //             })
    //             .then(res => res.blob())
    //                 .then(function (myBlob) {
    //                 document.getElementById("demo").innerHTML = myBlob
    //                 }).catch(err => alert(err));
    //                 alert("HI"); true;
    //             </script>
    //             <p></p>
    //         </body>
    //         </html>
            
        
            
        
    //     `)
        
        
        
    //     navigation.addListener('focus', () => {
            
    //     })
    // }    

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
            //onLoadEnd={handleLoadEnd}
            onHttpError={err => console.log(err)}
        />
        //<View></View>
      );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%'
    }
})

