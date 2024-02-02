
import { View, StyleSheet } from 'react-native';

import ContactComponent from '../components/Screens/ContactComponent';



export default function ConversationScreen({navigation}){


    return (
        <View style={styles.container}>
            
            <ContactComponent navigation={navigation}/>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal:15,
    }
})