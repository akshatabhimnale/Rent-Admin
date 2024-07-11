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

const Room = () => {
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
    <View style={styles.flatItem}>
      <Image
        source={require("../assets/images/flats.jpg")}
        style={styles.image}
      />
      <View style={styles.flatDetails}>
        <Text style={styles.flatName}>{item.name}</Text>
      </View>
    </View>
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

export default Room;

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
