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
  const [aadharBackPhotoUri, setAadharBackPhotoUri] = useState("");
  const [addUserModalVisible, setAddUserModalVisible] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    adharPhotoUri: null,
    tenantPhotoUri: null,
    lightBillPhotoUri: null,
  });
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddUser = () => {
    setUserDetails({
      name: "",
      tenantPhotoUri: "",
    });
    setAddUserModalVisible(true);
  };

  const handleConfirmAddUser = async () => {
    // const updatedUserList = userList.map((user) => {
    //   if (user.status === "Active") {
    //     return { ...user, status: "Deactive" };
    //   }
    //   return user;
    // });

    // setUserList([
    //   {
    //     name: userDetails.name,
    //     status: "Active",
    //     date: new Date().toLocaleDateString(), // Ensure rent_form_date is set appropriately
    //   },
    //   ...updatedUserList,
    // ]);

    // Upload tenant details and photo to the backend

    try {
      const formData = new FormData();
      console.log(userDetails);
      return;
      formData.append("name", userDetails.name);
      formData.append("rent_status", "paid");
      files.forEach((file) => {
        formData.append(file.name, {
          uri: file.uri,
          type: file.type,
          name: file.name,
        });
      });
      console.log(formData);
      const response = await fetch(
        `https://stock-management-system-server-6mja.onrender.com/api/tenants/add-tenant-by-flat/asd`,
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Upload successful:", data);
      // Handle success as needed (e.g., navigate to next screen)
    } catch (error) {
      console.error("Error uploading files:", error);
      Alert.alert("Error", "Failed to upload files. Please try again.");
    }

    // setUserDetails({
    //   name: "",
    //   tenantPhotoUri: "",
    // });
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

  const handleChoosePhoto = async (photoType) => {
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

    if (!pickerResult.cancelled) {
      // Determine which photo type is selected (front or back)
      if (photoType === "adharFront") {
        setUserDetails((prevState) => ({
          ...prevState,
          adharPhotoUri: pickerResult.assets[0].uri,
        }));
      } else if (photoType === "adharBack") {
        setAadharBackPhotoUri(pickerResult.assets[0].uri);
      } else if (photoType === "tenantPhoto") {
        setUserDetails((prevState) => ({
          ...prevState,
          tenantPhotoUri: pickerResult.assets[0].uri,
        }));
      } else if (photoType === "lightBill") {
        setUserDetails((prevState) => ({
          ...prevState,
          lightBillPhotoUri: pickerResult.assets[0].uri,
        }));
      }
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
                <Text style={styles.label}>Tenant Photo:</Text>
                <TouchableOpacity style={styles.uploadButton}>
                  <Button
                    title="Choose Photo"
                    onPress={() => handleChoosePhoto("tenantPhoto")}
                  />
                </TouchableOpacity>
                {userDetails.tenantPhotoUri ? (
                  <Text style={styles.fileName}>
                    {userDetails.tenantPhotoUri.split("/").pop()}
                  </Text>
                ) : null}
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>ID Proof Front Photo:</Text>
                <TouchableOpacity style={styles.uploadButton}>
                  <Button
                    title="Choose Photo"
                    onPress={() => handleChoosePhoto("adharFront")}
                  />
                </TouchableOpacity>
                {userDetails.adharPhotoUri ? (
                  <Text style={styles.fileName}>
                    {userDetails.adharPhotoUri.split("/").pop()}
                  </Text>
                ) : null}
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>ID Proof Back Photo:</Text>
                <TouchableOpacity style={styles.uploadButton}>
                  <Button
                    title="Choose Photo"
                    onPress={() => handleChoosePhoto("adharBack")}
                  />
                </TouchableOpacity>
                {aadharBackPhotoUri ? (
                  <Text style={styles.fileName}>
                    {aadharBackPhotoUri.split("/").pop()}
                  </Text>
                ) : null}
              </View>
              <View style={styles.formRow}>
                <Text style={styles.label}>Past Light Bill Photo:</Text>
                <TouchableOpacity style={styles.uploadButton}>
                  <Button
                    title="Choose Photo"
                    onPress={() => handleChoosePhoto("lightBill")}
                  />
                </TouchableOpacity>
                {userDetails.lightBillPhotoUri ? (
                  <Text style={styles.fileName}>
                    {userDetails.lightBillPhotoUri.split("/").pop()}
                  </Text>
                ) : null}
              </View>
            </View>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleConfirmAddUser}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setAddUserModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
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
    backgroundColor: "#ffffff",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333333",
  },
  searchContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
  },
  searchInput: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: "bold",
    color: "#333333",
  },
  scrollView: {
    width: "100%",
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 2,
    width: "100%",
  },
  tableCell: {
    flex: 1,
    color: "#333333",
  },
  activeStatus: {
    color: "green",
    fontWeight: "bold",
  },
  inactiveStatus: {
    color: "red",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333333",
  },
  userDetailContainer: {
    width: "100%",
    marginBottom: 16,
  },
  userDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  boldText: {
    fontWeight: "bold",
    color: "#333333",
  },
  userDetailText: {
    color: "#333333",
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: "#333333",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  addButton: {
    marginTop: 16,
    backgroundColor: "#333333",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  formContainer: {
    width: "100%",
  },
  formRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  uploadButton: {
    marginTop: 8,
    alignSelf: "flex-start",
  },
  fileName: {
    marginTop: 8,
    color: "#333333",
  },
  saveButton: {
    backgroundColor: "#333333",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  saveButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});
