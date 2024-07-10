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
  const [addFlatModalVisible, setAddFlatModalVisible] = useState(false);

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
        if (data.length > 0) {
          fetchFlatsForWing(data[0]._id); // Fetch flats for the first wing by default
        }
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
        console.log("Fetched flats:", data); // Log fetched flats
        setFlats(data);
        setFetchFlatsError(null);
      })
      .catch((error) => {
        console.error("Error fetching flats:", error);
        setFetchFlatsError(error.message);
      });
  };

  const addFlat = async (wingId, flatName) => {
    try {
      const response = await fetch(
        `https://stock-management-system-server-6mja.onrender.com/api/flats/add-flats-by-wing/${wingId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: flatName }),
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to add flat: ${response.status}`);
      }
      const data = await response.json();
      console.log("Flat added successfully", data);
      fetchFlatsForWing(wingId); // Refresh the flats list
      setAddFlatModalVisible(false); // Close the modal after adding
    } catch (error) {
      console.error("Error adding flat:", error);
      Alert.alert("Error", `Failed to add flat: ${error.message}`);
    }
  };

  const editFlat = (flatId, newName) => {
    fetch(
      `https://stock-management-system-server-6mja.onrender.com/api/flats/${flatId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName }),
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
      `https://stock-management-system-server-6mja.onrender.com/api/flats/${flatId}`,
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
                {wings.map((wing) => (
                  <View key={wing._id}>
                    <View style={styles.wingContainer}>
                      <Image
                        source={require("../assets/images/wing.png")}
                        style={styles.wingImage}
                      />
                      <Text style={styles.wingName}>{wing.name}</Text>
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => {
                          setSelectedWing(wing._id);
                          setAddFlatModalVisible(true);
                        }}
                      >
                        <Text style={styles.addButtonText}>Add Flat</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.divider} />
                    {wing._id === selectedWing && (
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

      {/* Add Flat Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addFlatModalVisible}
        onRequestClose={() => setAddFlatModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Enter Flat Name"
              value={flatName}
              onChangeText={(text) => setFlatName(text)}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  addFlat(selectedWing, flatName);
                  setFlatName(""); // Clear input after adding
                }}
              >
                <Text style={styles.modalButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setAddFlatModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Flat Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Enter new Flat Name"
              value={selectedFlat ? selectedFlat.name : ""}
              onChangeText={(text) =>
                setSelectedFlat({ ...selectedFlat, name: text })
              }
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => editFlat(selectedFlat._id, selectedFlat.name)}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Flat Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to delete this flat?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => deleteFlat(selectedFlat._id)}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>No</Text>
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
    padding: 20,
    backgroundColor: "#F5FCFF",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  errorText: {
    color: "red",
  },
  scrollView: {
    paddingVertical: 10,
  },
  societyContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#6699CC",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  societyHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  societyName: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  buildingImage: {
    width: 50,
    height: 50,
  },
  divider: {
    height: 1,
    backgroundColor: "#CCCCCC",
    marginVertical: 10,
  },
  wingContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  wingImage: {
    width: 40,
    height: 40,
  },
  wingName: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  addButton: {
    marginLeft: "auto",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#6699CC",
    borderRadius: 5,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  flatContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  flatImage: {
    width: 30,
    height: 30,
  },
  flatName: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  flatIcons: {
    flexDirection: "row",
    marginLeft: "auto",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#6699CC",
    borderRadius: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default ManageFlats;
