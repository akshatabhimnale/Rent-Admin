
// screens/FlatsList.js
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";

const FlatsList = () => {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState("All");


  useEffect(() => {
    const fetchFlats = async () => {
      try {
        const response = await fetch(
          selectedType === "All"
            ? "https://stock-management-system-server-6mja.onrender.com/api/flats"
            : `https://stock-management-system-server-6mja.onrender.com/api/flats/type/${selectedType}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setFlats(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching flats:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchFlats();
  }, [selectedType]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.flatItem}
      
    >
      <Image
        source={require("../assets/images/flats.jpg")}
        style={styles.image}
      />
      <View style={styles.flatDetails}>
        <Text style={styles.flatName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error fetching data: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {["All", "1R", "1RK", "1BHK", "2BHK", "3BHK"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.tab, selectedType === type && styles.activeTab]}
            onPress={() => setSelectedType(type)}
          >
            <Text
              style={[
                styles.tabText,
                selectedType === type && styles.activeTabText,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={flats}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

export default FlatsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  tab: {
    padding: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "green",
  },
  tabText: {
    color: "#000",
    fontWeight: "bold",
  },
  activeTabText: {
    color: "green",
  },
  flatItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  flatDetails: {
    flex: 1,
  },
  flatName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});










// import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
// import React, { useState } from 'react';

// // Sample data for tenants
// const tenants = [
//   {
//     id: '1',
//     name: 'John Doe',
//     status: 'paid',
//     rentPaid: 3,
//     rentLeft: 0,
//     isLiving: true,
//     rentDate: '2024-06-15',
//     lightBill: 50,
//     maintenance: 100,
//     buildingName: 'Sunrise Apartments',
//     wingName: 'A',
//     flatName: '101',
//     leftDate: null,
//   },
//   {
//     id: '2',
//     name: 'Jane Smith',
//     status: 'unpaid',
//     rentPaid: 1,
//     rentLeft: 2,
//     isLiving: false,
//     rentDate: '2024-05-10',
//     lightBill: 60,
//     maintenance: 110,
//     buildingName: 'Sunrise Apartments',
//     wingName: 'B',
//     flatName: '202',
//     leftDate: '2024-07-01',
//   },
//   {
//     id: '3',
//     name: 'Sam Green',
//     status: 'paid',
//     rentPaid: 4,
//     rentLeft: 0,
//     isLiving: true,
//     rentDate: '2024-07-01',
//     lightBill: 45,
//     maintenance: 95,
//     buildingName: 'Sunset Apartments',
//     wingName: 'C',
//     flatName: '303',
//     leftDate: null,
//   },
//   {
//     id: '4',
//     name: 'Lisa Brown',
//     status: 'unpaid',
//     rentPaid: 2,
//     rentLeft: 1,
//     isLiving: false,
//     rentDate: '2024-04-20',
//     lightBill: 55,
//     maintenance: 120,
//     buildingName: 'Sunset Apartments',
//     wingName: 'D',
//     flatName: '404',
//     leftDate: '2024-06-15',
//   },
// ];

// const Report = () => {
//   const [view, setView] = useState('flat');

//   const renderFlatHistoryItem = ({ item }) => (
//     <View style={item.isLiving ? styles.livingContainer : styles.leftContainer}>
//       <Text style={styles.text}>Name: {item.name}</Text>
//       <Text style={styles.subText}>Building: {item.buildingName}</Text>
//       <Text style={styles.subText}>Wing: {item.wingName}</Text>
//       <Text style={styles.subText}>Flat: {item.flatName}</Text>
//       <Text style={styles.subText}>{item.isLiving ? 'Currently Living' : `Left on: ${item.leftDate}`}</Text>
//     </View>
//   );

//   const renderRentHistoryItem = ({ item }) => (
//     <View style={item.status === 'paid' ? styles.paidContainer : styles.unpaidContainer}>
//       <Text style={styles.text}>Name: {item.name}</Text>
//       <Text style={styles.subText}>Status: {item.status}</Text>
//       <Text style={styles.subText}>Rent Paid: {item.rentPaid}</Text>
//       <Text style={styles.subText}>Rent Left: {item.rentLeft}</Text>
//       <Text style={styles.subText}>Rent Date: {item.rentDate}</Text>
//       <Text style={styles.subText}>Light Bill: ${item.lightBill}</Text>
//       <Text style={styles.subText}>Maintenance: ${item.maintenance}</Text>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Tenant Report</Text>
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity style={[styles.button, view === 'flat' && styles.activeButton]} onPress={() => setView('flat')}>
//           <Text style={styles.buttonText}>Flat History</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.button, view === 'rent' && styles.activeButton]} onPress={() => setView('rent')}>
//           <Text style={styles.buttonText}>Rent History</Text>
//         </TouchableOpacity>
//       </View>
//       {view === 'flat' ? (
//         <FlatList
//           data={tenants}
//           renderItem={renderFlatHistoryItem}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={styles.listContent}
//         />
//       ) : (
//         <FlatList
//           data={tenants}
//           renderItem={renderRentHistoryItem}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={styles.listContent}
//         />
//       )}
//     </View>
//   );
// };

// export default Report;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f0f0f5',
//   },
//   header: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: '#007bff',
//     padding: 10,
//     borderRadius: 5,
//     width: '40%',
//     alignItems: 'center',
//   },
//   activeButton: {
//     backgroundColor: '#0056b3',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
//   livingContainer: {
//     backgroundColor: '#d4edda',
//     padding: 15,
//     marginBottom: 10,
//     borderRadius: 8,
//   },
//   leftContainer: {
//     backgroundColor: '#f8d7da',
//     padding: 15,
//     marginBottom: 10,
//     borderRadius: 8,
//   },
//   paidContainer: {
//     backgroundColor: '#d4edda',
//     padding: 15,
//     marginBottom: 10,
//     borderRadius: 8,
//   },
//   unpaidContainer: {
//     backgroundColor: '#f8d7da',
//     padding: 15,
//     marginBottom: 10,
//     borderRadius: 8,
//   },
//   text: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   subText: {
//     fontSize: 16,
//     color: '#666',
//   },
// });



