import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Text, View, ExpandableSection, GridList} from 'react-native-ui-lib';
import { FileListComponent } from './FileListScreen';

import { AuthConsumer } from '../hooks/useAuth';

import { getFileInfoByAccessor } from '../utils/fileHandler';
import { DefaultShadow } from '../constants/styles';

import AntDesign from 'react-native-vector-icons/AntDesign';


const SharedWithMeScreen = ({navigation}) => {
  const [ fileList, setFileList ] = useState([]);
  const activeOwner = useRef(null)
  const { user } = AuthConsumer();

  const loadFileList = async () => {
    let list = await getFileInfoByAccessor(user.userId);
    list = list.map(item => {
      return { 
        ...item, 
        expanded: false
    }})
    setFileList(list)
  }

  const handleExpandSection = (owner) => {
    activeOwner.current = owner;
    const newList = fileList.map(item => {
      if (item.ownerId === owner.ownerId){
        return {
          ...item, 
          expanded: !item.expanded
        }
      }else {
        return {
          ...item,
          expanded: false
        };
      }  
    })
    setFileList(newList);
  }

  const handleOpenFile = (item) => {
    if (!activeOwner.current) return;
    try {
        if (item.fileExtension === 'hl7'){
            navigation.navigate('Medical Message', { fileIds: [item.fileId],  ownerKey: activeOwner.current.key, accessorKey: user.key})
        }
        else if (item.fileExtension === 'dcm'){
            navigation.navigate('DICOM', { fileHash: item.fileHash, ownerKey: activeOwner.current.key, accessorKey: user.key});
        }
        else if (item.fileExtension === 'json' && item.fileName.startsWith('Wearable')){
            navigation.navigate('Wearable', {fileIds: [item.fileId], ownerKey: activeOwner.current.key, accessorKey: user.key})
        }
        else {
            navigation.navigate('File Opener', { ownerKey: activeOwner.current.key, accessorKey: user.key, fileHash: item.fileHash});
        }
    } catch (err){
        console.log(err);
    }
  }

  const renderExpandableHeader = (item) => {
    return (
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        ...DefaultShadow, 
        borderRadius: 0, 
        width: '100%', 
        backgroundColor: 'white', 
        paddingVertical: 20, 
        padding: 10,
        justifyContent: 'space-between',
        alignItems: 'center'
        }}>
        <Text style={{fontSize: 15, fontWeight: 600}}>{item.userName}</Text>
        {item.expanded ? <AntDesign name={'caretdown'} size={20} /> : <AntDesign name={'caretleft'} size={20} />}
      </View>
    )
  }

  const renderRow = ({item}) => {
    return (
      <View style={{width: '100%'}}>
        <ExpandableSection
          sectionHeader={renderExpandableHeader(item)}
          expanded={item.expanded}
          onPress={() => handleExpandSection(item)}
        >
          <FileListComponent 
            fileList={item.informationList} 
            navigation={navigation} 
            disableMultiSelect={true}
            disableRefreshing={true}
            onOpenFile={handleOpenFile}/> 
        
        </ExpandableSection>
      </View>
      )
  }

  useEffect(() => {

  },[fileList])

  useEffect(() => {
    loadFileList();
  },[])
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <GridList style={styles.container}
        contentContainerStyle={{...DefaultShadow, width: '100%'}}

        // refreshing={!disableRefreshing ? refreshing : null}
        // onRefresh={!disableRefreshing ? onRefresh : null}
        data={fileList}
        numColumns={1}
        renderItem={(item, index) => renderRow(item, index)}
        itemSpacing={10}
      />
    </SafeAreaView>
    
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingTop: 10
  },

});


export default SharedWithMeScreen;
