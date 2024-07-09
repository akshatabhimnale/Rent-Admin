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
import { FontAwesome } from "@expo/vector-icons";

const Flats = () => {
  const [societies, setSocieties] = useState([]);
  const [selectedSociety, setSelectedSociety] = useState(null);
  const [selectedWing, setSelectedWing] = useState(null);
  const [flats, setFlats] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [flatName, setFlatName] = useState("");
  const [selectedFlat, setSelectedFlat] = useState(null);

  const API_URL = "https://stock-management-system-server-6mja.onrender.com";

  useEffect(() => {
    fetch(`${API_URL}/api/societies`)
      .then((response) => response.json())
      .then((data) => setSocieties(data))
      .catch((error) => console.error("Error fetching societies:", error));
  }, []);

  const fetchWingsAndFlats = async (societyId, wingId) => {
    try {
      const [societyResponse, wingResponse, flatsResponse] = await Promise.all([
        fetch(`${API_URL}/api/societies/${societyId}`),
        fetch(`${API_URL}/api/wings/${wingId}`),
        fetch(`${API_URL}/api/flats/flats-by-wings/${wingId}`),
      ]);

      if (!societyResponse.ok || !wingResponse.ok || !flatsResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const societyData = await societyResponse.json();
      const wingData = await wingResponse.json();
      const flatsData = await flatsResponse.json();

      setSelectedSociety(societyData);
      setSelectedWing(wingData);
      setFlats(flatsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Failed to fetch data");
    }
  };

  const toggleModal = (flat) => {
    setSelectedFlat(flat);
    setFlatName(flat ? flat.name : "");
    setIsModalVisible(true);
  };

  const handleSubmit = async () => {
    const flat = { name: flatName };
    const url = selectedFlat
      ? `${API_URL}/api/flats/${selectedFlat._id}`
      : `${API_URL}/api/flats/add-flats-by-wing/${selectedWing._id}`;
    const method = selectedFlat ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(flat),
      });

      if (!response.ok) {
        throw new Error(
          selectedFlat ? "Failed to update flat" : "Failed to add flat"
        );
      }

      const newFlat = await response.json();
      if (selectedFlat) {
        setFlats(
          flats.map((item) => (item._id === newFlat._id ? newFlat : item))
        );
      } else {
        setFlats([...flats, newFlat]);
      }
      Alert.alert(
        selectedFlat ? "Flat updated successfully" : "Flat added successfully"
      );
      setFlatName("");
      setIsModalVisible(false);
      setSelectedFlat(null);
    } catch (error) {
      console.error(
        selectedFlat ? "Error updating flat:" : "Error adding flat:",
        error
      );
      Alert.alert(
        selectedFlat ? "Failed to update flat" : "Failed to add flat"
      );
    }
  };

  const handleDeleteFlat = async (flatId) => {
    try {
      const response = await fetch(`${API_URL}/api/flats/${flatId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete flat");
      }

      setFlats(flats.filter((flat) => flat._id !== flatId));
      Alert.alert("Flat deleted successfully");
    } catch (error) {
      console.error("Error deleting flat:", error);
      Alert.alert("Failed to delete flat");
    }
  };

  const renderSocieties = () => {
    return societies.map((soc) => (
      <TouchableOpacity
        key={soc._id}
        style={styles.societyButton}
        onPress={() => fetchWingsAndFlats(soc._id, soc.defaultWingId)}
      >
        <Text style={styles.societyButtonText}>{soc.name}</Text>
      </TouchableOpacity>
    ));
  };

  const renderWings = () => {
    if (!selectedSociety) return null;
    return selectedSociety.wings.map((wing) => (
      <TouchableOpacity
        key={wing._id}
        style={styles.wingButton}
        onPress={() => fetchWingsAndFlats(selectedSociety._id, wing._id)}
      >
        <Text style={styles.wingButtonText}>{wing.name}</Text>
      </TouchableOpacity>
    ));
  };

  const renderFlats = () => {
    return flats.map((flat) => (
      <View key={flat._id} style={styles.flatCard}>
        <Image
          source={require("../assets/images/flats.jpg")}
          style={styles.flatImage}
        />
        <Text style={styles.flatName}>{flat.name}</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => toggleModal(flat)}>
            <FontAwesome name="edit" size={24} color="#6699CC" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteFlat(flat._id)}>
            <FontAwesome name="trash" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.societiesContainer}>
          <Text style={styles.sectionTitle}>Societies</Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {renderSocieties()}
          </ScrollView>
        </View>

        <View style={styles.wingsContainer}>
          <Text style={styles.sectionTitle}>Wings</Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {renderWings()}
          </ScrollView>
        </View>

        <View style={styles.flatsContainer}>
          <Text style={styles.sectionTitle}>Flats</Text>
          <ScrollView contentContainerStyle={styles.flatScrollView}>
            {renderFlats()}
          </ScrollView>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedFlat ? "Edit Flat" : "Add Flat"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Name of Flat"
              value={flatName}
              onChangeText={(text) => setFlatName(text)}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>
                  {selectedFlat ? "Update" : "Add"}
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

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => toggleModal(null)}
      >
        <Text style={styles.addButtonText}>Add Flat</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Flats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  scrollView: {
    paddingBottom: 20,
  },
  societiesContainer: {
    marginBottom: 20,
  },
  wingsContainer: {
    marginBottom: 20,
  },
  flatsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  societyButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  societyButtonText: {
    fontSize: 16,
  },
  wingButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  wingButtonText: {
    fontSize: 16,
  },
  flatScrollView: {
    marginTop: 10,
  },
  flatCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  flatImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  flatName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  submitButton: {
    backgroundColor: "#27ae60",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "45%",
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
    width: "45%",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#FFBF00",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
