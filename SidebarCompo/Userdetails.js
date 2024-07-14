import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Userdetails({ route }) {
  const { flat } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [aadharBackPhotoUri, setAadharBackPhotoUri] = useState("");
  const [addUserModalVisible, setAddUserModalVisible] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    tenantPhotoUri: null,
    adharFrontUri: null,
    adharBackUri: null,
    panPhotoUri: null,
    electricityBillUri: null,
    ph_no: "",
    emailId: "",
    age: "",
    gender: "",
    maintaince: "",
    final_rent: "",
    deposit: "",
    current_meter_reading: "",
    rent_form_date: "",
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
    rent_status: "paid", // Assuming a default value
  });
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddUser = () => {
    setUserDetails({
      name: "",
      tenantPhotoUri: "",
      adharFrontUri: null,
      adharBackUri: null,
      panPhotoUri: null,
      electricityBillUri: null,
      ph_no: "",
      emailId: "",
      age: "",
      gender: "",
      maintaince: "",
      final_rent: "",
      deposit: "",
      current_meter_reading: "",
      rent_form_date: "",
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
      rent_status: "paid", // Reset all fields on modal open
    });
    setAddUserModalVisible(true);
  };

  const handleUploadPhotos = async () => {
    const formData = new FormData();
    formData.append("name", userDetails.name);
    formData.append("rent_status", userDetails.rent_status);
    formData.append("ph_no", userDetails.ph_no);
    formData.append("emailId", userDetails.emailId);
    formData.append("age", userDetails.age);
    formData.append("gender", userDetails.gender);
    formData.append("maintaince", userDetails.maintaince);
    formData.append("final_rent", userDetails.final_rent);
    formData.append("deposit", userDetails.deposit);
    formData.append("current_meter_reading", userDetails.current_meter_reading);
    formData.append("rent_form_date", userDetails.rent_form_date);
    formData.append("permanant_address", userDetails.permanant_address);
    formData.append("previous_address", userDetails.previous_address);
    formData.append("nature_of_work", userDetails.nature_of_work);
    formData.append("working_address", userDetails.working_address);
    formData.append("work_ph_no", userDetails.work_ph_no);
    formData.append("family_members", userDetails.family_members);
    formData.append("male_members", userDetails.male_members);
    formData.append("female_members", userDetails.female_members);
    formData.append("childs", userDetails.childs);
    formData.append("family_member_names", userDetails.family_member_names);
    formData.append("reference_person1", userDetails.reference_person1);
    formData.append("reference_person2", userDetails.reference_person2);
    formData.append("reference_person1_age", userDetails.reference_person1_age);
    formData.append("reference_person2_age", userDetails.reference_person2_age);
    formData.append("agent_name", userDetails.agent_name);

    const {
      tenantPhotoUri,
      adharFrontUri,
      adharBackUri,
      panPhotoUri,
      electricityBillUri,
    } = userDetails;

    const appendFileToFormData = (uri, fieldName) => {
      if (!uri) return;

      const fileExtension = uri.split(".").pop();
      let fileType = "";

      if (fileExtension === "png") fileType = "image/png";
      else if (fileExtension === "jpg" || fileExtension === "jpeg")
        fileType = "image/jpeg";
      else if (fileExtension === "pdf") fileType = "application/pdf";

      formData.append(fieldName, {
        uri,
        type: fileType,
        name: `${fieldName}.${fileExtension}`,
      });
    };

    appendFileToFormData(tenantPhotoUri, "tenant_photo");
    appendFileToFormData(adharFrontUri, "adhar_front");
    appendFileToFormData(adharBackUri, "adhar_back");
    appendFileToFormData(panPhotoUri, "pan_photo");
    appendFileToFormData(electricityBillUri, "electricity_bill");

    console.log(formData);
    const response = await fetch(
      `https://stock-management-system-server-6mja.onrender.com/api/tenants/add-tenant-by-flat/${flat._id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      }
    );

    let responseData;
    const contentType = response.headers.get("content-type");
    if (
      response.ok &&
      contentType &&
      contentType.includes("application/json")
    ) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    console.log("Response data:", responseData);

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    console.log("Upload successful:", responseData);
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

    if (!permissionResult.granted) {
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
      const uri = pickerResult.assets[0].uri;
      setUserDetails((prevState) => ({
        ...prevState,
        [`${photoType}Uri`]: uri,
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
                  <Text
                    style={[
                      styles.userDetailText,
                      selectedUser.status === "Active" && styles.activeStatus,
                      selectedUser.status === "Deactive" &&
                        styles.inactiveStatus,
                    ]}
                  >
                    {selectedUser.status}
                  </Text>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.addButton} onPress={handleAddUser}>
        <Text style={styles.addButtonText}>Add Tenant</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={addUserModalVisible}
        onRequestClose={() => setAddUserModalVisible(false)}
      >
        <ScrollView
          contentContainerStyle={styles.modalContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Tenant</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.name}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    name: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.ph_no}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    ph_no: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email ID:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.emailId}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    emailId: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Age:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.age}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    age: text,
                  }))
                }
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Gender:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.gender}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    gender: text,
                  }))
                }
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Maintaince:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.maintaince}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    maintaince: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Final Rent:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.final_rent}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    final_rent: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Deposit:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.deposit}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    deposit: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Current Meter Reading:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.current_meter_reading}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    current_meter_reading: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Rent Form Date:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.rent_form_date}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    rent_form_date: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Permanant Address:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.permanant_address}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    permanant_address: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Previous Address:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.previous_address}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    previous_address: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nature of Work:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.nature_of_work}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    nature_of_work: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Working Address:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.working_address}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    working_address: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Work Phone Number:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.work_ph_no}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    work_ph_no: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Family Members:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.family_members}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    family_members: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Male Members:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.male_members}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    male_members: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Female Members:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.female_members}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    female_members: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Childs:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.childs}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    childs: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Family Member Names:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.family_member_names}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    family_member_names: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Reference Person 1:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.reference_person1}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    reference_person1: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Reference Person 2:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.reference_person2}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    reference_person2: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Reference Person 1 Age:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.reference_person1_age}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    reference_person1_age: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Reference Person 2 Age:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.reference_person2_age}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    reference_person2_age: text,
                  }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Agent Name:</Text>
              <TextInput
                style={styles.input}
                value={userDetails.agent_name}
                onChangeText={(text) =>
                  setUserDetails((prevState) => ({
                    ...prevState,
                    agent_name: text,
                  }))
                }
              />
            </View>

            <TouchableOpacity
              style={[styles.uploadButton, styles.button]}
              onPress={() => handleChoosePhoto("tenantPhoto")}
            >
              <Text style={styles.buttonText}>Choose Tenant Photo</Text>
            </TouchableOpacity>

            {userDetails.tenantPhotoUri && (
              <Text style={styles.photoText}>
                Selected: {userDetails.tenantPhotoUri}
              </Text>
            )}

            <TouchableOpacity
              style={[styles.uploadButton, styles.button]}
              onPress={() => handleChoosePhoto("adharFront")}
            >
              <Text style={styles.buttonText}>Choose Adhar Front Photo</Text>
            </TouchableOpacity>

            {userDetails.adharFrontUri && (
              <Text style={styles.photoText}>
                Selected: {userDetails.adharFrontUri}
              </Text>
            )}

            <TouchableOpacity
              style={[styles.uploadButton, styles.button]}
              onPress={() => handleChoosePhoto("adharBack")}
            >
              <Text style={styles.buttonText}>Choose Adhar Back Photo</Text>
            </TouchableOpacity>

            {userDetails.adharBackUri && (
              <Text style={styles.photoText}>
                Selected: {userDetails.adharBackUri}
              </Text>
            )}

            <TouchableOpacity
              style={[styles.uploadButton, styles.button]}
              onPress={() => handleChoosePhoto("panPhoto")}
            >
              <Text style={styles.buttonText}>Choose PAN Photo</Text>
            </TouchableOpacity>

            {userDetails.panPhotoUri && (
              <Text style={styles.photoText}>
                Selected: {userDetails.panPhotoUri}
              </Text>
            )}

            <TouchableOpacity
              style={[styles.uploadButton, styles.button]}
              onPress={() => handleChoosePhoto("electricityBill")}
            >
              <Text style={styles.buttonText}>Choose Electricity Bill</Text>
            </TouchableOpacity>

            {userDetails.electricityBillUri && (
              <Text style={styles.photoText}>
                Selected: {userDetails.electricityBillUri}
              </Text>
            )}

            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setAddUserModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonSave]}
              onPress={handleUploadPhotos}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
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
    width: "100%",
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
  addButton: {
    marginTop: 16,
    backgroundColor: "#333333",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: "100%", // Ensure button takes full width
    alignItems: "center", // Center text in button
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
    width: "100%", // Ensure input takes full width
  },
  uploadButton: {
    marginTop: 8,
    backgroundColor: "#333333",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: "100%", // Ensure button takes full width
    alignItems: "center", // Center text in button
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center", // Center text in button
  },
  photoText: {
    marginTop: 8,
    color: "#333333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 16,
  },
  button: {
    backgroundColor: "#333333",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    width: "100%", // Adjust width as needed
    alignItems: "center", // Center text in button
  },
  buttonClose: {
    backgroundColor: "#cccccc", // Example color for close button
  },
  buttonSave: {
    backgroundColor: "green", // Example color for save button
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center", // Center text in buttons
  },
  inputContainer: {
    width: "100%",
  },
});
