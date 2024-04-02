
import { useState, useEffect } from 'react';
import {StyleSheet} from 'react-native';
import { Text, View, ExpandableSection} from 'react-native-ui-lib';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { openHL7Files } from '../utils/fileHandler';

export default function HL7MessageScreen ({navigation, route}) {
    const [ preparedItems, setPreparedItems ] = useState([]);
    const ownerKey = route.params.ownerKey;
    const accessorKey = route.params.accessorKey;
    const fileIds = route.params.fileIds;

    const processInnerData = (content) => {
        let extracted = []
        content.forEach(item =>{
            let str = ""; 
            Object.entries(item).map(([key, value]) => {
                str += `${key}: ${value}, `
            })
            str = str.trim();
            str = str.substring(0, str.length - 1)
            extracted.push(str);
        })
        return extracted;
    }
    
    const processData = (content) => {
        const items = Object.entries(content).map(([key, value]) => {
            if (key !== "messageType" && value !== null) {
                if (key === "admissionReason"){
                    return {
                        key: "Admission Reason",
                        value: value,
                        expanded: false
                    }
                }
                else if (key === "allergies"){
                    return {
                        key: "Allergies",
                        value: value.join(";"),
                        expanded: false
                    }
                }
                else if (key === "diagnosises"){
                    return {
                        key: "Diagnosises",
                        value: value.join(";"),
                        expanded: false
                    }
                }
                else if (key === "dob"){
                    const arr = value.split('/');
                    console.log(arr);
                    return {
                        key: "Date of birth",
                        value: new Date(`${arr[0]}-${arr[1]}-${arr[2]}`).toLocaleDateString(),
                        expanded: false,
                    }
                }
                else if (key === "patientName"){
                    console.log(value);
                    return {
                        key: "Patient Name",
                        value: value,
                        expanded: false,
                    }
                }
                else if (key === "sex"){
                    return {
                        key: "Sex",
                        value: value[0] === "M" ? "Male" : "Female",
                        expanded: false
                    }
                }
                else if (key === "transactions"){
                    const extracted = processInnerData(value);
                    return {
                        key: "Transactions",
                        value: extracted.join("\n"),
                        expanded: false
                    }
                }
                else if (key === "observations"){
                    const extracted = processInnerData(value)
                    return {
                        key: "Observations",
                        value: extracted.join("\n"),
                        expanded: false
                    }
                }
            }
        })
        setPreparedItems(items);
    }

    const loadData = async () => {
        const data = await openHL7Files(fileIds, ownerKey, accessorKey);
        console.log(data);
        if (!data) return;
        if (data[0].admissionContent !== null){
            processData(data[0].admissionContent);
        } else if (data[0].observationContent !== null){
            processData(data[0].observationContent);
        } else if (data[0].dispenseContent !== null){
            processData(data[0].dispenseContent);
        } else if (data[0].orderEntryContent !== null){
            processData(data[0].orderEntryContent);
        }
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
        loadData();
    }, [])

    useEffect(() => {
    }, [preparedItems])

    return (
        <View>
            {preparedItems.map((item,index) => {
                if (!item) return;
                return (
                    <View 
                        key={index}
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
                                    <Text>{item.value}</Text>
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