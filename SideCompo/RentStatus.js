import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Button,
  ScrollView,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

const RentStatus = () => {
  const [tenants, setTenants] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState("");
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchActiveTenants = () => {
    fetch("https://stock-management-system-server-6mja.onrender.com/api/tenants?tenant_status=Active")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTenants(data);
        } else {
          console.error("API response is not an array:", data);
          setTenants([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching tenants:", error);
        setTenants([]);
      });
  };

  useEffect(() => {
    fetchActiveTenants(); // Fetch active tenants on component mount
  }, []);

  const handleAction = (tenant, action) => {
    setSelectedTenant(tenant);
    if (action === "paid") {
      setModalMessage(`Did ${tenant.name} pay rent?`);
    } else {
      setModalMessage(`Do you want to deactivate ${tenant.name}?`);
    }
    setConfirmAction(action);
    setModalVisible(true);
  };

  const handleConfirmAction = (response) => {
    setModalVisible(false);
    if (confirmAction === "paid" && response) {
      fetch(`https://stock-management-system-server-6mja.onrender.com/api/tenants/${selectedTenant._id}/rent-paid`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Rent marked as paid") {
            setTenants((prevTenants) =>
              prevTenants.map((tenant) =>
                tenant._id === selectedTenant._id ? { ...tenant, rentPaid: true } : tenant
              )
            );
            setSuccessMessage(`${selectedTenant.name} has paid the rent.`);
            setSuccessModalVisible(true);
          } else {
            console.error("Error marking rent as paid:", data);
          }
        })
        .catch((error) => {
          console.error("Error marking rent as paid:", error);
        });
    } else if (confirmAction === "deactive" && response) {
      fetch(`https://stock-management-system-server-6mja.onrender.com/api/tenants/${selectedTenant._id}/deactive`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Tenant deactivated") {
            setTenants((prevTenants) => prevTenants.filter((tenant) => tenant._id !== selectedTenant._id));
          } else {
            console.error("Error updating tenant status:", data);
          }
        })
        .catch((error) => {
          console.error("Error updating tenant status:", error);
        });
    }
    setSelectedTenant(null);
  };

  const closeSuccessModal = () => {
    setSuccessModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Rent Status</Text>
      {tenants.map((tenant) => (
        <View key={tenant._id} style={styles.tenantContainer}>
          <Image
            source={tenant.gender === "female" ? require("../assets/images/female.png") : require("../assets/images/male.png")}
            style={styles.tenantImage}
          />
          <Text style={styles.tenantName}>{tenant.name}</Text>
          <View style={styles.iconsContainer}>
            <TouchableOpacity onPress={() => handleAction(tenant, "paid")}>
              <AntDesign name="check" size={30} color="green" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleAction(tenant, "deactive")}>
              <AntDesign name="close" size={30} color="red" />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {selectedTenant && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <View style={styles.modalButtons}>
              <Button title={confirmAction === "paid" ? "Yes" : "Deactive"} onPress={() => handleConfirmAction(true)} />
              <Button title={confirmAction === "paid" ? "No" : "Cancel"} onPress={() => handleConfirmAction(false)} />
            </View>
          </View>
        </Modal>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={closeSuccessModal}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{successMessage}</Text>
          <Button title="OK" onPress={closeSuccessModal} />
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  tenantContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  tenantImage: {
    width: 50,
    height: 70,
    borderRadius: 25,
    marginRight: 10,
  },
  tenantName: {
    flex: 1,
    fontSize: 18,
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 25,
    marginLeft: 20,
  },
  modalView: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 290,
    marginLeft: 20,
    marginRight: 20,
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
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "70%",
  },
});

export default RentStatus;
