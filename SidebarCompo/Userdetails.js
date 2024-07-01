import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Userdetails() {
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [userDetails, setUserDetails] = useState({ name: '', status: 'Active', date: new Date() });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userList, setUserList] = useState([
    { name: 'Rashmi Kulkarni', status: 'Active', date: new Date().toLocaleDateString() },
  ]);

  const handleAddUser = () => {
    if (userDetails.name === '') {
      alert('Please enter a name.');
      return;
    }
    setConfirmModalVisible(true);
  };

  const handleConfirmAddUser = () => {
    const updatedUserList = userList.map(user => {
      if (user.status === 'Active') {
        return { ...user, status: 'Deactive' };
      }
      return user;
    });

    setUserList([
      { name: userDetails.name, status: 'Active', date: userDetails.date.toLocaleDateString() },
      ...updatedUserList,
    ]);

    setUserDetails({ name: '', status: 'Active', date: new Date() });
    setModalVisible(false);
    setConfirmModalVisible(false);
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || userDetails.date;
    setShowDatePicker(Platform.OS === 'ios');
    setUserDetails({ ...userDetails, date: currentDate });
  };

  // Sorting function to prioritize active users
  const sortedUserList = [...userList].sort((a, b) => {
    if (a.status === 'Active' && b.status !== 'Active') {
      return -1;
    }
    if (a.status !== 'Active' && b.status === 'Active') {
      return 1;
    }
    return 0;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>User Details</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Start Date</Text>
        <Text style={styles.tableHeaderText}>Name</Text>
        <Text style={styles.tableHeaderText}>Status</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {sortedUserList.map((user, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{user.date}</Text>
            <Text style={styles.tableCell}>{user.name}</Text>
            <Text style={[styles.tableCell, user.status === 'Active' && styles.activeStatus, user.status === 'Deactive' && styles.deactiveStatus]}>
              {user.status}
            </Text>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Add User</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add User</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={userDetails.name}
              onChangeText={(text) => setUserDetails({ ...userDetails, name: text })}
            />
            <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
              <Text>{userDetails.date.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={userDetails.date}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleAddUser}>
                <Text style={styles.modalButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Deactivate Previous User?</Text>
            <Text>Do you want to deactivate the previous active user?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleConfirmAddUser}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setConfirmModalVisible(false)}>
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    marginVertical: 20,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginBottom: 5,
    borderRadius: 5,
  },
  tableCell: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  activeStatus: {
    backgroundColor: '#d4edda',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deactiveStatus: {
    backgroundColor: '#f8d7da',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
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
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    marginRight: 0,
    marginLeft: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButtonText: {
    color: '#fff',
  },
});
