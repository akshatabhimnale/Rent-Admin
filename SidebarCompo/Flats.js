import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Modal, TouchableOpacity, TextInput, ScrollView,Alert } from 'react-native';

const flatData = [
  { id: 1, name: 'Flat-A', image: require('../assets/images/flats.jpg') },
  { id: 2, name: 'Flat-B', image: require('../assets/images/flats.jpg') },
  { id: 3, name: 'Flat-C', image: require('../assets/images/flats.jpg') },
  { id: 4, name: 'Flat-D', image: require('../assets/images/flats.jpg') },
];

const Flats = ({ navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFlat, setSelectedFlat] = useState(null);
  const [flatName, setFlatName] = useState('');

  const toggleModal = (flat) => {
    setSelectedFlat(flat);
    setIsModalVisible(true);
  };

  const handleSubmit = () => {
    Alert.alert('Flat added successfully');

    console.log('Submitted:', flatName, numberOfFlats)
    setFlatName('');
    setIsModalVisible(false);
  };

  const handleFlatPress = (flat) => {
    navigation.navigate('Flats', { flat });
  };

  const renderFlats = () => {
    return (
      <View style={styles.buildingsContainer}>
        {flatData.map((flat) => (
          <TouchableOpacity
            key={flat.id}
            style={styles.buildingItem}
            onPress={() => handleFlatPress(flat)}
          >
            <Image source={flat.image} style={styles.buildingImage} />
            <Text style={styles.buildingName}>{flat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Total Flats  </Text>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {renderFlats()}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}> Add Flat</Text>
            <TextInput
              style={styles.input}
              placeholder="Name of Flat"
              value={flatName}
              onChangeText={(text) => setFlatName(text)}
              editable={true}
            />
            
           
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>ADD</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.closeButtonText}>CLOSE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
        <Text style={styles.addButtonText}>Add Flat</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Flats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 30,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollView: {
    width: '100%',
    paddingHorizontal: 20,
  },
  buildingsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  buildingItem: {
    width: '48%',
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
  },
  buildingImage: {
    width: '90%',
    height: 120,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 10,
  },
  buildingName: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    marginBottom: 20,
    minHeight: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
