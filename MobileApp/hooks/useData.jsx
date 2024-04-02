import { useEffect, createContext, useState, useContext } from "react";
import {getUserList, getAuthorizationList, getFileInfoByOwner, getFilesSummaries  } from '../utils/fileHandler';

import { AuthConsumer } from './useAuth';


const DataContext = createContext();

const useDataContext = () => {
    const [ originalAuthorizationList, setOriginalAuthorizationList ] = useState(null);
    const [ originalFileList, setOriginalFileList ] = useState(null);
    const [ originalFilesSummaries, setOriginalFilesSummaries ] = useState(null);
    const [ originalUserList, setOriginalUserList ] = useState(null);
    const { user } = AuthConsumer();

    const loadOriginalAuthorizationList = async () => {
        const list = await getAuthorizationList({userId: user.userId});
        const formatted = list.map(item => {
            return {...item, 
                name: item.name, 
                avatarUri: 'https://images.unsplash.com/photo-1707655096648-1655344fc4d5?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' 
            }})
        console.log(formatted)
        setOriginalAuthorizationList(formatted);
    }

    const loadOriginalUserList = async () => {
        const list = await getUserList();
        setOriginalUserList(list)
    }

    const loadOriginalFileList = async () => {
        const data = await getFileInfoByOwner(user.userId);
        const list = data.map((item) => {
            return {
                ...item,
                selected: false
            }
        })
        setOriginalFileList(list);
    }

    const loadOriginalFilesSummaries = async () => {
        const data = await getFilesSummaries(user.userId);
        setOriginalFilesSummaries(data);
    }

    useEffect(() => {
        if (user.userId === 0) return;
        loadOriginalAuthorizationList();
        loadOriginalFileList();
        loadOriginalFilesSummaries();
        loadOriginalUserList();
    },[user])
    
    return {
        originalAuthorizationList, 
        setOriginalAuthorizationList,
        originalFileList,
        setOriginalFileList,
        originalFilesSummaries,
        setOriginalFilesSummaries,
        originalUserList,
        loadOriginalFileList
    }
}

function DataProvider({children}) {
    const context = useDataContext();
    return <DataContext.Provider value={context}>{children}</DataContext.Provider>;
}

function DataConsumer(){
    return useContext(DataContext);
}

export { DataProvider, DataConsumer }