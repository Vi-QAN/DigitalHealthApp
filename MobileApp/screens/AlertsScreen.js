import React, {useState} from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const alertsData = [
    { id: '1', message: 'Alert 1' },
    { id: '2', message: 'Alert 2' },
    { id: '3', message: 'Alert 3' },
    // Add more alerts as needed
  ];

export const AlertComponent = ({ message, onClose }) => {
    return (
      <View style={styles.alertContainer}>
        <View style={styles.iconContainer}>
          <Icon name="exclamation" size={30} color="#fff" />
        </View>
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>x</Text>
        </TouchableOpacity>
      </View>
    );
  };

export default function AlertsScreen({navigation}) {
    const [alerts, setAlerts] = useState(alertsData);

    const handleAlertClose = (id) => {
        setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
      };

    return (
        <View style={styles.container}>
            <FlatList
                data={alerts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <AlertComponent message={item.message} onClose={() => handleAlertClose(item.id)} />
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    alertContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f44336', // Background color
      borderRadius: 5, // Border radius
      borderWidth: 1, // Border width
      borderColor: '#d32f2f', // Border color
      padding: 10,
      margin: 10,
    },
    iconContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    messageContainer: {
      flex: 6,
    },
    messageText: {
      color: '#fff',
      fontSize: 16,
    },
    closeButton: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButtonText: {
      color: '#fff',
      fontSize: 20,
    },
  });
