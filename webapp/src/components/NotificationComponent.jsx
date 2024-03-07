import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { FaRegCalendarAlt } from "react-icons/fa";
import { Avatar } from '@mui/material';
import { getNotifications } from '../utils/fileHandler';
import { AuthConsumer } from '../hooks/useAuth';

const renderNotification = (item, index) => {

    return (
        <Container fluid key={index} className="d-flex shadow flex-row py-5 mb-3 align-items-center rounded" style={{ height: '50px'}}>
            <div className="mx-3 rounded-circle"
                style={{
                    backgroundColor: item.isRead ? 'white' : 'orange', 
                    width: '14px',
                    height: '11px',
                    }}> 
            </div>
            <Avatar className="shadow m-3"  alt="Travis Howard" src={item.imageUri} />
            <p className="message mb-0 ms-3">
                <span className='span-message'>{item.name} </span> {` ${item.message} `} <span className="span-message">{item.fileName} </span>
            </p>
                
            <p className="message-time mb-0">  {new Date(item.createdDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                </p>    
        </Container>    
    )
}

export default function Notification() {
    const [ notificationList, setNotificationList ] = useState(null);
    const [ unreadCount, setUnreadCount ] = useState(null);
    const { user } = AuthConsumer();
    
    const MessageMapping = {
        "Upload" : "uploaded a file",
        "Open" : "opened a file",
        "Remove" : "removed a file"
    }

    const loadData = async () => {
        const result = await getNotifications(user.userId);
        const list = result.map((item) => {
            return {
                id: item.id,
                name: item.accessorName,
                fileName: `${item.fileName}.${item.fileExtension}`,
                imageUri: 'https://images.unsplash.com/photo-1707655096648-1655344fc4d5?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                message: MessageMapping[item.actionName],
                isRead: item.isRead,
                createdDate: item.createdDate
            }
        })
        const count = list.filter(item => !item.isRead).length;

        setNotificationList(list);
        setUnreadCount(count)
    }

    useEffect(() => {
        loadData();
    }, [])

    return notificationList && (
        <Container fluid style={{padding: 0, height: '100%', margin: 0}}>
            <Container fluid className='theme' style={{ height: '50px', fontWeight: '500', fontSize: '25px'}}  >
                {`Notification (${unreadCount})`}
            </Container>
            <Container fluid className="d-flex flex-row justify-content-end my-3" >
                <Container className="d-flex align-self-end shadow px-2 justify-content-between align-items-center rounded-4 " style={{width: '30%', height: '40px'}}>
                    {new Date().toLocaleDateString()}
                    <FaRegCalendarAlt />
                </Container>
            </Container>
            <Container fluid className='theme' style={{ height: '50px', fontWeight: '500', fontSize: '18px'}}>
                Today
            </Container>
            <Container fluid style={{maxHeight: '500px', overflowY: 'scroll'}}>
                {
                    notificationList.map((item, index) => {
                        return renderNotification(item, index);
                    })
                }
            </Container>
            {/* <Container fluid className='theme' style={{ height: '50px', fontWeight: '500', fontSize: '18px'}}>
                Yesterday
            </Container>
            <Container fluid>
                {
                    notificationList.map((item, index) => {
                        return renderNotification(item, index);
                    })
                }
            </Container> */}
            <Container>

            </Container>

            
        </Container>
    )
}