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
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const ManageFlats = ({ navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [societies, setSocieties] = useState([]);
  const [wings, setWings] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedWing, setSelectedWing] = useState(null);
  const [loadingWings, setLoadingWings] = useState(true);
  const [flats, setFlats] = useState([]);
  const [flatName, setFlatName] = useState("");
  const [fetchFlatsError, setFetchFlatsError] = useState(null);
  const [selectedFlat, setSelectedFlat] = useState(null);

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
        setFetchError(null);
        if (data.length > 0) {
          fetchWingsForSociety(data[0]._id);
          setSelectedBuilding(data[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching societies:", error);
        setFetchError(error.message);
      });
  };

  const fetchWingsForSociety = (societyId) => {
    setLoadingWings(true);
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
        setLoadingWings(false);
      })
      .catch((error) => {
        console.error("Error fetching wings:", error);
        setLoadingWings(false);
      });
  };

  const fetchFlatsForWing = (wingId) => {
    fetch(
      `https://stock-management-system-server-6mja.onrender.com/api/flats/flats-by-wing/${wingId}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setFlats(data);
        setFetchFlatsError(null);
      })
      .catch((error) => {
        console.error("Error fetching flats:", error);
        setFetchFlatsError(error.message);
      });
  };

  const addFlat = (wingId) => {
    fetch(
      `https://stock-management-system-server-6mja.onrender.com/api/flats/add-flat/${wingId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: flatName }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add flat: " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        fetchFlatsForWing(wingId); // Refresh flats list after adding
        setFlatName(""); // Clear input field
      })
      .catch((error) => {
        console.error("Error adding flat:", error);
        Alert.alert(
          "Error",
          "Failed to add flat. Please check your network connection and try again."
        );
      });
  };

  const editFlat = (flatId, newName) => {
    fetch(
      `https://stock-management-system-server-6mja.onrender.com/api/flats/update-flat/${flatId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName }), // Adjust as per your flat data structure
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update flat");
        }
        return response.json();
      })
      .then((data) => {
        fetchFlatsForWing(selectedWing); // Refresh flats list after updating
        setEditModalVisible(false); // Close edit modal
      })
      .catch((error) => {
        console.error("Error editing flat:", error);
        Alert.alert("Error", "Failed to update flat. Please try again later.");
      });
  };

  const deleteFlat = (flatId) => {
    fetch(
      `https://stock-management-system-server-6mja.onrender.com/api/flats/delete-flat/${flatId}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete flat");
        }
        return response.json();
      })
      .then((data) => {
        fetchFlatsForWing(selectedWing); // Refresh flats list after deletion
        setDeleteModalVisible(false); // Close delete modal
      })
      .catch((error) => {
        console.error("Error deleting flat:", error);
        Alert.alert("Error", "Failed to delete flat. Please try again later.");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Manage Flats</Text>

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
            </View>
            <View style={styles.divider} />
            {loadingWings ? (
              <ActivityIndicator size="large" color="#6699CC" />
            ) : (
              <>
                {wings.map((wing, index) => (
                  <View key={wing._id}>
                    <View style={styles.wingContainer}>
                      <Image
                        source={require("../assets/images/wing.png")}
                        style={styles.wingImage}
                      />
                      <Text style={styles.wingName}>{wing.name}</Text>
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => addFlat(wing._id)}
                      >
                        <Text style={styles.addButtonText}>Add Flat</Text>
                      </TouchableOpacity>
                     
                    </View>
                    <View style={styles.divider} />
                    {wing._id === selectedWing && flats.length > 0 && (
                      <ScrollView>
                        {flats.map((flat) => (
                          <View key={flat._id} style={styles.flatContainer}>
                            <Image
                              source={require("../assets/images/flats.jpg")}
                              style={styles.flatImage}
                            />
                            <Text style={styles.flatName}>{flat.name}</Text>
                            <View style={styles.flatIcons}>
                              <TouchableOpacity
                                onPress={() => {
                                  setSelectedFlat(flat);
                                  setEditModalVisible(true);
                                }}
                              >
                                <FontAwesome
                                  name="edit"
                                  size={30}
                                  color="#6699CC"
                                />
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress={() => {
                                  setSelectedFlat(flat);
                                  setDeleteModalVisible(true);
                                }}
                              >
                                <FontAwesome
                                  name="trash"
                                  size={30}
                                  color="red"
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        ))}
                      </ScrollView>
                    )}
                  </View>
                ))}
              </>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Edit Flat Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Flat</Text>
            <TextInput
              style={styles.input}
              placeholder="Flat Name"
              value={flatName}
              onChangeText={(text) => setFlatName(text)}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => editFlat(selectedFlat._id, flatName)}
            >
              <Text style={styles.submitButtonText}>Save Changes</Text>
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

      {/* Delete Flat Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Delete</Text>
            <Text style={styles.deleteText}>
              Are you sure you want to delete this flat?
            </Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteFlat(selectedFlat._id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setDeleteModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  societyContainer: {
    marginBottom: 20,
  },
  societyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  buildingImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  societyName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  divider: {
    borderBottomColor: "#CCCCCC",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  wingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  wingImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  wingName: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  addButton: {
    backgroundColor: "#FFBF00",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  flatContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  flatImage: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  flatName: {
    fontSize: 16,
    flex: 1,
  },
  flatIcons: {
    flexDirection: "row",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
    padding: 10,
    width: "100%",
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#6699CC",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#666666",
    fontWeight: "bold",
  },
  deleteText: {
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});

export default ManageFlats;
