import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Button } from "react-native";
import { ListItem, Avatar } from "react-native-elements";

const ManageTenants = () => {
  const [activeTenants, setActiveTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActiveTenants();
  }, []);

  const fetchActiveTenants = async () => {
    try {
      const response = await fetch(
        "https://stock-management-system-server-6mja.onrender.com/api/tenants/active-tenants"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setActiveTenants(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching active tenants:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const renderTenantItem = ({ item }) => (
    <ListItem bottomDivider>
      <Avatar
        rounded
        source={{ uri: item.profile_picture_url }} // Assuming you have profile_picture_url in your tenant data
      />
      <ListItem.Content>
        <ListItem.Title>{item.name}</ListItem.Title>
        <ListItem.Subtitle>{item.flat_id}</ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
        <Button title="Retry" onPress={fetchActiveTenants} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Active Tenants</Text>
      <FlatList
        data={activeTenants}
        keyExtractor={(item) => item._id}
        renderItem={renderTenantItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default ManageTenants;
