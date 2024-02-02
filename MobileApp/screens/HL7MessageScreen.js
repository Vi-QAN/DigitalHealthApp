
import { useState, useEffect } from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Card, Text, Image, ListItem, Carousel, View, ExpandableSection, Switch, GridList} from 'react-native-ui-lib';
import FontAwesome from 'react-native-vector-icons/FontAwesome'


export default function HL7MessageScreen ({navigation, route}) {
    const [ preparedItems, setPreparedItems ] = useState([]);

    const prepareData = () => {
        const data = route.params.admissionContent;
        if (!data) return;
        const items = Object.entries(data).map(([key, value]) => {
            if (key !== "messageType") {
                return {
                    key: key.charAt(0).toUpperCase() + key.slice(1),
                    value: value,
                    expanded: true
                }
            }
        })
        setPreparedItems(items);
    }

    const renderItem = ({item, index, separators}) => {
        return (
            <View style={styles.itemContainer}>
                <Text key={index}>{item}</Text>
            </View>
            
        )
    }

    const getHeaderElement = (item) => {
        return (
          <View margin-10 spread row>
            <Text grey10 text60>
              {item.key}
            </Text>
            {!item.expanded ? <FontAwesome name={'chevron-down'} size={24} color={'black'}/>:  <FontAwesome name={'chevron-up'} size={24} color={'black'}/>}
          </View>
        );
    }

    const handleOnPress = (key) => {
        if (preparedItems.length < 0) return;

        setPreparedItems(items => items.map((item) => { return item && item.key === key ? { ...item, expanded: !item.expanded} : item}) );
    }
    
    useEffect(() => {
        prepareData();
    }, [])

    useEffect(() => {
    }, [preparedItems])

    return (
        <View>
            {preparedItems.map((item) => {
                if (!item) return;
                return (
                    <View 
                        backgroundColor="white"
                        paddingH-10
                        paddingV-10
                        marginV-5
                        br20>
                        <ExpandableSection 
                            
                            expanded={item.expanded}
                            sectionHeader={getHeaderElement(item)}
                            onPress={() => handleOnPress(item.key)}
                            >
                                <View margin-10>
                                    {item.key !== 'AdmissionReason' ? <GridList numColumns={1} data={item.value} renderItem={renderItem} /> : <Text> {item.value} </Text>}
                                </View>
                                
                        </ExpandableSection>
                    </View>
                )
            })}
            
        </View>
    )
}

const styles = StyleSheet.create({
    itemContainer: {
        width: '100%'
    }
  });