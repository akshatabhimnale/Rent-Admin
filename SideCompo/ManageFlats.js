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

const ManageFlats = ({ navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [societies, setSocieties] = useState([]);
  const [wingsBySociety, setWingsBySociety] = useState({});
  const [wingName, setWingName] = useState("");
  const [fetchError, setFetchError] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedWing, setSelectedWing] = useState(null);
  const [selectedFlat, setSelectedFlat] = useState(null);
  const [loadingWings, setLoadingWings] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [flatName, setFlatName] = useState("");

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
        .then((wings) => {
          const wingPromises = wings.map((wing) =>
            fetch(
              `https://stock-management-system-server-6mja.onrender.com/api/flats/flats-by-wings/${wing._id}`
            )
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Network response was not ok");
                }
                return response.json();
              })
              .then((flats) => {
                wing.flats = flats;
                return wing;
              })
          );
          return Promise.all(wingPromises).then((wingsWithFlats) => {
            return { societyId: society._id, wings: wingsWithFlats };
          });
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

  const addFlat = (wingId) => {
    setSelectedWing(wingId); // Store selected wing ID
    setFlatName(""); // Reset flat name
    setAddModalVisible(true); // Open the add flat modal
  };

const saveFlat = () => {
  if (!selectedWing || !flatName) {
    console.error("Invalid wing ID or flat name");
    return;
  }

  fetch(
    `https://stock-management-system-server-6mja.onrender.com/api/flats/add-flats-by-wing/${selectedWing}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: flatName, wingId: selectedWing }),
    }
  )
    .then(async (response) => {
      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Failed to add flat:", errorBody);
        throw new Error("Failed to add flat");
      }
      return response.json();
    })
    .then((newFlat) => {
      // Ensure you update the state correctly
      setWingsBySociety((prev) => {
        const wingKey = Object.keys(prev).find((key) =>
          prev[key].some((wing) => wing._id === selectedWing)
        );

        if (!wingKey) {
          console.error("Wing not found");
          return prev; // No change if wing is not found
        }

        const updatedWings = prev[wingKey].map((wing) => {
          if (wing._id === selectedWing) {
            return {
              ...wing,
              flats: [...wing.flats, newFlat], // Add the new flat to the existing flats
            };
          }
          return wing;
        });

        return {
          ...prev,
          [wingKey]: updatedWings,
        };
      });

      setAddModalVisible(false);
      setFlatName("");
    })
    .catch((error) => {
      console.error("Error adding flat:", error);
    });
};




const editFlat = (flatId, wingId) => {
  const wing = Object.values(wingsBySociety)
    .flat()
    .find((wing) => wing._id === wingId);

  if (wing) {
    const flatToEdit = wing.flats.find((flat) => flat._id === flatId);

    if (flatToEdit) {
      setSelectedFlat({ flatId, wingId });
      setFlatName(flatToEdit.name);
      setEditModalVisible(true);
    } else {
      console.error("Flat not found");
    }
  } else {
    console.error("Wing not found");
  }
};




const updateFlat = () => {
  if (!selectedFlat || !selectedFlat.flatId || !selectedFlat.wingId) {
    console.error("Invalid selected flat or wing ID");
    return;
  }

  fetch(
    `https://stock-management-system-server-6mja.onrender.com/api/flats/${selectedFlat.flatId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: flatName }),
    }
  )
    .then((response) => {
      if (!response.ok) throw new Error("Failed to update flat");
      return response.json();
    })
    .then((updatedFlat) => {
      setWingsBySociety((prev) => {
        // Find the wing where the flat is located
        const wingKey = Object.keys(prev).find((key) =>
          prev[key].some((wing) =>
            wing.flats.some((flat) => flat._id === selectedFlat.flatId)
          )
        );

        if (!wingKey) {
          console.error("Wing not found");
          return prev; // No change if wing is not found
        }

        // Update the flats in the found wing
        return {
          ...prev,
          [wingKey]: prev[wingKey].map((wing) => ({
            ...wing,
            flats: wing.flats.map((flat) =>
              flat._id === selectedFlat.flatId ? updatedFlat : flat
            ),
          })),
        };
      });

      setEditModalVisible(false);
      setFlatName("");
      setSelectedFlat(null);
    })
    .catch((error) => {
      console.error("Error updating flat:", error);
    });
};


  const deleteFlat = (flatId, wingId) => {
    setSelectedFlat({ flatId, wingId });
    setDeleteModalVisible(true);
  };

const confirmDeleteFlat = () => {
  if (!selectedFlat || !selectedFlat.flatId || !selectedFlat.wingId) {
    console.error("Invalid selected flat or wing ID");
    return;
  }

  const societyId = Object.keys(wingsBySociety).find((key) =>
    wingsBySociety[key].some((wing) => wing._id === selectedFlat.wingId)
  );

  const wing = wingsBySociety[societyId]?.find(
    (wing) => wing._id === selectedFlat.wingId
  );
  if (!wing) {
    console.error("Wing not found");
    return;
  }

  fetch(
    `https://stock-management-system-server-6mja.onrender.com/api/flats/${selectedFlat.flatId}`,
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
    .then(() => {
      const updatedFlats = wing.flats.filter(
        (flat) => flat._id !== selectedFlat.flatId
      );
      setWingsBySociety((prev) => ({
        ...prev,
        [societyId]: prev[societyId].map((w) =>
          w._id === selectedFlat.wingId ? { ...w, flats: updatedFlats } : w
        ),
      }));
      setDeleteModalVisible(false);
      setSelectedFlat(null);
    })
    .catch((error) => {
      console.error("Error deleting flat:", error);
    });
};






  return (
    <View style={styles.container}>
      <Modal visible={addModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Flat</Text>
            <TextInput
              style={styles.input}
              value={flatName}
              onChangeText={setFlatName}
              placeholder="Enter Flat Name"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setAddModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={saveFlat}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
            ) : wingsBySociety[society._id]?.length === 0 ? (
              <Text>No wings for this Society</Text>
            ) : (
              wingsBySociety[society._id]?.map((wing) => (
                <View style={styles.wingflatcontainer}>
                  <View style={styles.wingImageNameContainer}>
                    <View key={wing._id} style={styles.wingContainer}>
                      <Image
                        source={require("../assets/images/wing.png")}
                        style={styles.wingImage}
                      />
                      <Text style={styles.wingName}>{wing.name}</Text>
                    </View>

                    <View style={styles.addFlatButtonContainer}>
                      <TouchableOpacity
                        style={styles.addFlatButton}
                        onPress={() => addFlat(wing._id)}
                      >
                        <Text style={styles.addFlatButtonText}>Add Flat</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.flatListingContainer}>
                    {wing.flats && wing.flats.length > 0 ? (
                      <View style={styles.flatsContainer}>
                        {wing.flats.map((flat) => (
                          <View key={flat._id} style={styles.flatContainer}>
                            <Image
                              source={require("../assets/images/flats.jpg")}
                              style={styles.flatImage}
                            />
                            <Text style={styles.flatName}>{flat.name}</Text>
                            <View style={styles.flatIcons}>
                              <TouchableOpacity
                                onPress={() => editFlat(flat._id, wing._id)}
                              >
                                <FontAwesome
                                  name="edit"
                                  size={30}
                                  color="#6699CC"
                                />
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => deleteFlat(flat._id, wing._id)}
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
                      </View>
                    ) : (
                      <Text style={styles.noFlatsText}>No Flats Available</Text>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        ))}
      </ScrollView>

      <Modal visible={editModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Flat</Text>
            <TextInput
              style={styles.input}
              value={flatName}
              onChangeText={setFlatName}
              placeholder="Enter Flat Name"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={updateFlat}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={deleteModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Flat</Text>
            <Text>Are you sure you want to delete this flat?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={confirmDeleteFlat}
              >
                <Text style={styles.buttonText}>Delete</Text>
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
    padding: 16,
    backgroundColor: "#F5FCFF",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#000",
  },
  societyContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 5,
  },
  wingflatcontainer: {
    flexDirection: "column",
  },
  flatListingContainer: {
    marginLeft: 20,
  },
  societyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  buildingImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  societyName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#DDD",
    marginVertical: 10,
  },
  wingContainer: {
    marginBottom: 10,
    padding: 10,
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  wingImageNameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  wingImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  wingName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addFlatButton: {
    marginTop: 10,
    backgroundColor: "#FFBF00",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  addFlatButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  flatsContainer: {
    marginTop: 10,
  },
  flatContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 3,
  },
  flatImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  flatName: {
    fontSize: 16,
    flex: 1,
  },
  flatIcons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: 80,
  },
  noFlatsText: {
    textAlign: "center",
    fontStyle: "italic",
    color: "#666",
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: "#CCC",
  },
  saveButton: {
    backgroundColor: "#6699CC",
  },
  deleteButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default ManageFlats;
