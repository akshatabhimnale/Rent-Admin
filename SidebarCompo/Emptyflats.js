import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";

const EmptyFlats = () => {
  const [vacantFlats, setVacantFlats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVacantFlats = async () => {
      try {
        const response = await fetch(
          "https://stock-management-system-server-6mja.onrender.com/api/flats/vaccant"
        );
        const data = await response.json();
        console.log(data); // Log the response data
        setVacantFlats(data); // Set the array of vacant flats
        setLoading(false);
      } catch (error) {
        console.error("Error fetching vacant flats:", error);
        setLoading(false);
      }
    };

    fetchVacantFlats();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.flatItem}>
      <Image
        source={require("../assets/images/flats.jpg")}
        style={styles.image}
      />
      <View style={styles.flatDetails}>
        <Text style={styles.flatName}>{item.name}</Text>
        <Text style={styles.flatStatus}>Vacant</Text>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={vacantFlats}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

export default EmptyFlats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  flatStatus: {
    fontSize: 14,
    color: "green",
  },
});
