import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

// Import the local image
import flatImage from "../assets/images/flats.jpg";

const FlatsOnRentScreen = () => {
  const [flatsOnRent, setFlatsOnRent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllottedFlats = async () => {
      try {
        const response = await fetch(
          "https://stock-management-system-server-6mja.onrender.com/api/flats/allotted"
        );
        const flatsData = await response.json();
        console.log("Fetched allotted flats:", flatsData); // Debug log
        setFlatsOnRent(flatsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching allotted flats:", error);
        setLoading(false);
      }
    };

    fetchAllottedFlats();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (flatsOnRent.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No allotted flats found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={flatsOnRent}
        keyExtractor={(item) => item._id.toString()} // Adjust key as per your flat schema
        renderItem={({ item }) => (
          <View style={styles.flatItem}>
            <Image source={flatImage} style={styles.flatImage} />
            <View style={styles.flatDetails}>
              <Text style={styles.flatName}>{item.name}</Text>
              <Text style={styles.flatRentStatus}>
                 {item.flat_status}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f8f8f8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flatItem: {
    flexDirection: "row",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  flatImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  flatDetails: {
    marginLeft: 10,
    justifyContent: "center",
  },
  flatName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  flatRentStatus: {
    fontSize: 14,
    color: "green",
  },
});

export default FlatsOnRentScreen;
