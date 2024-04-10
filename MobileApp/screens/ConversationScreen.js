
import { StyleSheet, SafeAreaView, TouchableOpacity, View, Text} from 'react-native';

import ContactComponent from '../components/Screens/ContactComponent';

import SearchableDropdown from 'react-native-searchable-dropdown';

import { authorizeRequest, revokeAuthorizationRequest} from '../utils/fileHandler';
import { useEffect, useState } from 'react';
import { authorizeAccessor, revokeAccessor } from '../utils/web3Helper';
import { useContractWrite } from 'wagmi';

import DigitalHealthContract from '../contracts/DigitalHealth.json';
import { AuthConsumer } from '../hooks/useAuth';
import { DefaultColors, DefaultShadow } from '../constants/styles';

import AntDesign from 'react-native-vector-icons/AntDesign';
import { DataConsumer } from '../hooks/useData';

import InfoDialog from '../components/Common/InfoDialog';

const abi = DigitalHealthContract['abi']

export default function ConversationScreen({navigation}){
    const { originalUserList, originalAuthorizationList, setOriginalAuthorizationList } = DataConsumer();
    const [ dropdownData, setDropdownData ] = useState(null);
    const [ selectedItem, setSelectedItem ] = useState(null);
    const [ text, setText ] = useState('');
    const { data, writeAsync, error, isError } = useContractWrite({
        abi,
        address: process.env.EXPO_PUBLIC_CONTRACT_ADDRESS,
        functionName: 'signup',
    });
    const [ infoDialog, setInfoDialog ] = useState({state: 'success', message: 'Authorize successfully', visible: false, onload: false});

    const { user } = AuthConsumer();

    const load = async () => {
        
        const customList = originalUserList.filter(item => item.userId !== user.userId).map((item) => {
            return { id: item.userId, name: item.name }
        })
        setDropdownData(customList);
    }

    const handleAuthorization = async () => {
        if (!selectedItem) return;
        setInfoDialog((data) => {{return {...data, visible: true, onload: true}}})        
        const accessorInfo = originalUserList.find((item) => item.userId === selectedItem.id);
        const authorizeAccessorObject = authorizeAccessor({accessor: accessorInfo.key, password: '123', owner: user.key});
        try {
            await writeAsync(authorizeAccessorObject);
            const result = await authorizeRequest({ownerId: user.key, accessorId: accessorInfo.key});
            // ${error.message}
            if (isError || !result){
                setInfoDialog({ state: 'error', message: `Error while authorizing ${accessorInfo.name}`, visible: true, onload: false});
            } else {
                setInfoDialog({ state: 'success', message: `Authorize ${accessorInfo.name} successfully`, visible: true, onload: false});
            }
            setOriginalAuthorizationList([...originalAuthorizationList, { 
                ...result, 
                name: result.name,
                avatarUri: 'https://images.unsplash.com/photo-1707655096648-1655344fc4d5?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' 
            }]);
        } catch(err) {
            console.log(err);
        }
    }

    const handleRevokeAuthorization = async (accessor) => {
        if (!accessor) return;
        setInfoDialog((data) => {{return {...data, visible: true, onload: true}}})        
        const revokeAuthorizationObject = revokeAccessor({accessor: accessor.accessorKey, password: '123', owner: user.key})
        try {
            await writeAsync(revokeAuthorizationObject);
            // ${error.message}
            if (isError){
                setInfoDialog({ state: 'error', message: `Error while revoking authorization of ${accessor.name}`, visible: true, onload: false});
            } else {
                setInfoDialog({ state: 'success',message: `Revoke authorization of ${accessor.name} successfully`, visible: true, onload: false});

            }

            await revokeAuthorizationRequest({ownerId: user.key, accessorId: accessor.accessorKey});
            const list = originalAuthorizationList.filter((item) => item.accessorId !== accessor.accessorId);
            setOriginalAuthorizationList(list);
        } catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (!originalUserList || !originalAuthorizationList) return;
        load();
    },[originalUserList, originalAuthorizationList])

    return dropdownData ? (
        <SafeAreaView style={styles.container}>
            <SearchableDropdown 
                items={dropdownData}
                onItemSelect={(item) => {
                    setText(item.name);
                    setSelectedItem(item);
                }}
                containerStyle={{ padding: 5, marginHorizontal: 10, ...DefaultShadow, backgroundColor: 'white' }}
                itemsContainerStyle={{ maxHeight: 140 }}
                resetValue={false}
                itemStyle={{
                    padding: 10,
                    marginTop: 2,
                    backgroundColor: 'white',
                    borderColor: DefaultColors.whiteNavy,
                    borderWidth: 1,
                    borderRadius: 5,
                }}
                textInputProps={
                    {
                        placeholder: "Authorize an user",
                        underlineColorAndroid: "transparent",
                        style: {
                            padding: 12,
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
            <Text style={{marginTop: 10, marginLeft: 10, opacity: 0.9, fontWeight: 500, ...DefaultShadow}}>
                Authorized users
            </Text>
            {originalAuthorizationList.length > 0 && 
                <ContactComponent 
                    navigation={navigation} 
                    authorizationList={originalAuthorizationList}
                    onRevokeAuthorization={handleRevokeAuthorization}
                />}
            {text.length !== 0 && <TouchableOpacity style={styles.button}onPress={handleAuthorization} >
                <View style={{justifyContent: 'center', flex: 1, alignItems: 'center'}}>
                    <AntDesign name={'check'} size={20} color={'white'} />
                </View>
            </TouchableOpacity>}
            <InfoDialog infoDialog={infoDialog} setInfoDialog={setInfoDialog}/>

        </SafeAreaView>

    ) : null;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        paddingHorizontal:10,
        backgroundColor: "white"
    },
    button: {
        marginBottom: 10,
        width: 55,
        height: 55,
        backgroundColor: DefaultColors.navy,
        position: 'absolute',
        bottom: 3,
        right: 10,
        ...DefaultShadow,
        borderRadius: '50%',

    },

    buttonText: {
        color: 'white'
    }
})