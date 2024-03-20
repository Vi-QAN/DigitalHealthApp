import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView  } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { getFileInfoByOwner, saveEncryptedFiles, deleteFile } from '../utils/fileHandler.js';
import {View, 
    Text, 
    Drawer, 
    ListItem, 
    GridList, Modal } from 'react-native-ui-lib';
import { getHL7File } from '../utils/fileHandler';
import { DefaultColors, DefaultShadow } from '../constants/styles.js';
import { AuthConsumer } from '../hooks/useAuth'

import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

function FileListComponent ({fileList, navigation, onRefresh, refreshing}) {
    const { user } = AuthConsumer();
    const [ localFileList, setLocalFileList ] = useState(fileList); 

    const handleOpenFile = async ( item) => {
        try {
            if (item.fileExtension === 'hl7'){
                const data = await getHL7File(item.fileHash, item.fileExtension, user.key, user.key);
                navigation.navigate('Medical Message', data)
            }
            else if (item.fileExtension === 'dcm'){
                navigation.navigate('DICOM', { key: user.key, fileHash: item.fileHash});
            }
            else {
                navigation.navigate('File Opener', { key: user.key, fileHash: item.fileHash});
            }
        } catch (err){
            console.log(err);
        }
    }

    const handleDeleteFile = async (fileId) => {
        await deleteFile(fileId);
        const filtered = localFileList.filter(file => file.fileId !== fileId);
        setLocalFileList(filtered);
    }

    const renderRow = ({item, key}) => {
        return (
          <Drawer
            rightItems={[{text: 'Delete', background: DefaultColors.navy, onPress: () => handleDeleteFile(item.fileId)}]}
            itemsMinWidth={50}
            style={{marginHorizontal: 10}}
            key={key}
            
          >
            <ListItem
            backgroundColor='white'
              paddingH-10
              paddingV-10
              br20
              onPress={() => handleOpenFile(item)}
              >
                <ListItem.Part left>
                        <Text black text80>{item.fileName + '.' + item.fileExtension}</Text>

                </ListItem.Part>
            </ListItem>
          </Drawer>
        )
    }


    return (
        <GridList style={styles.container}
            contentContainerStyle={styles.drawer}
            refreshing={refreshing}
            onRefresh={onRefresh}
            data={localFileList}
            numColumns={1}
            renderItem={(item, index) => renderRow(item, index)}
            itemSpacing={17}
        />
    )
    
}

export default function FileListScreen({navigation}) {
    const [fileList, setFileList] = useState(null)
    const { width, height } = Dimensions.get('screen');
    const { user } = AuthConsumer();
    const [ isVisible, setIsVisible ] = useState(false);
    const [ files, setFiles ] = useState([]); 
    const [ refreshing, setRefreshing ] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
        // Simulate fetching new data
        setTimeout(() => {
        
            setRefreshing(false);
        }, 2000);
    }

    const loadData = async () => {
        try {
            const data = await getFileInfoByOwner(user.userId);
            setFileList(data)
        } catch(error) {
            console.log(error)
        }
    }

    const processAssets = (assets) => {
        const mapped = assets.map(asset => {
            const fileName = asset.uri.split('\/').pop();
            return {
                name: asset.name ? asset.name : fileName,
                content: asset
            }
        })

        return mapped;
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        
        const assets = processAssets(result.assets);
        
        if (!result.canceled) {
            setFiles([...files, ...assets])
        }
    };

    const pickDocument = async () => {
        // No permissions request is necessary for launching the image library
        let result = await DocumentPicker.getDocumentAsync({
          copyToCacheDirectory: true,
          multiple: true,
          type: 'application/pdf'
        });
        
        const assets = processAssets(result.assets);
        
        if (!result.canceled) {
            setFiles([...files, ...assets])
        }
    };

    const createFormData = () => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append(`files`, { 
                uri: file.content.uri, 
                name: file.name, 
                type: file.content.mimeType 
            });
        })
                
        formData.append('owner', JSON.stringify(user))
        formData.append('accessor', JSON.stringify(user))
        return formData;
    }

    const handleAddFiles = () => {
        const formData = createFormData();
        console.log(formData);
        saveEncryptedFiles(formData);
    }

    const handleRemoveFile = (fileName) => {
        const filtered = files.filter(file => file.name !== fileName);
        setFiles(filtered);
    }

    useEffect(() => {
        loadData();
    },[]);

    return (
        <SafeAreaView>
            {fileList && <FileListComponent onRefresh={onRefresh} refreshing={refreshing} fileList={fileList} navigation={navigation}/>}
            <TouchableOpacity style={styles.button} onPress={() => setIsVisible(true)} >
                <View style={{justifyContent: 'center', flex: 1, alignItems: 'center'}}>
                    <AntDesign name={'addfile'} size={20} color={'white'} />
                </View>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isVisible}
                onRequestClose={() => {
                    setIsVisible(!isVisible);
                }}
                >
                <SafeAreaView style={styles.modalContainer}>
                    <Modal.TopBar
                            onCancel={() => {setIsVisible(false); setFiles([])}}
                            onDone={handleAddFiles}
                            cancelIcon={null}
                            cancelLabel="Back"
                            doneLabel='Add'
                            cancelButtonProps={{
                                labelStyle: {color: DefaultColors.navy}
                            }}
                            doneButtonProps={{
                                labelStyle: {color: DefaultColors.navy}
                            }}
                            containerStyle={{ width: '100%', borderRadius: 5, ...DefaultShadow,}}
                            />
                    <View style={styles.addDocButton} >
                            
                            <Ionicons name='add-outline' size={20} color={DefaultColors.navy}/>
                            <Text style={{marginTop: 5}} >
                                {'Upload a '} 
                                <Text style={{color: DefaultColors.lighterNavy}} onPress={pickDocument}>document</Text>  
                                {' or an '}
                                <Text style={{color: DefaultColors.lighterNavy}} onPress={pickImage}>image</Text>
                            </Text>
                    </View>
                    <ScrollView style={{width: '100%', paddingHorizontal: 15}}>
                        {files.length > 0 && files.map((file, index) => {
                            return (
                                <View key={index} style={{flexDirection: 'row', marginBottom: 10, paddingVertical: 10, paddingHorizontal: 7, height: 60, borderRadius: 10, borderWidth: 1}}>
                                    <View style={{borderRadius: 5, width: 40, alignItems:'center', justifyContent:'center', borderWidth: 1, height: '100%'}}>
                                        <AntDesign name={'jpgfile1'} size={18} />
                                    </View>
                                    <View style={{marginHorizontal: 10, width: 230, justifyContent:'center',}}>
                                        <Text>{file.name}</Text>
                                    </View>
                                    <View style={{ justifyContent:'center', height: '100%'}}>
                                        <AntDesign style={{alignSelf: 'flex-end'}} name={'close'} size={18} onPress={() => handleRemoveFile(file.name)}/>
                                    </View>
                                </View>
                            )
                        })}
                    </ScrollView>

                </SafeAreaView>
            </Modal>
        </SafeAreaView>    
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: 'white',
        paddingTop: 10,
    },
    modalContainer: {
        height: '70%',
        alignItems: 'center', 
        ...DefaultShadow, 
        shadowRadius: 10,
        borderRadius: 5,
        backgroundColor: 'white',
        marginTop: 20,
        marginHorizontal: 10,
    },
    drawer: {
        ...DefaultShadow,
      },
      button: {
        marginBottom: 10,
        width: 55,
        height: 55,
        backgroundColor: DefaultColors.navy,
        position: 'absolute',
        bottom: 3,
        right: 10,
        ...DefaultShadow,
        borderRadius: '50%',
    },
    addDocButton: {
        borderRadius: 5,  
        backgroundColor: 'white',
        borderColor: DefaultColors.navy,
        borderWidth: '1px',
        borderStyle: 'dashed',
        height: 150,
        marginVertical: 10,
        width: '91%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }
  });
  