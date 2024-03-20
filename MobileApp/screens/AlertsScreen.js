import React, {useState, useEffect} from 'react';
import { View,  StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Avatar, ListItem, GridList, Text, Drawer } from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthConsumer } from '../hooks/useAuth';
import { getNotifications, updateNotification } from '../utils/fileHandler';

import { DefaultShadow, DefaultColors } from '../constants/styles';

const MessageMapping = {
  "Upload" : "uploaded a file",
  "Open" : "opened a file",
  "Remove" : "removed a file"
}


export default function AlertsScreen({navigation}) {
    const [alerts, setAlerts] = useState(null);
    const [ unreadCount, setUnreadCount ] = useState(0);
    const [ refreshing, setRefreshing ] = useState(false);
    const { user } = AuthConsumer();

    const options = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, // Display AM/PM
    };

    const renderRow = ({item, key}) => {
      return (
        <Drawer
            rightItems={[{text: 'Read', background: DefaultColors.navy, onPress: () => console.log('read pressed')}]}
            leftItem={{text: 'Delete', background: DefaultColors.navy, onPress: () => console.log('delete pressed')}}

            disableHaptic
            itemsMinWidth={50}
            style={{marginHorizontal: 10}}
            key={key}
            fullSwipeRight={true}
            onWillFullSwipeRight={() => handleAlertClose(item.id)}
          >
        <ListItem
          backgroundColor='white'
          paddingH-10
          paddingV-10
          br20
          >
          <ListItem.Part marginR-10>
              <Avatar source={{uri: item.imageUri}} />
            </ListItem.Part>
            <ListItem.Part containerStyle={{width: '65%'}} column  >
              <Text text90BO >{item.name}</Text>
              <Text>{item.message}</Text>
              <Text text90BO>{item.fileName}</Text>
            </ListItem.Part>
            <ListItem.Part flex center column>
              <Text>{new Date(item.createdDate).toLocaleTimeString("en-US", options)}</Text>
              <View style={{     marginTop: 10,   alignSelf: 'center'}}>
                {!item.isRead && <Avatar  size={10} backgroundColor='orange'/>}

              </View>
            </ListItem.Part>
          </ListItem>
        </Drawer>
      )
    }

    const handleAlertClose = async (id) => {
        await updateNotification(id);
      };

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
        // Simulate fetching new data
        setTimeout(() => {
        
            setRefreshing(false);
        }, 2000);
    }
    
    const loadData = async () => {
      const result = await getNotifications(user.userId);
      const list = result.map((item) => {
        return {
            id: item.id,
            name: item.accessorName,
            fileName: `${item.fileName}.${item.fileExtension}`,
            imageUri: 'https://images.unsplash.com/photo-1707655096648-1655344fc4d5?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            message: MessageMapping[item.actionName],
            isRead: item.isRead,
            createdDate: item.createdDate
        }
      })
      const count = list.filter(item => !item.isRead).length;
      setUnreadCount(count);
      setAlerts(list)
      setRefreshing(false);
    }
    useEffect(() => {
      setRefreshing(true);
      loadData()
    },[])
    return (
        <SafeAreaView style={styles.container}>
            {<Text style={{marginLeft: 10, marginBottom: 10}} text50BO>{`Notification (${unreadCount})`}</Text>}
            {alerts && <GridList style={{flex: 1, paddingTop: 10}}
              contentContainerStyle={styles.alertContainer}
              data={alerts}
              numColumns={1}
              renderItem={(item, index) => renderRow(item, index)}
              itemSpacing={17}
              refreshing={refreshing}
              onRefresh={onRefresh}
          />}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      backgroundColor: "white"
    },
    alertContainer: {
      ...DefaultShadow,
      width: '100%'
    },
    iconContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    messageContainer: {
      flex: 6,
    },
    messageText: {
      color: '#fff',
      fontSize: 16,
    },
    closeButton: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButtonText: {
      color: '#fff',
      fontSize: 20,
    },
  });
