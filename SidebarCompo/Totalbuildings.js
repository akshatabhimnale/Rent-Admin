import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, Modal, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';

const Totalbuildings = ({ navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [societyName, setSocietyName] = useState('');
  const [numberOfWings, setNumberOfWings] = useState('');
  const [societyAddress, setSocietyAddress] = useState('');
  const [buildingsData, setBuildingsData] = useState([]);

  useEffect(() => {
    fetch('https://stock-management-system-server-6mja.onrender.com/api/societies')
      .then((response) => response.json())
      .then((data) => setBuildingsData(data))
      .catch((error) => console.error('Error fetching societies:', error));
  }, []);

  const toggleModal = (building) => {
    setSelectedBuilding(building);
    setSocietyName(building ? building.name : '');
    setIsModalVisible(true);
  };

  const handleSubmit = () => {
    const newSociety = {
      name: societyName,
      numberOfWings,
      address: societyAddress,
    };

    fetch('https://stock-management-system-server-6mja.onrender.com/api/societies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newSociety),
    })
      .then((response) => response.json())
      .then((data) => {
        Alert.alert('Society added successfully');
        setBuildingsData([...buildingsData, data]);
        setSocietyName('');
        setNumberOfWings('');
        setSocietyAddress('');
        setIsModalVisible(false);
      })
      .catch((error) => console.error('Error adding society:', error));
  };

  const handleBuildingPress = (building) => {
    navigation.navigate('Wings', { societyId: building._id });
  };

  const renderBuildings = () => {
    return (
      <View style={styles.buildingsContainer}>
        {buildingsData.map((building) => (
          <TouchableOpacity
            key={building._id}
            style={styles.buildingItem}
            onPress={() => handleBuildingPress(building)}
          >
            <Image source={require('../assets/images/building.png')} style={styles.buildingImage} />
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

      <TouchableOpacity style={styles.addButton} onPress={() => toggleModal(null)}>
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
