import { useEffect, createContext, useState, useContext, useRef } from "react";
import { AuthConsumer } from './useAuth';
import { ChartDataConsumer } from "./useChartData";
import { getMessageHistory,promptDetection } from "../utils/fileHandler";

const OpenAIContext = createContext();

const useOpenAIContext = () => {
    const [ hasNewMessage, setHasNewMessage ] = useState(true);
    const messageHistory = useRef([]);
    const { sampleData } = ChartDataConsumer();
    const { user } = AuthConsumer();
    
    const mapData = (res) => {
        return res.map(item => {return {
               
            _id: item.messageId,
            text: item.messageContent,
            createdAt: new Date(item.createdDate),
            user: {
                _id: item.from === 'Assistant' ? 1337 : user.userId,
                name: item.from === 'Assistant' ? item.from : user.name,
                avatar: 'https://www.pngitem.com/pimgs/m/122-1223088_one-bot-discord-avatar-hd-png-download.png'
            }
            
        }})
    }
    const loadChatHistory = async () => {
        const res = await getMessageHistory(user.userId);
        
        if (res.length > 0){
            messageHistory.current = mapData(res)
        }
    }

    const checkAlert = (dataPoint) => {
        let result = [];
        if (dataPoint.blood_pressure < 80 || dataPoint.blood_pressure > 100){
            result = [...result, 
                {type: "blood pressure", 
                isLower: dataPoint.blood_pressure < 80,
                isGreater: dataPoint.blood_pressure > 100,
                value: dataPoint.blood_pressure
            }]
        }

        if (dataPoint.oxygen_level < 90 || dataPoint.oxygen_level > 100){
            result = [...result, 
                {type: "oxygen level", 
                isLower: dataPoint.oxygen_level < 90,
                isGreater: dataPoint.oxygen_level > 100,
                value: dataPoint.oxygen_level
            }]
        }

        if (dataPoint.heart_rate < 60 || dataPoint.heart_rate > 100){
            result = [...result, 
                {type: "heart rate", 
                isLower: dataPoint.heart_rate < 60,
                isGreater: dataPoint.heart_rate > 100,
                value: dataPoint.heart_rate
            }]
        }

        return result;
    }

    const triggerAlert = async () => {
        if (!sampleData.current) return;
        const data = sampleData.current;
        const dataPoint = data[data.length - 1];
        const alertResults = checkAlert(dataPoint);
        if (alertResults.length === 0 || process.env.EXPO_PUBLIC_PERSONAL_ASSISTANT_MODE === "OFF") return;
        const requests = alertResults.map(item => {
            const isGreaterThanNormal = item.isGreater;
            return {
                field: item.type,
                value:  item.value,
                isGreaterThanNormal: isGreaterThanNormal    
            }
        })
        
        const res = await promptDetection(requests, user.userId);
        if (res.length > 0){
            const newMessages = mapData(res);
            messageHistory.current = [ ...newMessages, ...messageHistory.current, ];
            setHasNewMessage(true);
        }
    }

    useEffect(() => {
        if (user.userId === 0) return;
        loadChatHistory();
        const intervalId = setInterval(triggerAlert, 60000);

        return () => {
            clearInterval(intervalId);
            console.log("unmounted");
        }
    },[user])

    return {
        messageHistory,
        hasNewMessage,
        setHasNewMessage
    }
        
}

const OpenAIProvider = ({children}) => {
    const context = useOpenAIContext();
    return <OpenAIContext.Provider value={context}>{children}</OpenAIContext.Provider>;
}

const OpenAIConsumer = () => {
    return useContext(OpenAIContext);
}

export { OpenAIProvider, OpenAIConsumer}

