
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

import ContactComponent from '../components/Screens/ContactComponent';

import SearchableDropdown from 'react-native-searchable-dropdown';

import {getUserList, authorizeRequest, getAuthorizationList, revokeAuthorizationRequest} from '../utils/fileHandler';
import { useEffect, useState } from 'react';
import { authorizeAccessor, revokeAccessor } from '../utils/web3Helper';
import { useContractWrite } from 'wagmi';

import DigitalHealthContract from '../contracts/DigitalHealth.json';
import { AuthConsumer } from '../hooks/useAuth';
import { Button } from 'react-native-ui-lib';
const abi = DigitalHealthContract['abi']

export default function ConversationScreen({navigation}){
    const [ userList, setUserList ] = useState([]);
    const [ dropdownData, setDropdownData ] = useState(null);
    const [ selectedItem, setSelectedItem ] = useState(null);
    const [ text, setText ] = useState('');
    const [ authorizationList, setAuthorizationList ] = useState([]);
    const { data, writeAsync, error, isError } = useContractWrite({
        abi,
        address: process.env.EXPO_PUBLIC_CONTRACT_ADDRESS,
        functionName: 'signup',
    });
    const { user } = AuthConsumer();

    const load = async () => {
        const originalList = await getUserList();
        const customList = originalList.filter(item => item.userId !== user.userId).map((item) => {
            return { id: item.userId, name: item.name }
        })
        setUserList(originalList);
        setDropdownData(customList);

        const originalAuthorizationList = await getAuthorizationList({userId: user.userId})
        setAuthorizationList(originalAuthorizationList.map(item => {return {...item, name: item.name, text: 'Change later'}}))
    }

    const handleAuthorization = async () => {
        if (!selectedItem) return;
        const accessorInfo = userList.find((item) => item.userId === selectedItem.id);
        const authorizeAccessorObject = authorizeAccessor({accessor: accessorInfo.key, password: '123', owner: user.key});
        try {
            await writeAsync(authorizeAccessorObject);
            await authorizeRequest({ownerId: user.key, accessorId: accessorInfo.key});
            const list = authorizationList;
            list.push({ accessorId: accessorInfo.userId, accessorKey: accessorInfo.key, name: accessorInfo.name, isAuthorized: true});
            setAuthorizationList(list);
        } catch(err) {
            console.log(err);
        }
    }

    const handleRevokeAuthorization = async (accessor) => {
        if (!accessor) return;
        const revokeAuthorizationObject = revokeAccessor({accessor: accessor.accessorKey, password: '123', owner: user.key})
        try {
            await writeAsync(revokeAuthorizationObject);
            isError ? console.log(error.message) : console.log('nothing')
            await revokeAuthorizationRequest({ownerId: user.key, accessorId: accessor.accessorKey});
            const list = authorizationList.filter((item) => item.accessorId !== accessor.accessorId);
            setAuthorizationList(list);
        } catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        load();
    },[])

    return dropdownData ? (
        <View style={styles.container}>
            <SearchableDropdown 
                items={dropdownData}
                onItemSelect={(item) => {
                    setText(item.name);
                    setSelectedItem(item);
                }}
                containerStyle={{ padding: 5 }}
                itemsContainerStyle={{ maxHeight: 140 }}
                resetValue={false}
                itemStyle={{
                    padding: 10,
                    marginTop: 2,
                    backgroundColor: '#ddd',
                    borderColor: '#bbb',
                    borderWidth: 1,
                    borderRadius: 5,
                }}
                textInputProps={
                    {
                        placeholder: "Find User",
                        underlineColorAndroid: "transparent",
                        style: {
                            padding: 12,
                            borderWidth: 1,
                            borderColor: '#ccc',
                            borderRadius: 5,
                        },
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
            {authorizationList.length > 0 && 
                <ContactComponent 
                    navigation={navigation} 
                    authorizationList={authorizationList}
                    onRevokeAuthorization={handleRevokeAuthorization}
                />}
            <Button style={styles.button} label="Authorize" onPress={handleAuthorization} />
        
        </View>

    ) : null;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        paddingHorizontal:10,
    },
    button: {
        marginBottom: 10
    },

    buttonText: {
        color: 'white'
    }
})