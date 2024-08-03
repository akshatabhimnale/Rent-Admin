import { StyleSheet, Text, View, Button, Modal, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

const AddPays = () => {
  const [rentAmount, setRentAmount] = useState(null)
  const [maintenanceAmount, setMaintenanceAmount] = useState(null)
  const [lightBillAmount, setLightBillAmount] = useState(null)

  const [modalVisible, setModalVisible] = useState(false)
  const [currentType, setCurrentType] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [viewModalVisible, setViewModalVisible] = useState(false)

  const openModal = (type) => {
    setCurrentType(type)
    setInputValue('')
    setModalVisible(true)
  }

  const handleSave = () => {
    switch (currentType) {
      case 'Rent':
        setRentAmount(inputValue)
        break
      case 'Maintenance':
        setMaintenanceAmount(inputValue)
        break
      case 'Light Bill':
        setLightBillAmount(inputValue)
        break
    }
    setModalVisible(false)
  }

  const openViewModal = () => {
    setViewModalVisible(true)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Payment Amounts</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => openModal('Rent')}>
          <Text style={styles.buttonText}>Rent Amount</Text>
        </TouchableOpacity>
        {/* {rentAmount && <Text style={styles.amountText}>Rent Amount: {rentAmount}</Text>} */}
        <TouchableOpacity style={styles.button} onPress={() => openModal('Maintenance')}>
          <Text style={styles.buttonText}>Maintenance Amount</Text>
        </TouchableOpacity>
        {/* {maintenanceAmount && <Text style={styles.amountText}>Maintenance Amount: {maintenanceAmount}</Text>} */}
        <TouchableOpacity style={styles.button} onPress={() => openModal('Light Bill')}>
          <Text style={styles.buttonText}>Light Bill Amount</Text>
        </TouchableOpacity>
        {/* {lightBillAmount && <Text style={styles.amountText}>Light Bill Amount: {lightBillAmount}</Text>} */}
      </View>
      
      <TouchableOpacity style={[styles.button, styles.viewButton]} onPress={openViewModal}>
        <Text style={styles.buttonText}>View</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Enter {currentType} Amount</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={inputValue}
              onChangeText={setInputValue}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        animationType="slide"
        visible={viewModalVisible}
        onRequestClose={() => setViewModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Payment Amounts</Text>
            <Text style={styles.amountText}>Rent Amount: {rentAmount}</Text>
            <Text style={styles.amountText}>Maintenance Amount: {maintenanceAmount}</Text>
            <Text style={styles.amountText}>Light Bill Amount: {lightBillAmount}</Text>
            <TouchableOpacity
              style={[styles.modalButton, styles.closeButton]}
              onPress={() => setViewModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default AddPays

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    position: 'absolute',
    top: 50, // Adjust this value to position the heading correctly
    width: '100%',
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    width: '80%',
  },
  viewButton: {
    backgroundColor: '#28a745',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  amountText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'left',
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
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalHeading: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
  closeButton: {
    backgroundColor: '#dc3545',
    marginTop: 20,
    width: '100%',
  },
  buttonText: {
    color: 'white',
  },
});
