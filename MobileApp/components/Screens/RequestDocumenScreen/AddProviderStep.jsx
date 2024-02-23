import { useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { TextField, Button, Dialog } from 'react-native-ui-lib';
import SearchableDropdown from 'react-native-searchable-dropdown';
import { StepContextConsumer } from '../../../hooks/useStepContext';

export default function ProviderSection(){
    const { provider, setProvider } = StepContextConsumer();

    const [ providerList, setProviderList ] = useState([{
        id: 1,
        name: 'Hospital 1',
        address: '222 Thomas Street, Dublin 8, Dublin, Ireland'
    }])

    

    return (
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Healthcare Provider</Text>
            <View style={{width: '100%', marginTop: 10}}>
                <Text style={{paddingStart: 5, fontWeight: '500'}}>Name</Text>
                <SearchableDropdown 
                    items={providerList}
                    onItemSelect={(item) => {
                        setProvider(item);
                    }}
                    
                    containerStyle={styles.inputStyle}
                    itemsContainerStyle={{ maxHeight: 140 }}
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
                            placeholder: "Choose provider name",
                            underlineColorAndroid: "transparent",
                            value: provider.name,
                            onTextChange: text => setProvider(text)
                        }
                    }
                    listProps={
                        {
                          nestedScrollEnabled: true,
                        }
                    }
                    
                />
            </View>
            <ScrollView style={{height: '75%'}}>
                <TextField 
                    containerStyle={{paddingHorizontal: 5, paddingVertical: 10, borderBottomColor: 'black', borderBottomWidth: 0.2, width: '100%'}}
                    label="Address"
                    labelStyle={{fontWeight: '500', marginBottom: 5}}
                    enableErrors
                    validate={['required' ]}
                    validationMessage={['Field is required']}
                    validationMessageStyle={{marginTop: 10}}
                    retainValidationSpace={false}
                    validateOnBlur
                    validateOnChange
                    onChangeText={(text) => setProvider({...provider, address: text})}
                    value={provider.address}
                />
            </ScrollView>
            
        </View>
    )
} 

const styles = StyleSheet.create({
    inputStyle: {
        paddingHorizontal: 5, 
        paddingVertical: 10, 
        borderBottomColor: 'black', 
        borderBottomWidth: 0.2, 
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