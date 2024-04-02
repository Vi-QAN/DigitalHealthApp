import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView  } from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


import { saveEncryptedFiles, deleteFile, summizeFileRequest } from '../utils/fileHandler.js';
import {View, 
    Text, 
    Drawer, 
    ListItem, 
    GridList, Modal, Checkbox, TextField  } from 'react-native-ui-lib';
import { DefaultColors, DefaultShadow } from '../constants/styles.js';
import { AuthConsumer } from '../hooks/useAuth'
import FeatherIcon from 'react-native-vector-icons/Feather';

import SearchBar from '../components/Common/SearchBar';

import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { DataConsumer } from '../hooks/useData.jsx';

export function FileListComponent ({
        fileList, 
        navigation, 
        onRefresh, 
        refreshing,
        disableRefreshing, 
        onMultiSelect, 
        setOnMultiSelect,
        disableMultiSelect,
        handleSelectChange,
        handleDeleteFile
    }) {
    const { user } = AuthConsumer();

    const handleOpenFile = async ( item) => {
        if (!disableMultiSelect && onMultiSelect) return;
        try {
            if (item.fileExtension === 'hl7'){
                navigation.navigate('Medical Message', { fileIds: [item.fileId],  ownerKey: user.key, accessorKey: user.key})
            }
            else if (item.fileExtension === 'dcm'){
                navigation.navigate('DICOM', { fileHash: item.fileHash, ownerKey: user.key, accessorKey: user.key});
            }
            else if (item.fileExtension === 'json' && item.fileName.startsWith('Wearable')){
                navigation.navigate('Wearable', {fileIds: [item.fileId], ownerKey: user.key, accessorKey: user.key})
            }
            else {
                navigation.navigate('File Opener', { ownerKey: user.key, accessorKey: user.key, fileHash: item.fileHash});
            }
        } catch (err){
            console.log(err);
        }
    }

    const handleAuthorize = () => {

    }

    const handleMultiSelect = () => {
        if (disableMultiSelect) return;
        setOnMultiSelect(true)
    }

    const renderRow = ({item}) => {
        return (
          <Drawer
            rightItems={[{text: 'Delete', background: DefaultColors.navy, onPress: () => handleDeleteFile(item.fileId)}]}
            leftItem={{text: 'Authorize', background: DefaultColors.navy, onPress: () => handleAuthorize(item.fileId)}}

            itemsMinWidth={50}
            style={{marginHorizontal: 10}}
            key={item.fileId}
          >
            <ListItem
              backgroundColor='white'
              paddingH-10
              paddingV-10
              br20
              onPress={() => handleOpenFile(item)}
              onLongPress={handleMultiSelect}
              >
                {!disableMultiSelect && onMultiSelect 
                    && (item.fileExtension === 'hl7' 
                        || item.fileName.startsWith('Wearable')) &&  
                <ListItem.Part>
                    <Checkbox 
                            borderRadius={5} 
                            iconColor={DefaultColors.whiteNavy} 
                            color={DefaultColors.navy}
                            value={item.selected}
                            style={{marginRight: 9}} 
                            onValueChange={() => handleSelectChange(item)}/>
                </ListItem.Part>}
                <ListItem.Part containerStyle={{marginRight: 9}}>
                    {item.fileExtension === 'jpg' && <AntDesign name={'jpgfile1'} size={22} />}
                    {item.fileExtension === 'pdf' && <AntDesign name={'pdffile1'} size={22} />}
                    {(item.fileExtension === 'dcm' || item.fileExtension === 'hl7') && <FontAwesome5 name={'file-medical'} size={22} />} 
                </ListItem.Part>
                <ListItem.Part left>
                    <Text black text80>{item.fileName + '.' + item.fileExtension}</Text>
                </ListItem.Part>
            </ListItem>
          </Drawer>
        )
    }

    useEffect(() => {
        
    },[fileList])

    return (   
        <GridList style={styles.container}
            contentContainerStyle={styles.drawer}
            refreshing={!disableRefreshing ? refreshing : null}
            onRefresh={!disableRefreshing ? onRefresh : null}
            data={fileList}
            numColumns={1}
            renderItem={(item, index) => renderRow(item, index)}
            itemSpacing={17}
        />

    )
    
}

export default function FileListScreen({navigation}) {
    const { originalFileList, setOriginalFileList, setOriginalFilesSummaries, loadOriginalFileList } = DataConsumer();
    const [ localFileList, setLocalFileList ] = useState(originalFileList)
    const { width, height } = Dimensions.get('screen');
    const { user } = AuthConsumer();
    const [ isVisible, setIsVisible ] = useState(false);
    const [ submittedFiles, setSubmittedFiles ] = useState([]); 
    const [ refreshing, setRefreshing ] = useState(false);
    const [ onMultiSelect, setOnMultiSelect ] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        loadOriginalFileList();
        // Simulate fetching new data
        setTimeout(() => {
        
            setRefreshing(false);
        }, 2000);
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
            setSubmittedFiles([...submittedFiles, ...assets])
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
            setSubmittedFiles([...submittedFiles, ...assets])
        }
    };

    const createFormData = () => {
        const formData = new FormData();
        submittedFiles.forEach((file) => {
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

    const handleAddFiles = async () => {
        const formData = createFormData();
        const result = await saveEncryptedFiles(formData);
        const formatted = result.map(info => {
            return {
                ...info,
                selected: false
            }
        })
        setOriginalFileList([...originalFileList, ...formatted])
    }

    const handleRemoveSubmittedFile = (fileName) => {
        const filtered = submittedFiles.filter(file => file.name !== fileName);
        setSubmittedFiles(filtered);
    }

    const handleSummarizeDocuments = async () => {
        const selectedFileIds = originalFileList.filter(file => file.selected).map(file => file.fileId);
        const result = await summizeFileRequest(selectedFileIds, user.key, user.key);
        setOriginalFilesSummaries(original => [...original, result])
    }

    const handleDeleteFile = async (fileId) => {
        await deleteFile(fileId);
        const filtered = originalFileList.filter(file => file.fileId !== fileId);
        setOriginalFileList(filtered);
    }

    const handleSelectChange = (selectedItem) => {
        const newFileList = originalFileList.map(item => {
            if (selectedItem.fileId === item.fileId){
                const newItem = {
                    ...item,
                    selected: !item.selected
                }
                return newItem;
            } else {
                return item;
            }

        })
        setLocalFileList(newFileList);
        setOriginalFileList(newFileList); 
    }

    const handleOnChangeText = (text) => {
        if (text.length === 0) {
            setLocalFileList(originalFileList);
            return;
        }
        const newList = originalFileList.filter(file => file.fileName.startsWith(text.toUpperCase()) || file.fileName.includes(text.toUpperCase()));
        setLocalFileList(newList);
    }
 
    useEffect(() => {
        
    },[originalFileList, localFileList]);

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white', paddingHorizontal: 10}}>
            {!onMultiSelect && <View style={styles.textFieldContainer} >
                <FeatherIcon name={'search'} size={30} style={{color: 'grey'}}/>
                <TextField
                    migrate
                    containerStyle={styles.textField}
                    preset={null}
                    placeholder={'Search file name'}
                    floatingPlaceholder={false}
                    enableErrors={false}
                    onChangeText={(text) => handleOnChangeText(text)}
                />
                
            </View>}
                
            {onMultiSelect && <View style={{display: 'flex', flexDirection: 'row',borderRadius: DefaultShadow.borderRadius, backgroundColor: 'white', width: '100%', height: 50, justifyContent: 'center'}}>
                <TouchableOpacity style={{ ...DefaultShadow, width: '50%', height: '100%', justifyContent: 'center', alignItems: 'center'}} onPress={() => handleSummarizeDocuments()} >
                    <View style={{display: 'flex', flexDirection: 'row',justifyContent: 'center', flex: 1, alignItems: 'center'}}>
                        <Ionicons name={'analytics-outline'} size={25} color={DefaultColors.navy} />
                        <Text style={{marginLeft: 10}}>{'Summarize'}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ ...DefaultShadow, width: '50%', height: '100%', justifyContent: 'center', alignItems: 'center'}} onPress={() => setOnMultiSelect(false)} >
                    <View style={{display: 'flex', flexDirection: 'row',justifyContent: 'center', flex: 1, alignItems: 'center'}}>
                        <MaterialCommunityIcons name={'cancel'} size={25} color={DefaultColors.navy} />
                        <Text style={{marginLeft: 10}}>{'Cancel'}</Text>
                    </View>
                </TouchableOpacity>
            </View>}
            {localFileList && <FileListComponent 
                            onRefresh={onRefresh} 
                            refreshing={refreshing} 
                            fileList={localFileList} 
                            navigation={navigation}
                            onMultiSelect={onMultiSelect}
                            setOnMultiSelect={setOnMultiSelect}
                            disableMultiSelect={false}
                            disableRefreshing={false}
                            handleSelectChange={handleSelectChange}
                            handleDeleteFile={handleDeleteFile}/>}
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
                            onCancel={() => {setIsVisible(false); setSubmittedFiles([])}}
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
                        {submittedFiles.length > 0 && submittedFiles.map((file, index) => {
                            
                            return (
                                <View key={index} style={{flexDirection: 'row', marginBottom: 10, paddingVertical: 10, paddingHorizontal: 7, height: 60, borderRadius: 10, borderWidth: 1}}>
                                    <View style={{borderRadius: 5, width: 40, alignItems:'center', justifyContent:'center', borderWidth: 1, height: '100%'}}>
                                        <AntDesign name={'jpgfile1'} size={18} />
                                    </View>
                                    <View style={{marginHorizontal: 10, width: 230, justifyContent:'center',}}>
                                        <Text>{file.name}</Text>
                                    </View>
                                    <View style={{ justifyContent:'center', height: '100%'}}>
                                        <AntDesign style={{alignSelf: 'flex-end'}} name={'close'} size={18} onPress={() => handleRemoveSubmittedFile(file.name)}/>
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
        flex: 1,
        width: '100%',
        height: '92%',
        paddingTop: 5,
        marginTop: 10
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
    },
    textFieldContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        width: '95%',
        backgroundColor: 'white',
        borderRadius: 5,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        ...DefaultShadow,
      },
    
    textField: {
        width: '100%',
        marginLeft: 5
    },
  });
  