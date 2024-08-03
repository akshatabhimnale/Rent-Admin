import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const flatTypes = ["1R", "1RK", "1BHK", "2BHK", "3BHK"];

const Expenses = () => {
  const [selectedButton, setSelectedButton] = useState('Rent');
  const [societies, setSocieties] = useState([]);
  const [selectedSociety, setSelectedSociety] = useState('');
  const [selectedFlatType, setSelectedFlatType] = useState('');
  const [amount, setAmount] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fetchedAmount, setFetchedAmount] = useState(null);

  useEffect(() => {
    fetch('https://stock-management-system-server-6mja.onrender.com/api/societies')
      .then(response => response.json())
      .then(data => {
        setSocieties(data);
      })
      .catch(error => {
        console.error('Error fetching societies:', error);
      });
  }, []);

  const handleButtonClick = (button) => {
    setSelectedButton(button);
    setSelectedSociety('');
    setSelectedFlatType('');
    setFetchedAmount(null);
  };

  const handleOpenModal = () => {
    if (selectedSociety && selectedFlatType) {
      setIsModalVisible(true);
    } else {
      Alert.alert("Please select both society and flat type before updating.");
    }
  };

  const handleUpdateAmount = () => {
    let url;
    let payload;

    if (selectedButton === 'Rent') {
      url = 'https://stock-management-system-server-6mja.onrender.com/api/payments/rent';
      payload = {
        society: selectedSociety,
        flatType: selectedFlatType,
        ramount: amount,
      };
    } else if (selectedButton === 'Maintenance') {
      url = 'https://stock-management-system-server-6mja.onrender.com/api/payments/maintenance';
      payload = {
        society: selectedSociety,
        flatType: selectedFlatType,
        mamount: amount,
      };
    }

    console.log('Payload:', payload);

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        console.log(`${selectedButton} updated:`, data);
        Alert.alert(`${selectedButton} amount updated successfully.`);
        setIsModalVisible(false);
        setAmount('');
      })
      .catch(error => {
        console.error(`Error updating ${selectedButton}:`, error);
        Alert.alert(`Error updating ${selectedButton} amount. Please try again.`);
      });
  };

  const handleViewAmount = () => {
    if (!selectedSociety || !selectedFlatType) {
      Alert.alert("Please select both society and flat type before viewing the amount.");
      return;
    }

    const endpoint = selectedButton === 'Rent' ? 'rent' : 'maintenance';

    fetch(`https://stock-management-system-server-6mja.onrender.com/api/payments/${endpoint}/${selectedSociety}/${selectedFlatType}`)
      .then(response => response.json())
      .then(data => {
        console.log(`${selectedButton} details:`, data);
        setFetchedAmount(data.amount || "No amount found");
      })
      .catch(error => {
        console.error(`Error fetching ${selectedButton} details:`, error);
        Alert.alert(`Error fetching ${selectedButton} details. Please try again.`);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Update Payments</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            selectedButton === 'Rent' && styles.selectedButton,
          ]}
          onPress={() => handleButtonClick('Rent')}
        >
          <Text style={styles.buttonText}>Rent</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            selectedButton === 'Maintenance' && styles.selectedButton,
          ]}
          onPress={() => handleButtonClick('Maintenance')}
        >
          <Text style={styles.buttonText}>Maintenance</Text>
        </TouchableOpacity>
      </View>
      {selectedButton && (
        <ScrollView style={styles.dropdownContainer}>
          <View style={styles.pickerContainer}>
            <Text>Select Society:</Text>
            <Picker
              selectedValue={selectedSociety}
              onValueChange={(itemValue) => setSelectedSociety(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select a society" value="" />
              {societies.map(society => (
                <Picker.Item
                  key={society._id}
                  label={society.name}
                  value={society._id}
                />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerContainer}>
            <Text>Select Flat Type:</Text>
            <Picker
              selectedValue={selectedFlatType}
              onValueChange={(itemValue) => setSelectedFlatType(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select a flat type" value="" />
              {flatTypes.map(type => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
          </View>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleOpenModal}
          >
            <Text style={styles.buttonText}>Update {selectedButton} Amount</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleViewAmount}
          >
            <Text style={styles.buttonText}>View {selectedButton} Amount</Text>
          </TouchableOpacity>
          {fetchedAmount !== null && (
            <Text style={styles.amountText}>
              Current {selectedButton} Amount: {fetchedAmount}
            </Text>
          )}
        </ScrollView>
      )}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>
              {`Update ${selectedButton} Amount`}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={`Enter ${selectedButton} Amount`}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleUpdateAmount}
              >
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    padding: 6,
    marginHorizontal: 5,
    backgroundColor: '#6699CC',
    alignItems: 'center',
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: '#4477AA',
  },
  buttonText: {
    marginTop: 5,
    marginBottom: 5,
    color: '#fff',
    fontSize: 16,
  },
  dropdownContainer: {
    paddingVertical: 10,
  },
  pickerContainer: {
    marginBottom: 20,
  },
  picker: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  updateButton: {
    padding: 10,
    backgroundColor: '#6699CC',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  amountText: {
    marginTop: 10,
    fontSize: 18,
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
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#6699CC',
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#FF6347',
  },
});

export default Expenses;

