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
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const ManageWings = ({ navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [societies, setSocieties] = useState([]);
  const [wings, setWings] = useState([]);
  const [wingName, setWingName] = useState("");
  const [fetchError, setFetchError] = useState(null); // State to store fetch error
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedWing, setSelectedWing] = useState(null);
  const [loadingWings, setLoadingWings] = useState(true); // State to track loading wings

  useEffect(() => {
    fetchSocieties();
  }, []);

  const fetchSocieties = () => {
    fetch(
      "https://stock-management-system-server-6mja.onrender.com/api/societies"
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setSocieties(data);
        setFetchError(null); // Reset fetch error if successful
        // Fetch wings for the first society in the list by default
        if (data.length > 0) {
          fetchWingsForSociety(data[0]._id);
          setSelectedBuilding(data[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching societies:", error);
        setFetchError(error.message); // Store error message
      });
  };

  const fetchWingsForSociety = (societyId) => {
    setLoadingWings(true); // Start loading wings
    fetch(
      `https://stock-management-system-server-6mja.onrender.com/api/wings/wings-by-society/${societyId}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setWings(data);
        setLoadingWings(false); // Stop loading wings
      })
      .catch((error) => {
        console.error("Error fetching wings:", error);
        setLoadingWings(false); // Stop loading wings on error
      });
  };

  const addWing = () => {
    fetch(
      `https://stock-management-system-server-6mja.onrender.com/api/wings/add-wing-by-society/${selectedBuilding._id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: wingName }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add wing");
        }
        return response.json();
      })
      .then((data) => {
        // Fetch updated list of wings after adding a wing
        fetchWingsForSociety(selectedBuilding._id);
        setIsModalVisible(false);
        setWingName("");
      })
      .catch((error) => {
        console.error("Error adding wing:", error);
      });
  };

  const editWing = (wingId) => {
    setSelectedWing(wingId);
    setEditModalVisible(true);
  };

  const updateWing = () => {
    fetch(
      `https://stock-management-system-server-6mja.onrender.com/api/wings/${selectedWing}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: wingName }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update wing");
        }
        return response.json();
      })
      .then((data) => {
        // Update wings array with updated wing data
        const updatedWings = wings.map((wing) =>
          wing._id === selectedWing ? data : wing
        );
        setWings(updatedWings);
        setEditModalVisible(false);
        setWingName("");
      })
      .catch((error) => {
        console.error("Error updating wing:", error);
      });
  };

  const deleteWing = (wingId) => {
    setSelectedWing(wingId);
    setDeleteModalVisible(true);
  };

  const confirmDeleteWing = () => {
    fetch(
      `https://stock-management-system-server-6mja.onrender.com/api/wings/${selectedWing}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete wing");
        }
        return response.json();
      })
      .then(() => {
        // Remove deleted wing from wings array
        const updatedWings = wings.filter((wing) => wing._id !== selectedWing);
        setWings(updatedWings);
        setDeleteModalVisible(false);
      })
      .catch((error) => {
        console.error("Error deleting wing:", error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Manage Wings</Text>

      {fetchError && (
        <Text style={styles.errorText}>Error fetching data: {fetchError}</Text>
      )}

      <ScrollView contentContainerStyle={styles.scrollView}>
        {societies.map((society) => (
          <View key={society._id} style={styles.societyContainer}>
            <View style={styles.societyHeader}>
              <Image
                source={require("../assets/images/building.png")}
                style={styles.buildingImage}
              />
              <Text style={styles.societyName}>{society.name}</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setIsModalVisible(true)}
              >
                <Text style={styles.addButtonText}>Add Wing</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            {loadingWings ? (
              <ActivityIndicator size="large" color="#6699CC" />
            ) : wings.length === 0 ? (
              <Text>No wings for this Society</Text>
            ) : (
              wings.map((wing) => (
                <View key={wing._id} style={styles.wingContainer}>
                  <Image
                    source={require("../assets/images/wing.png")}
                    style={styles.wingImage}
                  />
                  <Text style={styles.wingName}>{wing.name}</Text>
                  <View style={styles.wingIcons}>
                    <TouchableOpacity onPress={() => editWing(wing._id)}>
                      <FontAwesome name="edit" size={30} color="#6699CC" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteWing(wing._id)}>
                      <FontAwesome name="trash" size={30} color="red" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        ))}
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
              Add Wing for {selectedBuilding?.name}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Wing Name"
              value={wingName}
              onChangeText={(text) => setWingName(text)}
            />
            <TouchableOpacity style={styles.submitButton} onPress={addWing}>
              <Text style={styles.submitButtonText}>Add Wing</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Wing Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Wing</Text>
            <TextInput
              style={styles.input}
              placeholder="Wing Name"
              value={wingName}
              onChangeText={(text) => setWingName(text)}
            />
            <TouchableOpacity style={styles.submitButton} onPress={updateWing}>
              <Text style={styles.submitButtonText}>Update Wing</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setEditModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Wing Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Delete</Text>
            <Text style={styles.deleteMessage}>
              Are you sure you want to delete this wing?
            </Text>
            <View style={styles.deleteButtonContainer}>
              <TouchableOpacity
                style={[styles.deleteButton, { backgroundColor: "red" }]}
                onPress={confirmDeleteWing}
              >
                <Text style={styles.deleteButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deleteButton, { backgroundColor: "#6699CC" }]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.deleteButtonText}>No</Text>
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
    backgroundColor: "#fff",
    padding: 16,
  },
  divider: {
    borderBottomColor: "#CCCCCC",
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 16,
  },
  scrollView: {
    flexGrow: 1,
    marginTop: 16,
  },
  societyContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
    borderRadius: 8,
  },
  societyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  buildingImage: {
    width: 50,
    height: 50,
    marginRight: 8,
  },
  societyName: {
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: "#FFBF00", // Change color here
    padding: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  wingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  wingImage: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  wingName: {
    fontSize: 18,
    flex: 1,
  },
  wingIcons: {
    flexDirection: "row",
    gap: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: "#6699CC",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  deleteMessage: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  deleteButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  deleteButton: {
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    width: "40%",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 16,
  },
});

export default ManageWings;
