import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome for icons

const Totalbuildings = ({ navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [societyName, setSocietyName] = useState("");
  const [numberOfWings, setNumberOfWings] = useState("");
  const [societyAddress, setSocietyAddress] = useState("");
  const [buildingsData, setBuildingsData] = useState([]);

  useEffect(() => {
    fetch(
      "https://stock-management-system-server-6mja.onrender.com/api/societies"
    )
      .then((response) => response.json())
      .then((data) => setBuildingsData(data))
      .catch((error) => console.error("Error fetching societies:", error));
  }, []);

  const toggleModal = (building) => {
    setSelectedBuilding(building);
    setSocietyName(building ? building.name : "");
    setSocietyAddress(building ? building.address : "");
    setIsModalVisible(true);
  };

  const handleSubmit = () => {
    const society = {
      name: societyName,
      address: societyAddress,
    };

    const url = selectedBuilding
      ? `https://stock-management-system-server-6mja.onrender.com/api/societies/${selectedBuilding._id}`
      : "https://stock-management-system-server-6mja.onrender.com/api/societies";

    const method = selectedBuilding ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(society),
    })
      .then((response) => response.json())
      .then((data) => {
        Alert.alert(
          selectedBuilding
            ? "Society updated successfully"
            : "Society added successfully"
        );
        if (selectedBuilding) {
          setBuildingsData(
            buildingsData.map((item) => (item._id === data._id ? data : item))
          );
        } else {
          setBuildingsData([...buildingsData, data]);
        }
        setSocietyName("");
        setNumberOfWings("");
        setSocietyAddress("");
        setIsModalVisible(false);
        setSelectedBuilding(null);
      })
      .catch((error) =>
        console.error(
          selectedBuilding
            ? "Error updating society:"
            : "Error adding society:",
          error
        )
      );
  };

  const handleDeleteSociety = () => {
    fetch(
      `https://stock-management-system-server-6mja.onrender.com/api/societies/${selectedBuilding._id}`,
      {
        method: "DELETE",
      }
    )
      .then(() => {
        setBuildingsData(
          buildingsData.filter(
            (building) => building._id !== selectedBuilding._id
          )
        );
        setIsDeleteModalVisible(false);
        setSelectedBuilding(null);
        Alert.alert("Society deleted successfully");
      })
      .catch((error) => console.error("Error deleting society:", error));
  };

  const renderBuildings = () => {
    return (
      <View style={styles.buildingsContainer}>
        {buildingsData.map((building) => (
          <View key={building._id} style={styles.buildingItemContainer}>
            <Image
              source={require("../assets/images/building.png")}
              style={styles.buildingImage}
            />
            <Text style={styles.buildingName}>{building.name}</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => toggleModal(building)}>
                <FontAwesome name="edit" size={30} color="#6699CC" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSelectedBuilding(building);
                  setIsDeleteModalVisible(true);
                }}
              >
                <FontAwesome name="trash" size={30} color="red" />
              </TouchableOpacity>
            </View>
          </View>
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
            <Text style={styles.modalTitle}>
              {selectedBuilding ? "Edit Society" : "Add Society"}
            </Text>
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
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>
                  {selectedBuilding ? "Update" : "Add"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={() => {
          setIsDeleteModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Society</Text>
            <Text>Are you sure you want to delete this society?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleDeleteSociety}
              >
                <Text style={styles.submitButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsDeleteModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => toggleModal(null)}
      >
        <Text style={styles.addButtonText}>Add Society</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Totalbuildings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 30,
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  scrollView: {
    width: "100%",
    paddingHorizontal: 20,
  },
  buildingsContainer: {
    width: "100%",
  },
  buildingItemContainer: {
    flexDirection: "row",
    alignItems: "center",
      borderWidth: 1,
    width:"100%",
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  buildingImage: {
    width: 50,
    height: 50,
    resizeMode: "cover",
    borderRadius: 10,
    marginRight: 10,
  },
  buildingName: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  iconContainer: {
    flexDirection: "row",
      justifyContent: "flex-end",
    gap:15,
  },
  addButton: {
    backgroundColor: "#FFBF00",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    width: "100%",
    marginBottom: 20,
    minHeight: 40,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
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
  closeButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
