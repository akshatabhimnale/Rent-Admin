import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Button,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Userdetails() {
  const [modalVisible, setModalVisible] = useState(false);
  const [addUserModalVisible, setAddUserModalVisible] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    ph_no: "",
    emailId: "",
    age: "",
    maintaince: "",
    final_rent: "",
    deposit: "",
    current_meter_reading: "",
    rent_form_date: new Date(),
    permanant_address: "",
    previous_address: "",
    nature_of_work: "",
    working_address: "",
    work_ph_no: "",
    family_members: "",
    male_members: "",
    female_members: "",
    childs: "",
    family_member_names: "",
    reference_person1: "",
    reference_person2: "",
    reference_person1_age: "",
    reference_person2_age: "",
    agent_name: "",
    adharPhotoUri: "",
    rent_status: "Active",
  });
  const [userList, setUserList] = useState([
    {
      name: "Rashmi Kulkarni",
      status: "Active",
      date: new Date().toLocaleDateString(),
    },
  ]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddUser = () => {
    setUserDetails({
      name: "",
      ph_no: "",
      emailId: "",
      age: "",
      maintaince: "",
      final_rent: "",
      deposit: "",
      current_meter_reading: "",
      rent_form_date: new Date(),
      permanant_address: "",
      previous_address: "",
      nature_of_work: "",
      working_address: "",
      work_ph_no: "",
      family_members: "",
      male_members: "",
      female_members: "",
      childs: "",
      family_member_names: "",
      reference_person1: "",
      reference_person2: "",
      reference_person1_age: "",
      reference_person2_age: "",
      agent_name: "",
      flat_id: "",
      rent_status: "Active",
    });
    setAddUserModalVisible(true);
  };

  const handleConfirmAddUser = () => {
    const updatedUserList = userList.map((user) => {
      if (user.status === "Active") {
        return { ...user, status: "Deactive" };
      }
      return user;
    });

    setUserList([
      {
        name: userDetails.name,
        status: "Active",
        date: userDetails.rent_form_date.toLocaleDateString(),
      },
      ...updatedUserList,
    ]);

    setUserDetails({
      name: "",
      ph_no: "",
      emailId: "",
      age: "",
      maintaince: "",
      final_rent: "",
      deposit: "",
      current_meter_reading: "",
      rent_form_date: new Date(),
      permanant_address: "",
      previous_address: "",
      nature_of_work: "",
      working_address: "",
      work_ph_no: "",
      family_members: "",
      male_members: "",
      female_members: "",
      childs: "",
      family_member_names: "",
      reference_person1: "",
      reference_person2: "",
      reference_person1_age: "",
      reference_person2_age: "",
      agent_name: "",
      flat_id: "",
      rent_status: "Active",
    });
    setAddUserModalVisible(false);
  };

  const handleUserSelection = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const filteredUserList = userList.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedUserList = [...filteredUserList].sort((a, b) => {
    if (a.status === "Active" && b.status !== "Active") {
      return -1;
    }
    if (a.status !== "Active" && b.status === "Active") {
      return 1;
    }
    return 0;
  });

  const handleChoosePhoto = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setUserDetails((prevState) => ({
        ...prevState,
        adharPhotoUri: pickerResult.assets[0].uri,
      }));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Tenant Details</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tenant..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Start Date</Text>
        <Text style={styles.tableHeaderText}>Name</Text>
        <Text style={styles.tableHeaderText}>Status</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ alignItems: "center" }}
      >
        {sortedUserList.map((user, index) => (
          <TouchableOpacity
            key={index}
            style={styles.tableRow}
            onPress={() => handleUserSelection(user)}
          >
            <Text style={styles.tableCell}>{user.date}</Text>
            <Text style={styles.tableCell}>{user.name}</Text>
            <TouchableOpacity>
              <Text
                style={[
                  styles.tableCell,
                  user.status === "Active" && styles.activeStatus,
                  user.status === "Deactive" && styles.inactiveStatus,
                ]}
              >
                {user.status}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible && selectedUser !== null}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tenant Details</Text>
            {selectedUser && (
              <View style={styles.userDetailContainer}>
                <View style={styles.userDetailRow}>
                  <Text style={styles.boldText}>Name:</Text>
                  <Text style={styles.userDetailText}>{selectedUser.name}</Text>
                </View>
                <View style={styles.userDetailRow}>
                  <Text style={styles.boldText}>Start Date:</Text>
                  <Text style={styles.userDetailText}>{selectedUser.date}</Text>
                </View>
                <View style={styles.userDetailRow}>
                  <Text style={styles.boldText}>Status:</Text>
                  <Text style={styles.userDetailText}>
                    {selectedUser.status}
                  </Text>
                </View>
              </View>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={false} // <-- Set this to false to avoid transparent background
        visible={addUserModalVisible}
        onRequestClose={() => setAddUserModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView
            contentContainerStyle={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.modalTitle}>Add Tenant</Text>
            <View style={styles.formContainer}>
              <View style={styles.formRow}>
                <Text style={styles.label}>Name:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter name"
                  value={userDetails.name}
                  onChangeText={(text) =>
                    setUserDetails((prevState) => ({
                      ...prevState,
                      name: text,
                    }))
                  }
                />
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Phone Number:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter phone number"
                  value={userDetails.ph_no}
                  onChangeText={(text) =>
                    setUserDetails((prevState) => ({
                      ...prevState,
                      ph_no: text,
                    }))
                  }
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Email:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter email"
                  value={userDetails.emailId}
                  onChangeText={(text) =>
                    setUserDetails((prevState) => ({
                      ...prevState,
                      emailId: text,
                    }))
                  }
                  keyboardType="email-address"
                />
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Age:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter age"
                  value={userDetails.age}
                  onChangeText={(text) =>
                    setUserDetails((prevState) => ({ ...prevState, age: text }))
                  }
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Maintenance:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter maintenance amount"
                  value={userDetails.maintaince}
                  onChangeText={(text) =>
                    setUserDetails((prevState) => ({
                      ...prevState,
                      maintaince: text,
                    }))
                  }
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Final Rent:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter final rent amount"
                  value={userDetails.final_rent}
                  onChangeText={(text) =>
                    setUserDetails((prevState) => ({
                      ...prevState,
                      final_rent: text,
                    }))
                  }
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Deposit:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter deposit amount"
                  value={userDetails.deposit}
                  onChangeText={(text) =>
                    setUserDetails((prevState) => ({
                      ...prevState,
                      deposit: text,
                    }))
                  }
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Current Meter Reading:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter current meter reading"
                  value={userDetails.current_meter_reading}
                  onChangeText={(text) =>
                    setUserDetails((prevState) => ({
                      ...prevState,
                      current_meter_reading: text,
                    }))
                  }
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Rent From Date:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter rent from date"
                  value={userDetails.rent_form_date.toLocaleDateString()}
                  onChangeText={(text) =>
                    setUserDetails((prevState) => ({
                      ...prevState,
                      rent_form_date: new Date(text),
                    }))
                  }
                />
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Permanent Address:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter permanent address"
                  value={userDetails.permanant_address}
                  onChangeText={(text) =>
                    setUserDetails((prevState) => ({
                      ...prevState,
                      permanant_address: text,
                    }))
                  }
                  multiline={true}
                  numberOfLines={3}
                />
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Previous Address:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter previous address"
                  value={userDetails.previous_address}
                  onChangeText={(text) =>
                    setUserDetails((prevState) => ({
                      ...prevState,
                      previous_address: text,
                    }))
                  }
                  multiline={true}
                  numberOfLines={3}
                />
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Nature of Work:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter nature of work"
                  value={userDetails.nature_of_work}
                  onChangeText={(text) =>
                    setUserDetails((prevState) => ({
                      ...prevState,
                      nature_of_work: text,
                    }))
                  }
                  multiline={true}
                  numberOfLines={3}
                />
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Working Address:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter working address"
                  value={userDetails.working_address}
                  onChangeText={(text) =>
                    setUserDetails((prevState) => ({
                      ...prevState,
                      working_address: text,
                    }))
                  }
                  multiline={true}
                  numberOfLines={3}
                />
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Work Phone Number:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter work phone number"
                  value={userDetails.work_ph_no}
                  onChangeText={(text) =>
                    setUserDetails((prevState) => ({
                      ...prevState,
                      work_ph_no: text,
                    }))
                  }
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Family Members:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter total family members"
                  value={userDetails.family_members}
                  onChangeText={(text) =>
                    setUserDetails((prevState) => ({
                      ...prevState,
                      family_members: text,
                    }))
                  }
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Male Members:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter male members"
                  value={userDetails.male_members}
                  onChangeText={(text) =>
                    setUserDetails((prevState) => ({
                      ...prevState,
                      male_members: text,
                    }))
                  }
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Female Members:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter female members"
                  value={userDetails.female_members}
                  onChangeText={(text) =>
                    setUserDetails((prevState) => ({
                      ...prevState,
                      female_members: text,
                    }))
                  }
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Children:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter number of children"
                  value={userDetails.childs}
                  onChangeText={(text) =>
                    setUserDetails((prevState) => ({
                      ...prevState,
                      childs: text,
                    }))
                  }
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Family Member Names:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter family member names"
                  value={userDetails.family_member_names}
                  onChangeText={(text) =>
                    setUserDetails((prevState) => ({
                      ...prevState,
                      family_member_names: text,
                    }))
                  }
                  multiline={true}
                  numberOfLines={3}
                />
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Reference Person 1:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter reference person 1"
                  value={userDetails.reference_person1}
                  onChangeText={(text) =>
                    setUserDetails((prevState) => ({
                      ...prevState,
                      reference_person1: text,
                    }))
                  }
                />
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Reference Person 1 Age:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter reference person 1 age"
                  value={userDetails.reference_person1_age}
                  onChangeText={(text) =>
                    setUserDetails((prevState) => ({
                      ...prevState,
                      reference_person1_age: text,
                    }))
                  }
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Reference Person 2:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter reference person 2"
                  value={userDetails.reference_person2}
                  onChangeText={(text) =>
                    setUserDetails((prevState) => ({
                      ...prevState,
                      reference_person2: text,
                    }))
                  }
                />
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Reference Person 2 Age:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter reference person 2 age"
                  value={userDetails.reference_person2_age}
                  onChangeText={(text) =>
                    setUserDetails((prevState) => ({
                      ...prevState,
                      reference_person2_age: text,
                    }))
                  }
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Agent Name:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter agent name"
                  value={userDetails.agent_name}
                  onChangeText={(text) =>
                    setUserDetails((prevState) => ({
                      ...prevState,
                      agent_name: text,
                    }))
                  }
                />
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Adhar Photo:</Text>
                <TouchableOpacity style={styles.uploadButton}>
                  <Button title="Choose Photo" onPress={handleChoosePhoto} />
                </TouchableOpacity>
                {userDetails.adharPhotoUri ? (
                  <Text style={styles.fileName}>
                    {userDetails.adharPhotoUri.split("/").pop()}
                  </Text>
                ) : null}
              </View>

              <TouchableOpacity
                style={styles.addButton}
                onPress={handleConfirmAddUser}
              >
                <Text style={styles.submitButtonText}>ADD</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setAddUserModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>CLOSE</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      <TouchableOpacity style={styles.addButton} onPress={handleAddUser}>
        <Text style={styles.addButtonText}>Add Tenant</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  userDetailContainer: {
    width: "100%",
  },
  userDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  boldText: {
    fontWeight: "bold",
  },
  userDetailText: {
    flex: 1,
    textAlign: "right",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: "#27ae60",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableCell: {
    fontSize: 16,
    flex: 1,
  },
  activeStatus: {
    backgroundColor: "#d4edda", // Light green background color
    color: "#155724", // Dark green text color
    fontWeight: "bold",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    textAlign: "center",
  },
  inactiveStatus: {
    backgroundColor: "#f8d7da", // Light red background color
    color: "#721c24", // Dark red text color
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    textAlign: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333", // Example color
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 5,
  },
  tableHeaderText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: "#FFBF00",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  cancelButton: {
    backgroundColor: "#e74c3c",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 10,
  },
  formRow: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
});
