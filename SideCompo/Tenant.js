import { MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Tenant = () => {
  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [base64Pdf, setBase64Pdf] = useState(null);
  const [pdfUri, setPdfUri] = useState(null);
  const [showPdf, setShowPdf] = useState(false);
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await fetch(
          "https://stock-management-system-server-6mja.onrender.com/api/tenants"
        );
        const result = await response.json();
        if (response.ok) {
          setTenants(result);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  const createPDF = async (tenant) => {
    try {
      const html = `
      <html>
        <head>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
            }
            table, th, td {
              border: 1px solid black;
            }
            th, td {
              padding: 15px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
          </style>
        </head>
        <body>
          <h1>Tenant Details</h1>
          <table>
            <tr>
              <th>Field</th>
              <th>Value</th>
            </tr>
            <tr>
              <td>Name</td>
              <td>${tenant.name}</td>
            </tr>
            <tr>
              <td>Phone Number</td>
              <td>${tenant.ph_no}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>${tenant.emailId}</td>
            </tr>
            <tr>
              <td>Age</td>
              <td>${tenant.age}</td>
            </tr>
            <tr>
              <td>Gender</td>
              <td>${tenant.gender}</td>
            </tr>
            <tr>
              <td>Maintenance Amount</td>
              <td>${tenant.maintaince}</td>
            </tr>
            <tr>
              <td>Final Rent</td>
              <td>${tenant.final_rent}</td>
            </tr>
            <tr>
              <td>Deposit</td>
              <td>${tenant.deposit}</td>
            </tr>
            <tr>
              <td>Current Meter Reading</td>
              <td>${tenant.current_meter_reading}</td>
            </tr>
            <tr>
              <td>Rent Start Date</td>
              <td>${tenant.rent_form_date}</td>
            </tr>
            <tr>
              <td>Permanent Address</td>
              <td>${tenant.permanant_address}</td>
            </tr>
            <tr>
              <td>Previous Address</td>
              <td>${tenant.previous_address}</td>
            </tr>
            <tr>
              <td>Nature of Work</td>
              <td>${tenant.nature_of_work}</td>
            </tr>
            <tr>
              <td>Working Address</td>
              <td>${tenant.working_address}</td>
            </tr>
            <tr>
              <td>Work Phone Number</td>
              <td>${tenant.work_ph_no}</td>
            </tr>
            <tr>
              <td>Family Members</td>
                            <td>${tenant.family_members}</td>
            </tr>
            <tr>
              <td>Reference Persons</td>
              <td>${tenant.reference_person1}, ${tenant.reference_person2}</td>
            </tr>
            <tr>
              <td>Agent Name</td>
              <td>${tenant.agent_name}</td>
            </tr>
            <tr>
              <td>Flat ID</td>
              <td>${tenant.flat_id}</td>
            </tr>
            <tr>
              <td>Rent Status</td>
              <td>${tenant.rent_status}</td>
            </tr>
            <tr>
              <td>Tanant Photo</td>
              <td>
              
              <img src="https://stock-management-system-server-6mja.onrender.com/${tenant.tenant_photo.replace(
                /\\/g,
                "/"
              )}"></img>
              
              </td>
            </tr>
            <tr>
              <td>Adhar Front</td>
              <td>
              
              <img src="https://stock-management-system-server-6mja.onrender.com/${tenant.adhar_front.replace(
                /\\/g,
                "/"
              )}"></img>
              
              </td>
            </tr>
            <tr>
              <td>Adhar Back</td>
              <td>
              
              <img src="https://stock-management-system-server-6mja.onrender.com/${tenant.adhar_back.replace(
                /\\/g,
                "/"
              )}"></img>
              
              </td>
            </tr>
            <tr>
              <td>Pan Photo</td>
              <td>
              
              <img src="https://stock-management-system-server-6mja.onrender.com/${tenant.pan_photo.replace(
                /\\/g,
                "/"
              )}"></img>
              
              </td>
            </tr>
            <tr>
              <td>Electricity Bill</td>
              <td>
              
              <img src="https://stock-management-system-server-6mja.onrender.com/${tenant.electricity_bill.replace(
                /\\/g,
                "/"
              )}"></img>
              
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

      const { uri } = await Print.printToFileAsync({ html });

      let downloadDirectory = FileSystem.documentDirectory;
      if (Platform.OS === "android") {
        downloadDirectory = FileSystem.cacheDirectory;
      } else if (Platform.OS === "ios") {
        downloadDirectory = FileSystem.documentDirectory;
      }
      const fileUri = `${downloadDirectory}${tenant.name}_Tenant_Details.pdf`;
      await FileSystem.moveAsync({ from: uri, to: fileUri });
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error("Error creating PDF: ", error);
      alert("Error creating PDF.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => {
          setSelectedTenant(item);
          setModalVisible(true);
        }}
      >
        <Text style={styles.itemText}>{item.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => createPDF(item)} style={styles.pdfIcon}>
        <MaterialIcons name="picture-as-pdf" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tenants List</Text>
      <FlatList
        data={tenants}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Tenant Details</Text>
          {selectedTenant && (
            <View style={styles.popup}>
              <Text style={styles.detail}>
                <Text style={styles.boldLabel}>Name:</Text>{" "}
                {selectedTenant.name}
              </Text>
              <Text style={styles.detail}>
                <Text style={styles.boldLabel}>Phone Number:</Text>{" "}
                {selectedTenant.ph_no}
              </Text>
              <Text style={styles.detail}>
                <Text style={styles.boldLabel}>Email:</Text>{" "}
                {selectedTenant.emailId}
              </Text>
              <Text style={styles.detail}>
                <Text style={styles.boldLabel}>Age:</Text> {selectedTenant.age}
              </Text>
              <Text style={styles.detail}>
                <Text style={styles.boldLabel}>Gender:</Text>{" "}
                {selectedTenant.gender}
              </Text>
              <Text style={styles.detail}>
                <Text style={styles.boldLabel}>Maintenance Amount:</Text>{" "}
                {selectedTenant.maintaince}
              </Text>
              <Text style={styles.detail}>
                <Text style={styles.boldLabel}>Final Rent:</Text>{" "}
                {selectedTenant.final_rent}
              </Text>
              <Text style={styles.detail}>
                <Text style={styles.boldLabel}>Deposit:</Text>{" "}
                {selectedTenant.deposit}
              </Text>
              <Text style={styles.detail}>
                <Text style={styles.boldLabel}>Current Meter Reading:</Text>{" "}
                {selectedTenant.current_meter_reading}
              </Text>
              <Text style={styles.detail}>
                <Text style={styles.boldLabel}>Rent Start Date:</Text>{" "}
                {selectedTenant.rent_form_date}
              </Text>
              <Text style={styles.detail}>
                <Text style={styles.boldLabel}>Permanent Address:</Text>{" "}
                {selectedTenant.permanant_address}
              </Text>
              <Text style={styles.detail}>
                <Text style={styles.boldLabel}>Previous Address:</Text>{" "}
                {selectedTenant.previous_address}
              </Text>
              <Text style={styles.detail}>
                <Text style={styles.boldLabel}>Nature of Work:</Text>{" "}
                {selectedTenant.nature_of_work}
              </Text>
              <Text style={styles.detail}>
                <Text style={styles.boldLabel}>Working Address:</Text>{" "}
                {selectedTenant.working_address}
              </Text>
              <Text style={styles.detail}>
                <Text style={styles.boldLabel}>Work Phone Number:</Text>{" "}
                {selectedTenant.work_ph_no}
              </Text>
              {/* <Text style={styles.detail}>
                <Text style={styles.boldLabel}>Family Members:</Text>{" "}
                {selectedTenant.family_members
                  ? selectedTenant.family_members.join(", ")
                  : "N/A"}
              </Text> */}
              <Text style={styles.detail}>
                <Text style={styles.boldLabel}>Reference Persons:</Text>{" "}
                {selectedTenant.reference_person1},{" "}
                {selectedTenant.reference_person2}
              </Text>
              <Text style={styles.detail}>
                <Text style={styles.boldLabel}>Agent Name:</Text>{" "}
                {selectedTenant.agent_name}
              </Text>
              <Text style={styles.detail}>
                <Text style={styles.boldLabel}>Flat ID:</Text>{" "}
                {selectedTenant.flat_id}
              </Text>
              <Text style={styles.detail}>
                <Text style={styles.boldLabel}>Rent Status:</Text>{" "}
                {selectedTenant.rent_status}
              </Text>
            </View>
          )}
          <Button
            title="Close"
            onPress={() => setModalVisible(!modalVisible)}
          />
        </View>
      </Modal>
    </View>
  );
};

export default Tenant;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  item: {
    flex: 1,
  },
  itemText: {
    fontSize: 18,
  },
  pdfIcon: {
    marginLeft: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
  },
  popup: {
    alignItems: "flex-start",
  },
  boldLabel: {
    fontWeight: "bold",
  },
});
