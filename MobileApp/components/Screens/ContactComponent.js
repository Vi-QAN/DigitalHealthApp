import React, {useEffect, useState} from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import {View, 
        Text, 
        Drawer, 
        Colors, 
        ListItem, 
        Avatar, 
        GridView,
        GridList,
        GridListItem} from 'react-native-ui-lib';

import { DefaultShadow, DefaultColors } from '../../constants/styles';

export default function ContactComponent({navigation, authorizationList, onRevokeAuthorization}){
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const { width, height } = Dimensions.get("screen");

    const handleRevokeAuthorization = (item) => {
      onRevokeAuthorization(item);
    }

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentDateTime(new Date());
      }, 1000); // Update every 1 secondr
      return () => {
        clearInterval(interval);
      };
    }, []);

    const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, // Display AM/PM
      };

    const formattedDateTime = currentDateTime.toLocaleTimeString("en-US", options);

    const renderRow = ({item, key}) => {
      return (
        <Drawer
          
          rightItems={[{text: 'Revoke', background: DefaultColors.navy, onPress: () => handleRevokeAuthorization(item)}, ]}
          itemsMinWidth={50}
          style={{marginHorizontal: 10}}
          key={key}
          
        >
          <ListItem
            backgroundColor='white'
            paddingH-10
            paddingV-10
            br20
            >
            <ListItem.Part marginR-10 >
                <Avatar></Avatar>
              </ListItem.Part>
              <ListItem.Part containerStyle={{width: '65%'}} column  >
                <Text text80BO>{item.name}</Text>
                <Text>{item.text}</Text>
              </ListItem.Part>
              <ListItem.Part flex center column>
                <Text>{formattedDateTime}</Text>
                <View style={styles.messageCount}>
                  <Text white text80 center>3</Text>
                </View>
              </ListItem.Part>
          </ListItem>
        </Drawer>
      )
    }

    return authorizationList ? (
      <GridList style={styles.container}
          contentContainerStyle={styles.drawer}
          data={authorizationList}
          numColumns={1}
          renderItem={(item, index) => renderRow(item, index)}
          itemSpacing={17}
      />
    ) : null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  messageCount: {
    backgroundColor: '#130f55',
    borderRadius: 50,
    width: 20,
    height: 20,
    marginTop: 10,
    alignSelf: 'flex-end'
  },
  drawer: {
    ...DefaultShadow,
    marginRight: 10,
  }
});