import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './Screens/Login/LoginScreen';
import RegisterScreen from './Screens/Register/RegisterScreen';
import HomeScreen from './Screens/Home/HomeScreen';
import Emptyflats from './SidebarCompo/Emptyflats';
import Flats from './SidebarCompo/Flats';
import Pendingstatus from './SidebarCompo/Pendingstatus';
import Recieverent from './SidebarCompo/Recieverent';
import Room from './SidebarCompo/Room';
import Totalbuildings from './SidebarCompo/Totalbuildings';


const StackNavigate = () => {
    const Stack = createNativeStackNavigator();
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}}/>
          <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}}/>
          <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown:false}}/>
          <Stack.Screen name="Emptyflats" component={Emptyflats} />
        <Stack.Screen name="Flats" component={Flats} />
        <Stack.Screen name="Pendingstatus" component={Pendingstatus} />
        <Stack.Screen name="Recieverent" component={Recieverent} />
        <Stack.Screen name="Room" component={Room} />
        <Stack.Screen name="Totalbuildings" component={Totalbuildings} />
        </Stack.Navigator>
      </NavigationContainer>
    )
}

export default StackNavigate

const styles = StyleSheet.create({})