import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import ChartComponent from '../components/Screens/HomeScreen/ChartComponent';
import InfoSection from '../components/Screens/HomeScreen/InfoSection';
import { ChartDataConsumer } from '../hooks/useChartData';
import { DefaultColors, DefaultShadow } from '../constants/styles';
import { Modal, Avatar } from 'react-native-ui-lib';
import { GiftedChat } from 'react-native-gifted-chat';
import { OpenAIConsumer } from '../hooks/useOpenAI';
import { AuthConsumer } from '../hooks/useAuth';
import { promptMessage } from '../utils/fileHandler';


function AssistantModal({isVisible, setIsVisible}){
    const { messageHistory } = OpenAIConsumer();
    const { user } = AuthConsumer();

    const onSend = async (newMessages) => {
        messageHistory.current = GiftedChat.append(messageHistory.current, newMessages);
        const userMessage = newMessages[0].text;

        const result = await promptMessage(user.userId, userMessage);
        console.log(result);
        const botMessage = {
            _id: result.messageId,
            text: result.messageContent,
            createdAt: new Date(result.createdDate),
            user: {
                _id: 1337,
                name: 'Assistant',
                avatar: 'https://www.pngitem.com/pimgs/m/122-1223088_one-bot-discord-avatar-hd-png-download.png'
            }
        }
        messageHistory.current = GiftedChat.append(messageHistory.current, botMessage);
    }

    useEffect(() => {
        
    },[messageHistory.current]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={() => {
                setIsVisible(!isVisible);
            }}
            >
                <View style={styles.modalContainer}>
                    <Modal.TopBar
                        onCancel={() => setIsVisible(false)}
                        cancelIcon={null}
                        cancelLabel="Back"
                        doneLabel='Add'
                        cancelButtonProps={{
                            labelStyle: {color: DefaultColors.navy}
                        }}
                        doneButtonProps={{
                            labelStyle: {color: DefaultColors.navy}
                        }}
                        containerStyle={{ width: '100%', borderRadius: 5, ...DefaultShadow,}}
                    />
                    <GiftedChat
                        messages={messageHistory.current}
                        onSend={newMessages => onSend(newMessages)}
                        user={{
                            _id: user.userId,
                        }}
                    />
                </View>

            
        </Modal>
    )
}

export default function HomeScreen({navigation}) {
    const { hasNewMessage, setHasNewMessage } = OpenAIConsumer();
    const { handleChangeFilter, filterMode } = ChartDataConsumer();
    const [ isVisible, setIsVisible ] = useState(false);

    useEffect(() => {

    },[hasNewMessage])

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                
                <InfoSection />
                
                <ScrollView style={{paddingVertical: 10}}  horizontal showsHorizontalScrollIndicator={false}>
                    {['Daily', 'Weekly','Monthly','Yearly'].map((item,index) => 
                        <TouchableOpacity key={index} 
                            style={{
                                ...styles.filterContainer,
                                backgroundColor: filterMode.current === item ? DefaultColors.navy : DefaultColors.whiteNavy,
                                shadowColor: filterMode.current === item ? DefaultColors.navy : DefaultColors.lighterNavy
                            }} 
                            onPress={() => handleChangeFilter(item)} >
                            <Text style={{
                                color: filterMode.current === item ? 'white' : DefaultColors.navy
                            }}>{item}</Text>    
                        </TouchableOpacity>
                    )}   
                </ScrollView>
                <ChartComponent />
            </ScrollView>
            <Avatar 
                containerStyle={styles.button} 
                source={{
                    uri: 'https://www.pngitem.com/pimgs/m/122-1223088_one-bot-discord-avatar-hd-png-download.png'
                }}
                onPress={() => {setIsVisible(true), setHasNewMessage(false)}} 
                backgroundColor={'white'}
                badgePosition='TOP_RIGHT'
                badgeProps= {{
                    backgroundColor: hasNewMessage ? '#cc0025' : 'transparent',
                    size: 14,

                }}
                />
                {/* <View style={{justifyContent: 'center', flex: 1, alignItems: 'center'}}>
                    <AntDesign name={'addfile'} size={20} color={'white'} />
                </View>
            </Avatar> */}
            <AssistantModal isVisible={isVisible} setIsVisible={setIsVisible}/>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },

    contentContainer: {
        paddingHorizontal: 10

    },

    filterContainer: {
        marginLeft: 5,
        marginRight: 7, 
        marginTop: 20, 
        paddingHorizontal: 20, 
        paddingVertical: 10, 
        backgroundColor: DefaultColors.whiteNavy,
        ...DefaultShadow,
        shadowColor: DefaultColors.lighterNavy,
        shadowRadius: 5,
        borderRadius: '30%', 
    },

    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 20,
        width: '100%',
        backgroundColor: 'white',
        justifyContent: 'space-between'
    },

    modalContainer: {
        height: '90%',
        ...DefaultShadow, 
        shadowRadius: 10,
        borderRadius: 5,
        backgroundColor: 'white',
        marginTop: 20,
    },

    buttonStyle: {
        backgroundColor: 'white',
        paddingVertical: 20,
        width: '48%',
        alignItems: 'center',
        ...DefaultShadow,
        shadowColor: DefaultColors.navy,
        shadowOpacity: 0.5,
        shadowOffset: {
            width: 0,
            height: 1,
        },
    },
    button: {
        marginBottom: 10,
        position: 'absolute',
        bottom: 3,
        right: 10,
    },
});