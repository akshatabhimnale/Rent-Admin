import React, { useState, useRef, useEffect } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Easing,
} from "react-native";
import { Bars3CenterLeftIcon, BellIcon } from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";

const propStyle = (percent) => {
  const base_degrees = -135;
  const rotateBy = base_degrees + percent * 3.6;
  return {
    transform: [{ rotateZ: `${rotateBy}deg` }],
  };
};

const renderThirdLayer = (percent) => {
  if (percent > 50) {
    return (
      <View
        style={[styles.secondProgressLayer, propStyle(percent - 50)]}
      ></View>
    );
  } else {
    return <View style={styles.offsetLayer}></View>;
  }
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const [hoveredBlock, setHoveredBlock] = useState(null);
  const [activeNavItem, setActiveNavItem] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarAnim = useRef(new Animated.Value(-250)).current;

  const toggleSidebar = () => {
    if (isSidebarOpen) {
      Animated.timing(sidebarAnim, {
        toValue: -250,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start(() => setIsSidebarOpen(false));
    } else {
      setIsSidebarOpen(true);
      Animated.timing(sidebarAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    }
  };

  const closeSidebar = () => {
    if (isSidebarOpen) {
      Animated.timing(sidebarAnim, {
        toValue: -250,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start(() => setIsSidebarOpen(false));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          societiesResponse,
          flatsResponse,
          flatsOnRentResponse,
          emptyFlatsResponse,
          rentReceivedResponse,
          rentPendingResponse,
        ] = await Promise.all([
          fetch(
            "https://stock-management-system-server-6mja.onrender.com/api/societies/count"
          ),
          fetch(
            "https://stock-management-system-server-6mja.onrender.com/api/flats/count"
          ),
          fetch(
            "https://stock-management-system-server-6mja.onrender.com/api/flats/on-rent"
          ),
          fetch(
            "https://stock-management-system-server-6mja.onrender.com/api/flats/vaccant"
          ),
          fetch(
            "https://stock-management-system-server-6mja.onrender.com/api/tenants/rent-received"
          ),
          fetch(
            "https://stock-management-system-server-6mja.onrender.com/api/tenants/rent-pending"
          ),
        ]);

        const societiesText = await societiesResponse.text();
        const flatsText = await flatsResponse.text();
        const flatsOnRentText = await flatsOnRentResponse.text();
        const emptyFlatsText = await emptyFlatsResponse.text();
        const rentReceivedText = await rentReceivedResponse.text();
        const rentPendingText = await rentPendingResponse.text();

        console.log("societiesText:", societiesText);
        console.log("flatsText:", flatsText);
        console.log("flatsOnRentText:", flatsOnRentText);
        console.log("emptyFlatsText:", emptyFlatsText);
        console.log("rentReceivedText:", rentReceivedText);
        console.log("rentPendingText:", rentPendingText);

        const societiesData = JSON.parse(societiesText);
        const flatsData = JSON.parse(flatsText);
        const flatsOnRentData = JSON.parse(flatsOnRentText);
        const emptyFlatsData = JSON.parse(emptyFlatsText);
        const rentReceivedData = JSON.parse(rentReceivedText);
        const rentPendingData = JSON.parse(rentPendingText);

        setBlocks([
          {
            key: 1,
            label: "Total Buildings",
            value: societiesData.totalSocieties,
            maxValue: 10,
            percent: 100,
            style: styles.block1,
            screen: "Totalbuildings",
          },
          {
            key: 2,
            label: "Total Flat",
            value: flatsData.totalFlats,
            maxValue: 200,
            percent: 100,
            style: styles.block2,
            screen: "Room",
          },
          {
            key: 3,
            label: "Flat On Rent",
            value: flatsOnRentData.noOfFlatsOnRent,
            maxValue: 200,
            percent: (
              (flatsOnRentData.noOfFlatsOnRent / flatsData.totalFlats) *
              100
            ).toFixed(1),
            style: styles.block3,
            screen: "FlatsOnRent",
          },
          {
            key: 4,
            label: "Empty Flat",
            value: emptyFlatsData.noOfVaccantFlats,
            maxValue: 200,
            percent: (
              (emptyFlatsData.noOfVaccantFlats / flatsData.totalFlats) *
              100
            ).toFixed(1),
            style: styles.block4,
            screen: "Emptyflats",
          },
          {
            key: 5,
            label: "Pending Status",
            value: rentPendingData.noOfFlatsRentPending,
            maxValue: 10,
            percent: (
              (rentPendingData.noOfFlatsRentPending /
                flatsOnRentData.noOfFlatsOnRent) *
              100
            ).toFixed(1),
            style: styles.block5,
            screen: "Pendingstatus",
          },
          {
            key: 6,
            label: "Month Rent Received",
            value: rentReceivedData.noOfFlatsRentReceived,
            maxValue: 10,
            percent: (
              (rentReceivedData.noOfFlatsRentReceived /
                flatsOnRentData.noOfFlatsOnRent) *
              100
            ).toFixed(1),
            style: styles.block6,
            screen: "Recieverent",
          },
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const [blocks, setBlocks] = useState([]);

  const handleBlockPressIn = (blockNumber) => {
    setHoveredBlock(blockNumber);
    console.log("Block entered");
  };

  const handleBlockPressOut = () => {
    setHoveredBlock(null);
  };

  const handleSidebarItemPress = (navItem) => {
    setActiveNavItem(navItem);
    navigation.navigate(navItem);
  };

  const handleBlockPress = (screenName, screenData) => {
    navigation.navigate(screenName, { screenData });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar}>
          <Bars3CenterLeftIcon
            color="black"
            size={30}
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
        <Text style={styles.heading}>Hi Akshata,</Text>
        <BellIcon color="black" size={30} />
      </View>

      {isSidebarOpen && (
        <TouchableWithoutFeedback onPress={closeSidebar}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}


      <Animated.View style={[styles.sidebar, { left: sidebarAnim }]}>
        <ScrollView>
          <View
          style={{
            alignItems: "center",
            marginTop: 40,
            backgroundColor: "black",
            padding: 10,
            width: "100%",
          }}
        >
          
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
            MENU
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => handleSidebarItemPress("ManageSociety")}
          style={[
            styles.sidebarItem,
            activeNavItem === "ManageSociety" && styles.activeSidebarItem,
          ]}
        >
          <Text style={styles.sidebarText}>Manage Society</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSidebarItemPress("ManageWings")}
          style={[
            styles.sidebarItem,
            activeNavItem === "ManageWings" && styles.activeSidebarItem,
          ]}
        >
          <Text style={styles.sidebarText}>Manage Wings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSidebarItemPress("ManageFlats")}
          style={[
            styles.sidebarItem,
            activeNavItem === "ManageFlats" && styles.activeSidebarItem,
          ]}
        >
          <Text style={styles.sidebarText}>Manage Flats</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSidebarItemPress("ManageTenants")}
          style={[
            styles.sidebarItem,
            activeNavItem === "ManageTenants" && styles.activeSidebarItem,
          ]}
        >
          <Text style={styles.sidebarText}>Manage Tenants</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSidebarItemPress("RentStatus")}
          style={[
            styles.sidebarItem,
            activeNavItem === "RentStatus" && styles.activeSidebarItem,
          ]}
        >
          <Text style={styles.sidebarText}>Rent Status</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSidebarItemPress("Tenant")}
          style={[
            styles.sidebarItem,
            activeNavItem === "Tenant" && styles.activeSidebarItem,
          ]}
        >
          <Text style={styles.sidebarText}>Tenant Details</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          onPress={() => handleSidebarItemPress("AddPays")}
          style={[
            styles.sidebarItem,
            activeNavItem === "AddPays" && styles.activeSidebarItem,
          ]}
        >
          <Text style={styles.sidebarText}>Add Pays</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          onPress={() => handleSidebarItemPress("Expenses")}
          style={[
            styles.sidebarItem,
            activeNavItem === "Expenses" && styles.activeSidebarItem,
          ]}
        >
          <Text style={styles.sidebarText}>Update Pays</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleSidebarItemPress("Report")}
          style={[
            styles.sidebarItem,
            activeNavItem === "Report" && styles.activeSidebarItem,
          ]}
        >
          <Text style={styles.sidebarText}>Flat Type</Text>
        </TouchableOpacity></ScrollView>
      </Animated.View>
     

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <View style={styles.admin}>
            <Text style={styles.subheading}>
              All Properties At One Place, See Details.
            </Text>
            <Text style={styles.date}>{new Date().toDateString()}</Text>
          </View>

          {blocks.map((block) => {
            let firstProgressLayerStyle;
            if (block.percent > 50) {
              firstProgressLayerStyle = propStyle(50);
            } else {
              firstProgressLayerStyle = propStyle(block.percent);
            }

            return (
              <TouchableOpacity
                key={block.key}
                style={[
                  styles.block,
                  hoveredBlock === block.key
                    ? styles.hoveredBlock
                    : block.style,
                ]}
                onPress={() => handleBlockPress(block.screen, block.screenData)}
                onPressIn={() => handleBlockPressIn(block.key)}
                onPressOut={handleBlockPressOut}
              >
                <View style={styles.spinnerContainer}>
                  <View style={styles.cont}>
                    <View
                      style={[
                        styles.firstProgressLayer,
                        firstProgressLayerStyle,
                      ]}
                    ></View>
                    {renderThirdLayer(block.percent)}
                    <Text style={styles.display}>{block.percent}%</Text>
                  </View>
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.textl}>{block.label}</Text>
                  <Text style={styles.textv}>{block.value}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    backgroundColor: "#ffffff",
    padding: 10,
  },
  content: {
    backgroundColor: "#ffffff",
    padding: 20,
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "flex-start",
    gap: 15,
    marginBottom: 40,
  },
  textl: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subheading: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  date: {
    fontSize: 14,
    color: "#999",
    marginBottom: 20,
  },
  textv: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  addtext: {
    fontSize: 25,
    fontWeight: "bold",
  },
  container: {
    backgroundColor: "#ffffff",
    padding: 0,
    alignItems: "center",
  },
  block: {
    height: 170,
    width: "90%",
    backgroundColor: "#7F00FF",
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 35,
    elevation: 20,
    shadowOpacity: 1.3,
    shadowRadius: 2,
  },
  block1: {
    backgroundColor: "#CCCCFF",
  },
  block2: {
    backgroundColor: "#ade6d8",
  },
  block3: {
    backgroundColor: "#ADD8E6",
  },
  block4: {
    backgroundColor: "#FBCEB1",
  },
  block5: {
    backgroundColor: "#e6d8ad",
  },
  block6: {
    backgroundColor: "#FFC0CB",
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 2,
    alignItems: "flex-end",
    color: "white",
  },
  cont: {
    width: 100,
    height: 100,
    borderWidth: 10,
    borderRadius: 60,
    borderColor: "#FAF9F6",
    justifyContent: "center",
    alignItems: "center",
    borderLeftColor: "white",
    borderBottomColor: "white",
    borderRightColor: "#3498db",
    borderTopColor: "#3498db",
  },
  offsetLayer: {
    width: 200,
    height: 200,
    position: "absolute",
    borderWidth: 20,
    borderRadius: 100,
    borderLeftColor: "transparent",
    borderBottomColor: "transparent",
    borderRightColor: "white",
    borderTopColor: "blue",
    transform: [{ rotateZ: "-135deg" }],
  },
  display: {
    position: "absolute",
    fontSize: 25,
    fontWeight: "bold",
    color: "white",
  },
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: "#ffffff",
    padding: 20,
    zIndex: 10,
    elevation: 10,
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 5,
  },
  sidebarItem: {
    padding: 7,
    marginVertical: 5,
    borderRadius: 20,
    justifyContent: "center",
  },
  activeSidebarItem: {
    backgroundColor: "#ADD8E6",
  },
  sidebarText: {
    fontSize: 16,
    marginVertical: 15,
  },
  hoveredBlock: {
    backgroundColor: "#FFA07A",
  },
});
