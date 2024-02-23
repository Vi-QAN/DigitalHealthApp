import { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import SearchableDropdown from 'react-native-searchable-dropdown';

import { StepContextConsumer } from '../../../hooks/useStepContext';

export default function RequestedDocuments() {
    const {documentList, setDocumentList} = StepContextConsumer();
    const [ text, setText ] = useState('')
    const list = [
        {id: 0, name: 'Discharge Summary'},
        {id: 1, name: 'Inpatient Records'},
    ]


    const onRemoveItem = (item, index) => {
        const items = documentList.filter((sitem) => sitem.id !== item.id);
        setDocumentList(items);
    }
    const renderSelectedItems = () => {
        if(documentList === undefined && documentList.length < 1) return;
        return  (
            <ScrollView style={{height: '70%', paddingBottom: 10, marginTop: 5}}>
                { documentList.map((item, index) => {
                        return (
                            <View key={index} style={{
                                    width: (item.name.length * 8) + 60,
                                    justifyContent: 'center',
                                    flex: 0,
                                    backgroundColor: '#eee',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    margin: 5,
                                    padding: 8,
                                    borderRadius: 15,
                                }}>
                                <Text style={{ color: '#555' }}>{item.name}</Text>
                                <TouchableOpacity onPress={() => onRemoveItem(item, index)} style={{ backgroundColor: '#f16d6b', alignItems: 'center', justifyContent: 'center', width: 25, height: 25, borderRadius: 100, marginLeft: 10}}>
                                    <Text>X</Text>
                                </TouchableOpacity>
                            </View>
                    )
                }) 
             }
        </ScrollView>)
    }
    useEffect(() => {

    },[])
    
    return (
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Requested Documents</Text>
            <View style={{width: '100%', marginTop: 10}}>
                <Text style={{paddingStart: 5, fontWeight: '500'}}>Name</Text>
                <SearchableDropdown 
                    items={list}
                    onItemSelect={(item) => setDocumentList([...documentList, item])}
                    multi
                    onRemoveItem={onRemoveItem}
                    containerStyle={styles.inputStyle}
                    itemsContainerStyle={{ maxHeight: 50 }}
                    resetValue={false}
                    itemStyle={{
                        padding: 10,
                        marginTop: 2,
                        borderColor: '#bbb',
                        borderWidth: 1,
                        borderRadius: 5,
                    }}
                    textInputProps={
                        {
                            placeholder: "Choose documents",
                            underlineColorAndroid: "transparent",
                            value: text,
                            onTextChange: text => setText(text)
                        }
                    }
                    listProps={
                        {
                          nestedScrollEnabled: true,
                        }
                    }
                    
                />
            </View>
            {renderSelectedItems()}

        </View>
    )
}

const styles = StyleSheet.create({
    inputStyle: {
        paddingHorizontal: 5, 
        paddingVertical: 10, 
        borderBottomColor: 'black', 
        borderBottomWidth: 0.2, 
        width: '100%'
    },

    sectionContainer: {
        width: '100%',
    },

    sectionTitle: {
        paddingHorizontal: 5,
        fontSize: 20,
        fontWeight: '500'
    }
})