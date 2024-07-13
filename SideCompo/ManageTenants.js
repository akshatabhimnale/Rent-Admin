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

const ManageTenants = ({ navigation }) => {
  const [tenantsByFlat, setTenantsByFlat] = useState({});
  const [tenants, setTenants] = useState([]);
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
  const [selectedTenant, setSelectedTenant] = useState(null);

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

  const fetchTenantsForFlat = (flatId) => {
    if (tenantsByFlat[flatId]) return; // Prevent fetching if already loaded
    fetch(
      `https://stock-management-system-server-6mja.onrender.com/api/tenants/tenants-by-flat/${flatId}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setTenantsByFlat((prev) => ({ ...prev, [flatId]: data }));
      })
      .catch((error) => {
        console.error("Error fetching tenants:", error);
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

  const handleEditTenant = (tenant) => {
    setSelectedTenant(tenant);
    setEditModalVisible(true);
  };

  const handleDeleteTenant = (tenant) => {
    setSelectedTenant(tenant);
    setDeleteModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Manage Tenants</Text>
      {fetchError && (
        <Text style={styles.errorText}>Error fetching data: {fetchError}</Text>
      )}

      <ScrollView contentContainerStyle={styles.scrollView}>
        {societies.map((society) => (
          <View key={society._id} style={styles.societyContainer}>
            <View style={styles.societyHeader}>
              <Text style={styles.societyName}>
                {loadingWings ? (
                  <ActivityIndicator size="large" color="#6699CC" />
                ) : wingsBySociety[society._id]?.length === 0 ? (
                  <Text>No wings for this Society</Text>
                ) : (
                  wingsBySociety[society._id]?.map((wing) => (
                    <View key={wing._id}>
                      <View style={styles.flatListingContainer}>
                        {wing.flats && wing.flats.length > 0 ? (
                          <View style={styles.flatsContainer}>
                            {wing.flats.map((flat) => {
                              fetchTenantsForFlat(flat._id); // Fetch tenants for the current flat
                              return (
                                <View
                                  key={flat._id}
                                  style={styles.flatContainer}
                                >
                                  <Text style={styles.flatName}>
                                    {society.name}/{wing.name}/{flat.name}
                                  </Text>
                                  <View style={styles.tenantListingContainer}>
                                    {/* Tenant listing */}
                                    {tenantsByFlat[flat._id]?.map((tenant) => (
                                      <View
                                        key={tenant._id}
                                        style={{
                                          flexDirection: "row",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                          width: "100%",
                                          shadowColor: "#000",
                                          shadowOpacity: 0.1,
                                          shadowOffset: { width: 0, height: 1 },
                                          shadowRadius: 3,
                                          elevation: 5,
                                        }}
                                      >
                                        <View
                                          style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            margin: 5,
                                          }}
                                        >
                                          <Image
                                            source={
                                              tenant.gender === "female"
                                                ? require("../assets/images/female.png")
                                                : require("../assets/images/male.png")
                                            }
                                            style={styles.image}
                                          />
                                          <Text>{tenant.name}</Text>
                                        </View>
                                        <View style={styles.flatIcons}>
                                          <TouchableOpacity
                                            onPress={() =>
                                              handleEditTenant(tenant)
                                            }
                                          >
                                            <FontAwesome
                                              name="edit"
                                              size={30}
                                              color="#6699CC"
                                            />
                                          </TouchableOpacity>
                                          <TouchableOpacity
                                            onPress={() =>
                                              handleDeleteTenant(tenant)
                                            }
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
                                  <View style={styles.divider} />
                                </View>
                              );
                            })}
                          </View>
                        ) : (
                          <Text style={styles.noFlatsText}>
                            No Flats Available
                          </Text>
                        )}
                      </View>
                    </View>
                  ))
                )}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Edit Tenant Modal */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Tenant Details</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={selectedTenant?.name}
              onChangeText={(text) =>
                setSelectedTenant({ ...selectedTenant, name: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={selectedTenant?.phoneNumber}
              onChangeText={(text) =>
                setSelectedTenant({ ...selectedTenant, phoneNumber: text })
              }
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
                onPress={() => {
                  // Save changes logic here
                  setEditModalVisible(false);
                }}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Tenant Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Tenant</Text>
            <Text>Are you sure you want to delete this tenant?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={() => {
                  // Delete tenant logic here
                  setDeleteModalVisible(false);
                }}
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
    backgroundColor: "#fff",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 16,
  },
  societyContainer: {
    marginBottom: 20,
  },
  societyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
  },
  societyName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  flatListingContainer: {
    marginVertical: 10,
  },
  flatsContainer: {
    marginVertical: 5,
  },
  flatContainer: {
    marginBottom: 5,
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 5,
  },
  flatName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  tenantListingContainer: {
    marginVertical: 10,
  },
  image: {
    width: 50,
    height: 70,
    marginRight: 10,
  },
  flatIcons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  noFlatsText: {
    color: "#888",
    fontStyle: "italic",
  },
  scrollView: {
    paddingBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  saveButton: {
    backgroundColor: "#6699CC",
  },
  deleteButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ManageTenants;
