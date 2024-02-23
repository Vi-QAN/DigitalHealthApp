import { ScrollView, View, StyleSheet, Text } from "react-native"
import { StepContextConsumer } from "../../../hooks/useStepContext"
import { TextField, Button } from "react-native-ui-lib";

export default function SubmitSection ({navigation}) {
    const { provider, patient, documentList} = StepContextConsumer();

    const handleSendRequest = () => {

    } 

    return (
        <ScrollView>
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Healthcare Provider</Text>
                <TextField 
                    containerStyle={styles.textFieldContainer}
                    label="Name"
                    labelStyle={{fontWeight: '500', marginBottom: 5}}
                    editable={false}
                    value={provider.name}
                />
                <TextField 
                    containerStyle={styles.textFieldContainer}
                    label="Address"
                    labelStyle={{fontWeight: '500', marginBottom: 5}}
                    editable={false}
                    value={provider.address}
                />
            </View>
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Patient Information</Text>
                <TextField 
                    containerStyle={styles.textFieldContainer}
                    label="Name"
                    labelStyle={{fontWeight: '500', marginBottom: 5}}
                    editable={false}
                    value={patient.name}
                />
                <TextField 
                    containerStyle={styles.textFieldContainer}
                    label="Address"
                    labelStyle={{fontWeight: '500', marginBottom: 5}}
                    editable={false}
                    value={patient.address}
                />
                <TextField 
                    containerStyle={styles.textFieldContainer}
                    label="Phone"
                    labelStyle={{fontWeight: '500', marginBottom: 5}}
                    editable={false}
                    value={patient.phone}
                />
            </View>
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Requested Documents</Text>

                { documentList.map((item, index) => {
                    return (
                        <View key={index} style={{
                                width: (item.name.length * 8) + 60,
                                justifyContent: 'center',
                                flex: 0,
                                backgroundColor: '#eee',
                                flexDirection: 'row',
                                alignItems: 'center',
                                margin: 5,
                                padding: 8,
                                borderRadius: 15,
                            }}>
                            <Text style={{ color: '#555' }}>{item.name}</Text>
                        </View>
                        )
                    }) 
                }
            </View>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                <Button 
                    backgroundColor='white' 
                    color='black' 
                    outlineColor='black' 
                    label="Cancel" 
                    onPress={navigation.goBack}
                    style={styles.buttonStyle}

                />
                <Button
                    style={styles.buttonStyle}
                    label="Send" 
                    onPress={handleSendRequest}/>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    inputStyle: {
        paddingHorizontal: 5, 
        paddingVertical: 10, 
        borderBottomColor: 'black', 
        borderBottomWidth: 0.2, 
    },

    textFieldContainer: {
        paddingHorizontal: 5, 
        paddingVertical: 10, 
        borderBottomColor: 'black', 
        borderBottomWidth: 0.2, 
        width: '100%'
    },

    buttonStyle: {
        width: '45%',
    },

    sectionContainer: {
        width: '100%',
        marginBottom: 20,
    },

    sectionTitle: {
        paddingHorizontal: 5,
        fontSize: 20,
        fontWeight: '500',
        marginBottom: 10
    }
})