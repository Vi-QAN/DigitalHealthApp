import { useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView } from 'react-native';
import { TextField, Button, Dialog } from 'react-native-ui-lib';

import InfoDialog from '../components/Common/InfoDialog';

import DateTimePicker from '@react-native-community/datetimepicker';
import SearchableDropdown from 'react-native-searchable-dropdown';

import { ChartDataConsumer } from '../hooks/useChartData';

import { uploadWearableData, getDataRange } from "../utils/fileHandler";
import { AuthConsumer } from '../hooks/useAuth';
import { DefaultColors} from '../constants/styles';
import { DataConsumer } from '../hooks/useData';

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

export default function ExportDataScreen({navigation}){
    const { user } = AuthConsumer();
    const { setOriginalFileList } = DataConsumer();
    const { formatDate } = ChartDataConsumer();
    const [ date, setDate ] = useState({state: 'from', from: '', to: ''});
    const [ pickerVisible, setPickerVisible ] = useState(false);
    const [ pickedDate, setPickedDate ] = useState(new Date())
    const [ selectedDataType, setSelectedDataType ] = useState('All');
    const [ infoDialog, setInfoDialog ] = useState({state: 'error', message: 'Wearable data has been exported successfully', visible: false, onload: false});

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

    const filterData = (data, dateFrom, dateTo) => {
        const filtered = data.filter(item => {
            const itemDate = new Date(item.datetime);
            if (itemDate < dateFrom || itemDate > dateTo) return false;
            return true;
        })
        return filtered
    }

    const mapData = (option, data) => {
        let result = null;
        switch(DataTypeMapping[option]){
            case 0:
                result = data.map((item => { 
                    return {
                        dateTime: item.datetime, 
                        bloodPressure: item.blood_pressure,
                        heartRate: item.heart_rate,
                        oxygenLevel: item.oxygen_level
                    }}
                ));
                break;
            case 1:
                result = data.map((item => { 
                    return {
                        dateTime: item.datetime, 
                        heartRate: item.heart_rate,
                    }}
                ));
                break;
            case 2: 
                result = data.map((item => { 
                    return {
                        dateTime: item.datetime, 
                        bloodPressure: item.blood_pressure,
                    }}
                ));
                break;
            case 3:
                result = data.map((item => { 
                    return {
                        dateTime: item.datetime, 
                        oxygenLevel: item.oxygen_level
                    }}
                ));
                break;
            default:
                console.log('Case not found');
        }
        return result;
    }

    const handleExportData = async () => {
        if (date.from.length === 0 || date.to.length === 0) return
        const dateFrom = new Date(date.from);
        const dateTo = new Date(date.to);
        if (dateFrom > dateTo) return;
        const current = new Date();
        if (dateTo > current) return;

        setInfoDialog((data) => {{return {...data, visible: true, onload: true}}})
        const formattedFromDate = formatDate(dateFrom);
        const formattedToDate = formatDate(dateTo);
        const res = await getDataRange(formattedFromDate,formattedToDate );

        const filteredData = filterData(res, dateFrom, dateTo);
        const mappedData = mapData(selectedDataType, filteredData);
        const submission = {
            ownerId: user.userId,
            content: mappedData
        }
        const result = await uploadWearableData(submission);
        if (result){
            setInfoDialog({ state: 'success', message: 'Wearable data has been exported successfully', visible: true, onload: false});
            setOriginalFileList(list => [...list, { ...result, selected: false}])
        } else {
            setInfoDialog({ state: 'error', message: 'Error encountered while exporting data', visible: true, onload: false});
        }

    }

    const handleFocus = (state) => {
        setDate(d => {return {...d, state: state}})
        setPickerVisible(true)
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{flex: 1, paddingHorizontal: 10, alignItems: 'center'}}>
                <Text style={{fontWeight: 500, fontSize: 20, marginVertical: 30}}>Export Your Wearable Data</Text>
                <TextField 
                    containerStyle={{paddingHorizontal: 5, paddingVertical: 10, borderBottomColor: 'black', borderBottomWidth: 0.2, width: '100%'}}
                    placeholder="Choose a date"
                    label="From"
                    labelStyle={{fontWeight: '500', marginBottom: 5}}
                    enableErrors
                    validate={['required' ]}
                    validationMessage={['Field is required']}
                    validationMessageStyle={{marginTop: 10}}
                    retainValidationSpace={false}
                    validateOnBlur
                    validateOnChange
                    onFocus={() => handleFocus('from')}
                    value={date.from.toLocaleString()}
                />
                <TextField 
                    containerStyle={{paddingHorizontal: 5, paddingVertical: 10, borderBottomColor: 'black', borderBottomWidth: 0.2, width: '100%'}}
                    placeholder="Choose a date"
                    label="To"
                    labelStyle={{fontWeight: '500', marginBottom: 5}}
                    enableErrors
                    validate={['required' ]}
                    validationMessage={['Field is required']}
                    validationMessageStyle={{marginTop: 10}}
                    retainValidationSpace={false}
                    validateOnBlur
                    validateOnChange
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
                    color={DefaultColors.navy} 
                    outlineColor={DefaultColors.navy} 
                    label="Cancel" 
                    onPress={() => navigation.goBack('Default')}
                    style={styles.buttonStyle}

                />
                <Button
                    backgroundColor={DefaultColors.navy}
                    style={styles.buttonStyle}
                    label="Export" 
                    onPress={() => handleExportData()}/>
            </View>
            
            
            <Dialog
                ignoreBackgroundPress={true}
                visible={pickerVisible}
                containerStyle={styles.dialogStyle}>
                <DateTimePicker 
                    style={{marginBottom: 30}}
                    value={pickedDate} 
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
                        color={DefaultColors.navy} 
                        outlineColor={DefaultColors.navy} 
                        label="Cancel" onPress={() => setPickerVisible(false)}
                        style={styles.buttonStyle}
                    />

                    <Button  
                        backgroundColor={DefaultColors.navy}
                        label="Done" 
                        onPress={() => handleConfirmDatePick()}                  
                        style={styles.buttonStyle}
                    />
                </View>          
            </Dialog>
            <InfoDialog infoDialog={infoDialog} setInfoDialog={setInfoDialog}/>
        </SafeAreaView>
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