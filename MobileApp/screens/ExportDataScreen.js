import { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextField, Button, Dialog } from 'react-native-ui-lib';
import SearchableDropdown from 'react-native-searchable-dropdown';


const DataTypeMapping = {
    'All' : 0,
    'Heart Rate' : 1,
    'Blood Pressure' : 2,
    'Oxygen Level' : 3
}

const DropdownData = [
    {id: 0, name: 'All'},
    {id: 1, name: 'Heart Rate'},
    {id: 2, name: 'Blood Pressure'},
    {id: 3, name: 'Oxygen Level'}    
]

export default function ExportDataScreen({navigation, data}){
    const [ date, setDate ] = useState({state: 'from', from: '', to: ''});
    const [ dataType, setDataType ] = useState([]);
    const [ pickerVisible, setPickerVisible ] = useState(false);
    const [ pickedDate, setPickedDate ] = useState('')
    const [ selectedDataType, setSelectedDataType ] = useState('');

    const handleChangeDateFrom = (value) => {
        setDate(d => { return { ...d, from: value}});
    }

    const handleChangeDateTo = (value) => {
        setDate(d => { return { ...d, to: value}})
    }

    const handleDatePick = (event, value) => {
        setPickedDate(value);
    }

    const handleConfirmDatePick = () => {
        date.state === 'from' ? handleChangeDateFrom(pickedDate) : handleChangeDateTo(pickedDate);
        setPickerVisible(false)
    }

    const handleExportData = () => {
        let exportedData = { heart_rate: [], blood_pressure: [], oxygen_level: []};
        switch(DataTypeMapping[dataType]){
            case 0:
                exportedData.heart_rate = data.map(item => {return {datetime: item.datetime, value: item.heart_rate}})
                exportedData.blood_pressure = data.map(item => {return {datetime: item.datetime, value: item.blood_pressure}})
                exportedData.oxygen_level = data.map(item => {return {datatime: item.datetime, value: item.oxygen_level}})
                break;
            case 1: 
                exportedData.heart_rate = data.map(item => {return {datetime: item.datetime, value: item.heart_rate}})
                break;
            case 2: 
                exportedData.blood_pressure = data.map(item => {return {datetime: item.datetime, value: item.blood_pressure}})
                break;
            case 3:
                exportedData.oxygen_level = data.map(item => {return {datatime: item.datetime, value: item.oxygen_level}})
                break;
        }

    }

    const onChangeText = () => {

    }

    const handleFocus = (state) => {
        setDate(d => {return {...d, state: state}})
        setPickerVisible(true)
    }

    return (
        <View style={styles.container}>
            <View style={{flex: 1, marginTop: '10%', alignItems: 'center'}}>
                <Text style={{fontWeight: 500, fontSize: 20, marginBottom: 30}}>Export Your Data</Text>
                <TextField 
                    containerStyle={{paddingHorizontal: 5, paddingVertical: 10, borderBottomColor: 'black', borderBottomWidth: 0.2, width: '100%'}}
                    placeholder="Choose a date"
                    label="From"
                    labelStyle={{fontWeight: '500', marginBottom: 5}}
                    onChangeText={onChangeText}
                    onFocus={() => handleFocus('from')}
                    value={date.from.toLocaleString()}
                />
                <TextField 
                    containerStyle={{paddingHorizontal: 5, paddingVertical: 10, borderBottomColor: 'black', borderBottomWidth: 0.2, width: '100%'}}
                    placeholder="Choose a date"
                    label="To"
                    labelStyle={{fontWeight: '500', marginBottom: 5}}
                    onChangeText={onChangeText}
                    onFocus={() => handleFocus('to')}
                    value={date.to.toLocaleString()}
                />
                <View style={{width: '100%', marginTop: 10}}>
                    <Text style={{paddingStart: 5, fontWeight: '500'}}>Data Type</Text>
                    <SearchableDropdown 
                        items={DropdownData}
                        onItemSelect={(item) => {
                            setSelectedDataType(item.name);
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
                                placeholder: "Choose type of data",
                                underlineColorAndroid: "transparent",
                                value: selectedDataType,
                                onTextChange: text => setSelectedDataType(text)
                            }
                        }
                        
                    />
                </View>
                
            </View>
            
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                <Button 
                    backgroundColor='white' 
                    color='black' 
                    outlineColor='black' 
                    label="Cancel" 
                    onPress={() => navigation.navigate('Default')}
                    style={styles.buttonStyle}

                />
                <Button
                    style={styles.buttonStyle}
                    label="Export" 
                    onPress={handleExportData}/>
            </View>
            
            
            <Dialog
                ignoreBackgroundPress={true}
                visible={pickerVisible}
                containerStyle={styles.dialogStyle}>
                <DateTimePicker 
                    style={{marginBottom: 30}}
                    value={new Date()} 
                    mode={'datetime'} 
                    display={'spinner'}
                    onChange={handleDatePick}
                    />
                <View style={{
                    display: 'flex', 
                    flexDirection: 'row', 
                    width: '100%',
                    justifyContent: 'space-around'}}>
                    <Button 
                        backgroundColor='white' 
                        color='black' 
                        outlineColor='black' 
                        label="Cancel" onPress={() => setPickerVisible(false)}
                        style={styles.buttonStyle}
                    />

                    <Button  
                        label="Done" 
                        onPress={() => handleConfirmDatePick()}                  
                        style={styles.buttonStyle}
                    />
                </View>
                
                    
            </Dialog>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white',
    },
    dialogStyle: {
        backgroundColor: 'white', 
        paddingHorizontal: 10, 
        paddingVertical: 20, 
        borderRadius: 10,
    },
    buttonStyle: {
        width: '45%',
    },

    inputStyle: {
        paddingHorizontal: 5, 
        paddingVertical: 10, 
        borderBottomColor: 'black', 
        borderBottomWidth: 0.2, 
        width: '100%'
    }


})