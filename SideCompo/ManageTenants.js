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
         setTenants(data);
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
                                <View key={flat._id} style={styles.flatContainer}>
                                  <Text style={styles.flatName}>{society.name}/{wing.name}/{flat.name}</Text>
                                  {/* Tenant listing */}
                                  {tenants.length > 0 && tenants.map((tenant) => (
                                    <Text key={tenant._id}>{tenant.name}</Text>
                                  ))}
                                </View>
                              );
                            })}
                          </View>
                        ) : (
                          <Text style={styles.noFlatsText}>No Flats Available</Text>
                        )}
                      </View>
                    </View>
                  ))
                )}
              </Text>
            </View>
            <View style={styles.divider} />
          </View>
        ))}
      </ScrollView>
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
    marginLeft: 10,
  },
  societyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 1,
  },
  buildingImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  societyName: {
    fontSize: 15,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#DDD",
    marginVertical: 10,
  },
  wingContainer: {
    marginBottom: 1,
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
    fontSize: 15,
    fontWeight: "bold",
  },
 
 
  flatsContainer: {
    marginTop: 10,
  },
  flatContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
   
  },
  flatImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  flatName: {
  fontWeight:"bold",
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

export default ManageTenants;
