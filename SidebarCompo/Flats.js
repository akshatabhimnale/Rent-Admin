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

const API_URL = "https://stock-management-system-server-6mja.onrender.com";

const Flats = ({ route, navigation }) => {
  const { societyId } = route.params;
  const [flats, setFlats] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [flatName, setFlatName] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/flats/flats-by-wings/${societyId}`)
      .then((response) => response.json())
      .then((data) => setFlats(data))
      .catch((error) => console.error("Error fetching flats:", error));
  }, [societyId]);

  const toggleModal = () => {
    setIsModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/flats/add-flats-by-wing/${societyId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: flatName }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add flat");
      }

      const newFlat = await response.json();
      setFlats([...flats, newFlat]);
      Alert.alert("Flat added successfully");
      setFlatName("");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error adding flat:", error);
      Alert.alert("Failed to add flat");
    }
  };

  const handleFlatPress = (flat) => {
    navigation.navigate("Userdetails", { flat });
  };

  const renderFlats = () => {
    return (
      <View style={styles.buildingsContainer}>
        {flats.map((flat) => (
          <TouchableOpacity
            key={flat._id}
            style={styles.buildingItem}
            onPress={() => handleFlatPress(flat)}
          >
            <Image
              source={require("../assets/images/flats.jpg")}
              style={styles.buildingImage}
            />
            <Text style={styles.buildingName}>{flat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Total Flats</Text>
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
            <Text style={styles.modalTitle}>Add Flat</Text>
            <TextInput
              style={styles.input}
              placeholder="Name of Flat"
              value={flatName}
              onChangeText={(text) => setFlatName(text)}
              editable={true}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>ADD</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>CLOSE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
        <Text style={styles.addButtonText}>Add Flat</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Flats;

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
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  buildingItem: {
    width: "48%",
    marginBottom: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
  },
  buildingImage: {
    width: "90%",
    height: 120,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 10,
  },
  buildingName: {
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
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
