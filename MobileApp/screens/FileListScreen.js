import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { getFileInfoByOwner } from '../utils/fileHandler.js';
import SearchBar from '../components/Common/SearchBar';
import {View, 
    Text, 
    Drawer, 
    Colors, 
    ListItem, 
    GridList } from 'react-native-ui-lib';
import { getEncryptedFile } from '../utils/fileHandler';


const owner = {userId: 27, key: '0xe543BCF6818Dd7a5AE26a1722150F70f543b31F2'};

function FileListComponent ({fileList, navigation}) {
    
    const handleOpenFile = async ( item) => {
        try {
            if (item.fileExtension === 'hl7'){
                const data = await getEncryptedFile(item.fileHash, item.fileExtension, owner.key, owner.key);
                navigation.navigate('Medical Message', data)
            }
            else {
                navigation.navigate('DICOM', { key: owner.key, fileHash: item.fileHash});
            }
        } catch (err){
            console.log(err);
        }
        
    }

    const renderRow = ({item, key}) => {
        return (
          <Drawer
            rightItems={[{text: 'Share', background: Colors.blue30, onPress: () => console.log('Share pressed')} ]}
            leftItem={{text: 'Delete', background: Colors.red30, onPress: () => console.log('delete pressed')}}
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

    useEffect(() => {
    }, [fileList])

    return (
        <GridList style={styles.container}
            data={fileList}
            numColumns={1}
            renderItem={(item, index) => renderRow(item, index)}
            itemSpacing={17}
        />
    )
    
}

export default function FileListScreen({navigation}) {
    const [fileList, setFileList] = useState(null)
    const { width, height } = Dimensions.get('screen');

    const loadData = async () => {
        try {
            const data = await getFileInfoByOwner(owner.userId);
            setFileList(data)
        } catch(error) {
            console.log(error)
        }
        
        //setFileList(data);
    }

    useEffect(() => {
        loadData();
    },[]);

    

    return (
       
        <View>
            {fileList && <FileListComponent fileList={fileList} navigation={navigation}/>}
        </View>    
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'lightgray',
      padding: 10,
    },
    headerBackText: {
      color: 'blue',
      fontSize: 18,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginLeft: 10,
    },
  });
  