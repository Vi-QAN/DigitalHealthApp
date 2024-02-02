import React, {useEffect, useState} from 'react';
import { StyleSheet, Dimensions, ScrollView } from 'react-native';
import {View, 
        Text, 
        Drawer, 
        Colors, 
        ListItem, 
        Avatar, 
        GridView,
        GridList,
        GridListItem} from 'react-native-ui-lib';


export default function ContactComponent({navigation}){
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const { width, height } = Dimensions.get("screen");
    const conversations = [
      {
        name: 'Vanessa Campbell',
        text: 'Do you have these in other colors?',
        timestamp: '1 Week',
        count: '',
        thumbnail:
          'https://static.wixstatic.com/media/d4367b20ae2e4036b18c34262d5ed031.jpg/v1/fit/w_750,h_750/d4367b20ae2e4036b18c34262d5ed031.jpg',
        isNew: true,
        leftTitleBadge: 'twitterOn'
      },
      {
        name: 'Vanessa Campbell',
        text: 'Do you have these in other colors?',
        timestamp: '1 Week',
        count: '',
        thumbnail:
          'https://static.wixstatic.com/media/d4367b20ae2e4036b18c34262d5ed031.jpg/v1/fit/w_750,h_750/d4367b20ae2e4036b18c34262d5ed031.jpg',
        isNew: true,
        leftTitleBadge: 'twitterOn'
      },
      {
        name: 'Vanessa Campbell',
        text: 'Do you have these in other colors?',
        timestamp: '1 Week',
        count: '',
        thumbnail:
          'https://static.wixstatic.com/media/d4367b20ae2e4036b18c34262d5ed031.jpg/v1/fit/w_750,h_750/d4367b20ae2e4036b18c34262d5ed031.jpg',
        isNew: true,
        leftTitleBadge: 'twitterOn'
      },
      {
        name: 'Vanessa Campbell',
        text: 'Do you have these in other colors?',
        timestamp: '1 Week',
        count: '',
        thumbnail:
          'https://static.wixstatic.com/media/d4367b20ae2e4036b18c34262d5ed031.jpg/v1/fit/w_750,h_750/d4367b20ae2e4036b18c34262d5ed031.jpg',
        isNew: true,
        leftTitleBadge: 'twitterOn'
      },
      {
        name: 'Vanessa Campbell',
        text: 'Do you have these in other colors?',
        timestamp: '1 Week',
        count: '',
        thumbnail:
          'https://static.wixstatic.com/media/d4367b20ae2e4036b18c34262d5ed031.jpg/v1/fit/w_750,h_750/d4367b20ae2e4036b18c34262d5ed031.jpg',
        isNew: true,
        leftTitleBadge: 'twitterOn'
      },
      {
        name: 'Vanessa Campbell',
        text: 'Do you have these in other colors?',
        timestamp: '1 Week',
        count: '',
        thumbnail:
          'https://static.wixstatic.com/media/d4367b20ae2e4036b18c34262d5ed031.jpg/v1/fit/w_750,h_750/d4367b20ae2e4036b18c34262d5ed031.jpg',
        isNew: true,
        leftTitleBadge: 'twitterOn'
      },
      {
        name: 'Vanessa Campbell',
        text: 'Do you have these in other colors?',
        timestamp: '1 Week',
        count: '',
        thumbnail:
          'https://static.wixstatic.com/media/d4367b20ae2e4036b18c34262d5ed031.jpg/v1/fit/w_750,h_750/d4367b20ae2e4036b18c34262d5ed031.jpg',
        isNew: true,
        leftTitleBadge: 'twitterOn'
      },
      {
        name: 'Vanessa Campbell',
        text: 'Do you have these in other colors?',
        timestamp: '1 Week',
        count: '',
        thumbnail:
          'https://static.wixstatic.com/media/d4367b20ae2e4036b18c34262d5ed031.jpg/v1/fit/w_750,h_750/d4367b20ae2e4036b18c34262d5ed031.jpg',
        isNew: true,
        leftTitleBadge: 'twitterOn'
      },
      {
        name: 'Vanessa Campbell',
        text: 'Do you have these in other colors?',
        timestamp: '1 Week',
        count: '',
        thumbnail:
          'https://static.wixstatic.com/media/d4367b20ae2e4036b18c34262d5ed031.jpg/v1/fit/w_750,h_750/d4367b20ae2e4036b18c34262d5ed031.jpg',
        isNew: true,
        leftTitleBadge: 'twitterOn'
      },
      {
        name: 'Vanessa Campbell',
        text: 'Do you have these in other colors?',
        timestamp: '1 Week',
        count: '',
        thumbnail:
          'https://static.wixstatic.com/media/d4367b20ae2e4036b18c34262d5ed031.jpg/v1/fit/w_750,h_750/d4367b20ae2e4036b18c34262d5ed031.jpg',
        isNew: true,
        leftTitleBadge: 'twitterOn'
      }

    ]
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
          rightItems={[{text: 'Read', background: Colors.blue30, onPress: () => console.log('read pressed')}, ]}
          leftItem={{text: 'Delete', background: Colors.red30, onPress: () => console.log('delete pressed')}}
          itemsMinWidth={50}
          style={{width: 345}}
          key={key}
          
        >
          <ListItem
            backgroundColor='white'
            paddingH-10
            paddingV-10
            br20
            onPress={() => navigation.navigate("Message")}
            >
            <ListItem.Part marginR-10 >
                <Avatar></Avatar>
              </ListItem.Part>
              <ListItem.Part containerStyle={{width: 210}} column  >
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

    return (
      <GridList style={styles.container}
          data={conversations}
          numColumns={1}
          renderItem={(item, index) => renderRow(item, index)}
          itemSpacing={17}
      />
    )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
  messageCount: {
    backgroundColor: '#130f55',
    borderRadius: 50,
    width: 20,
    height: 20,
    marginTop: 10,
    alignSelf: 'flex-end'
  }
});