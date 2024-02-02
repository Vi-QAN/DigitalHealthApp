import React, {useState} from 'react';
import { View, Text, StyleSheet, Image, TextInput } from 'react-native';
import { Avatar } from 'react-native-elements'; // Import the Avatar component

const DetailScreen = () => {

  const patient = {
    name: "test",
    age: "30",
    gender: "male",
    medicalHistory: "blood pressure",
    avatarUrl: "https://www.istockphoto.com/photo/water-curved-wave-gm177029502-19823907"
  }

  const [editedPatient, setEditedPatient] = useState(patient);

  const handleNameChange = (text) => {
    setEditedPatient({ ...editedPatient, name: text });
  };

  const handleAgeChange = (text) => {
    setEditedPatient({ ...editedPatient, age: text });
  };

  const handleGenderChange = (text) => {
    setEditedPatient({ ...editedPatient, gender: text });
  };

  const handleMedicalHistoryChange = (text) => {
    setEditedPatient({ ...editedPatient, medicalHistory: text });
  };
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: editedPatient.avatarUrl }} // Replace with the patient's avatar URL
          style={styles.avatar}
        />
      </View>
      <Text style={styles.title}>Patient Details</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Name</Text>
        <TextInput
          style={styles.input}
          value={editedPatient.name}
          onChangeText={handleNameChange}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Age</Text>
        <TextInput
          style={styles.input}
          value={editedPatient.age}
          onChangeText={handleAgeChange}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Gender</Text>
        <TextInput
          style={styles.input}
          value={editedPatient.gender}
          onChangeText={handleGenderChange}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Medical History</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={editedPatient.medicalHistory}
          onChangeText={handleMedicalHistoryChange}
          multiline
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 5
  },
  input: {
    fontSize: 18,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    borderColor: '#130f55',
    color: '#130f55', // Text color
  },
  multilineInput: {
    height: 100,
  },
});


export default DetailScreen;
