import React, { useEffect, useState, useCallback } from 'react';
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat'
import { renderMessageText } from '../components/Screens/ChatComponent';

export default function MessageScreen({navigation}){
    const [messages, setMessages] = useState([])

    useEffect(() => {
        setMessages([
            {
              _id: 1,
              text: 'Hello developer',
              createdAt: new Date(),
              user: {
                _id: 2,
                name: 'React Native',
                avatar: 'https://placeimg.com/140/140/any',
              },
            },
          ])
    },[])
    

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, messages),
        )
    }, [])

    return (
        <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: 1,
                }}
                showUserAvatar
                renderMessageText={renderMessageText}

            />
        
        
    )
      
}