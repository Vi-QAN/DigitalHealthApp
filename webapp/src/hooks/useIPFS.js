import { useContext, createContext, useEffect, useState} from 'react';
import { create } from 'ipfs-http-client'

const IPFSContext = createContext();


const useIPFSContext = () => {
    const [ ipfs, setIPFS] = useState(null);

    const setupIPFS = async () => {
        try {
            const http = create('/ip4/127.0.0.1/tcp/5001')
            const isOnline = await http.isOnline()
        
            if (isOnline) {
                setIPFS(http);
            }
        }
        catch(err) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        setupIPFS();
    },[])

    return {
        ipfs
    }
}

const IPFSProvider = ({children}) => {
    const value = useIPFSContext();

    return <IPFSContext.Provider value={value}>{children}</IPFSContext.Provider>;
}

const IPFSConsumer = () => {
    return useContext(IPFSContext);
}

export { IPFSProvider, IPFSConsumer}





