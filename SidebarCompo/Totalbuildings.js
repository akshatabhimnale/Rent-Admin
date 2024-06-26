import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';

const buildingsData = [
  { id: 1, name: 'Fair Field Society', image: require('../assets/images/building.png'), flats: [{ id: 1, number: 'A-101', type: '2BHK', area: 1200 }, { id: 2, number: 'A-102', type: '3BHK', area: 1500 }] },
  { id: 2, name: 'Green View Apartments', image: require('../assets/images/building.png'), flats: [{ id: 1, number: 'B-201', type: '2BHK', area: 1100 }, { id: 2, number: 'B-202', type: '3BHK', area: 1400 }] },
  { id: 3, name: 'Sunset Towers', image: require('../assets/images/building.png'), flats: [{ id: 1, number: 'C-301', type: '2BHK', area: 1000 }, { id: 2, number: 'C-302', type: '3BHK', area: 1300 }] },
  { id: 4, name: 'Lake View Residency', image: require('../assets/images/building.png'), flats: [{ id: 1, number: 'D-401', type: '2BHK', area: 1200 }, { id: 2, number: 'D-402', type: '3BHK', area: 1600 }] },
];

const Totalbuildings = ({ navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [societyName, setSocietyName] = useState('');
  const [numberOfWings, setNumberOfWings] = useState('');
  const [societyAddress, setSocietyAddress] = useState('');

  const toggleModal = (building) => {
    setSelectedBuilding(building);
    setSocietyName(building.name);  // Pre-fill society name
    setIsModalVisible(true);
  };

  const handleSubmit = () => {
    Alert.alert('Society added successfully');
    console.log('Submitted:', societyName, numberOfWings, societyAddress);
    setSocietyName('');
    setNumberOfWings('');
    setSocietyAddress('');
    setIsModalVisible(false);
  };

  const handleBuildingPress = (building) => {
    navigation.navigate('Wings', { building });
  };

  const renderBuildings = () => {
    return (
      <View style={styles.buildingsContainer}>
        {buildingsData.map((building) => (
          <TouchableOpacity
            key={building.id}
            style={styles.buildingItem}
            onPress={() => handleBuildingPress(building)}
          >
            <Image source={building.image} style={styles.buildingImage} />
            <Text style={styles.buildingName}>{building.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Total Societies</Text>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {renderBuildings()}
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
            <Text style={styles.modalTitle}>Add Society</Text>
            <TextInput
              style={styles.input}
              placeholder="Name of Society"
              value={societyName}
              onChangeText={(text) => setSocietyName(text)}
              editable={true}
            />
            <TextInput
              style={styles.input}
              placeholder="Number of Wings"
              value={numberOfWings}
              onChangeText={(text) => setNumberOfWings(text)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Address of Society"
              value={societyAddress}
              onChangeText={(text) => setSocietyAddress(text)}
              multiline={true}
              numberOfLines={3}
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
        <Text style={styles.addButtonText}>Add Society</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Totalbuildings;

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
