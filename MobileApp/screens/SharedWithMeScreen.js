import React, {useState, useEffect} from 'react';
import { StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Text, View, ExpandableSection, GridList} from 'react-native-ui-lib';
import { FileListComponent } from './FileListScreen';

import { AuthConsumer } from '../hooks/useAuth';

import { getFileInfoByAccessor } from '../utils/fileHandler';
import { DefaultShadow } from '../constants/styles';

import AntDesign from 'react-native-vector-icons/AntDesign';


const SharedWithMeScreen = ({navigation}) => {
  const [ fileList, setFileList ] = useState([]);
  const { user } = AuthConsumer();

  const loadFileList = async () => {
    let list = await getFileInfoByAccessor(user.userId);
    list = list.map(item => {
      return { 
        ...item, 
        expanded: false
    }})
    console.log(list)
    setFileList(list)
  }

  const handleExpandSection = (userId) => {
    const newList = fileList.map(item => {
      if (item.ownerId === userId){
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
        onPress={() => handleExpandSection(item.ownerId)}
        >
          <FileListComponent 
            fileList={item.informationList} 
            navigation={navigation} 
            disableMultiSelect={true}
            disableRefreshing={true}/> 
        
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
