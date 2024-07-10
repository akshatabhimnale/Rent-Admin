import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ManageWings = ({ navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [societies, setSocieties] = useState([]);
  const [wingsBySociety, setWingsBySociety] = useState({});
  const [wingName, setWingName] = useState("");
  const [fetchError, setFetchError] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedWing, setSelectedWing] = useState(null);
  const [loadingWings, setLoadingWings] = useState(false);

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
        fetchWingsForAllSocieties(data);
      })
      .catch((error) => {
        console.error("Error fetching societies:", error);
        setFetchError(error.message);
      });
  };

  const fetchWingsForAllSocieties = (societies) => {
    setLoadingWings(true);
    const fetchPromises = societies.map((society) =>
      fetch(
        `https://stock-management-system-server-6mja.onrender.com/api/wings/wings-by-society/${society._id}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          return { societyId: society._id, wings: data };
        })
    );

    Promise.all(fetchPromises)
      .then((results) => {
        const wingsBySociety = {};
        results.forEach(({ societyId, wings }) => {
          wingsBySociety[societyId] = wings;
        });
        setWingsBySociety(wingsBySociety);
        setLoadingWings(false);
      })
      .catch((error) => {
        console.error("Error fetching wings:", error);
        setLoadingWings(false);
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
        fetchWingsForSociety(selectedBuilding._id);
        setIsModalVisible(false);
        setWingName("");
      })
      .catch((error) => {
        console.error("Error adding wing:", error);
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
        setWingsBySociety((prev) => ({
          ...prev,
          [societyId]: data,
        }));
        setLoadingWings(false);
      })
      .catch((error) => {
        console.error("Error fetching wings:", error);
        setLoadingWings(false);
      });
  };

  const editWing = (wingId, societyId) => {
    console.log(wingId + "==" + societyId);
    const wingToEdit = wingsBySociety[societyId].find(
      (wing) => wing._id === wingId
    );
    setSelectedWing({ wingId, societyId });
    setWingName(wingToEdit.name);
    setEditModalVisible(true);
  };

  const updateWing = () => {
    if (!selectedWing || !selectedWing.wingId || !selectedWing.societyId) {
      console.error("Invalid selected wing or society ID");
      return;
    }

    fetch(
      `https://stock-management-system-server-6mja.onrender.com/api/wings/${selectedWing.wingId}`,
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
      .then((updatedWing) => {
        const updatedWings = wingsBySociety[selectedWing.societyId].map(
          (wing) => (wing._id === selectedWing.wingId ? updatedWing : wing)
        );
        setWingsBySociety((prev) => ({
          ...prev,
          [selectedWing.societyId]: updatedWings,
        }));
        setEditModalVisible(false);
        setWingName("");
        setSelectedWing(null);
      })
      .catch((error) => {
        console.error("Error updating wing:", error);
      });
  };

  const deleteWing = (wingId, societyId) => {
    setSelectedWing({ wingId, societyId });
    setDeleteModalVisible(true);
  };

  const confirmDeleteWing = () => {
    if (!selectedWing || !selectedWing.wingId || !selectedWing.societyId) {
      console.error("Invalid selected wing or society ID");
      return;
    }

    fetch(
      `https://stock-management-system-server-6mja.onrender.com/api/wings/${selectedWing.wingId}`,
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
        const updatedWings = wingsBySociety[selectedWing.societyId].filter(
          (wing) => wing._id !== selectedWing.wingId
        );
        setWingsBySociety((prev) => ({
          ...prev,
          [selectedWing.societyId]: updatedWings,
        }));
        setDeleteModalVisible(false);
        setSelectedWing(null);
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
                onPress={() => {
                  setIsModalVisible(true);
                  setSelectedBuilding(society);
                }}
              >
                <Text style={styles.addButtonText}>Add Wing</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            {loadingWings ? (
              <ActivityIndicator size="large" color="#6699CC" />
            ) : wingsBySociety[society._id]?.length === 0 ? (
              <Text>No wings for this Society</Text>
            ) : (
              wingsBySociety[society._id]?.map((wing) => (
                <View key={wing._id} style={styles.wingContainer}>
                  <Image
                    source={require("../assets/images/wing.png")}
                    style={styles.wingImage}
                  />
                  <Text style={styles.wingName}>{wing.name}</Text>
                  <View style={styles.wingIcons}>
                    <TouchableOpacity
                      onPress={() => editWing(wing._id, society._id)}
                    >
                      <FontAwesome name="edit" size={30} color="#6699CC" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => deleteWing(wing._id, society._id)}
                    >
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

      {/* Delete Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Are you sure you want to delete this wing?
            </Text>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={confirmDeleteWing}
            >
              <Text style={styles.submitButtonText}>Yes, Delete</Text>
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
    backgroundColor: "#FFBF00",
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
