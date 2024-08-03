import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import HomeScreen from './Screens/Home/HomeScreen';
import LoginScreen from './Screens/Login/LoginScreen';
import Emptyflats from './SidebarCompo/Emptyflats';
import Flats from './SidebarCompo/Flats';
import FlatsOnRent from './SidebarCompo/FlatsOnRent.js';
import Pendingstatus from './SidebarCompo/Pendingstatus';
import Recieverent from './SidebarCompo/Recieverent';
import Room from './SidebarCompo/Room';
import Totalbuildings from './SidebarCompo/Totalbuildings';
import Userdetails from './SidebarCompo/Userdetails';
import Wings from './SidebarCompo/Wings';
import Expense from './SideCompo/Expense';
import ManageFlats from './SideCompo/ManageFlats';
import ManageSociety from './SideCompo/ManageSociety';
import ManageTenants from './SideCompo/ManageTenants.js';
import ManageWings from './SideCompo/ManageWings.js';
import Report from './SideCompo/Report';
import Tenant from './SideCompo/Tenant';
import RentStatus from './SideCompo/RentStatus';
import Expenses from './SideCompo/Expenses';
import AddPays from './SideCompo/AddPays';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Emptyflats" component={Emptyflats} />
        <Stack.Screen name="FlatsOnRent" component={FlatsOnRent} />
        <Stack.Screen name="Flats" component={Flats} />
        <Stack.Screen name="RentStatus" component={RentStatus} />
        <Stack.Screen name="Pendingstatus" component={Pendingstatus} />
        <Stack.Screen name="Recieverent" component={Recieverent} />
        <Stack.Screen name="Totalbuildings" component={Totalbuildings} />
        <Stack.Screen name="Room" component={Room} />
        <Stack.Screen name="ManageSociety" component={ManageSociety} />
        <Stack.Screen name="ManageWings" component={ManageWings} />
        <Stack.Screen name="ManageFlats" component={ManageFlats} />
        <Stack.Screen name="Report" component={Report} />
        <Stack.Screen name="Tenant" component={Tenant} />
        <Stack.Screen name="Expense" component={Expense} />
        <Stack.Screen name="ManageTenants" component={ManageTenants} />
        <Stack.Screen name="Wings" component={Wings} />
        <Stack.Screen name="Userdetails" component={Userdetails} />
        <Stack.Screen name="Expenses" component={Expenses} />
        <Stack.Screen name="AddPays" component={AddPays} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
