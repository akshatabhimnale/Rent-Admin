import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';

import HomeScreen from './Screens/Home/HomeScreen';
import LoginScreen from './Screens/Login/LoginScreen';
import RegisterScreen from './Screens/Register/RegisterScreen';
import Emptyflats from './SidebarCompo/Emptyflats';
import Flats from './SidebarCompo/Flats';
import Pendingstatus from './SidebarCompo/Pendingstatus';
import Recieverent from './SidebarCompo/Recieverent';
import Room from './SidebarCompo/Room';
import Totalbuildings from './SidebarCompo/Totalbuildings';
import Manage from './SideCompo/Manage';
import Report from './SideCompo/Report';
import Tenant from './SideCompo/Tenant';
import Expense from './SideCompo/Expense';
import Logout from './SideCompo/Logout';
import Wings from './SidebarCompo/Wings';
import Userdetails from './SidebarCompo/Userdetails';

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        /> */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Emptyflats" component={Emptyflats} />
        <Stack.Screen name="Flats" component={Flats} />
        <Stack.Screen name="Pendingstatus" component={Pendingstatus} />
        <Stack.Screen name="Recieverent" component={Recieverent} />
        <Stack.Screen name="Totalbuildings" component={Totalbuildings} />
        <Stack.Screen name="Room" component={Room} />
        <Stack.Screen name="Manage" component={Manage} />
        <Stack.Screen name="Report" component={Report} />
        <Stack.Screen name="Tenant" component={Tenant} />
        <Stack.Screen name="Expense" component={Expense} />
        <Stack.Screen name="Logout" component={Logout} />
        <Stack.Screen name="Wings" component={Wings} />
        <Stack.Screen name="Userdetails" component={Userdetails} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
