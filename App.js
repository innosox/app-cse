import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LogBox } from 'react-native';

import bottomTabBarScreen from "./components/bottomTabBarScreen";

import editProfileScreen from "./screens/editProfile/editProfileScreen";

import loginScreen from "./screens/auth/loginScreen";
import myprofileScreen from './screens/myProfile/myprofileScreen';
import qrprofileScreen from './screens/myProfile/qrprofileScreen';
import PaymentScreen from './screens/payment/paymentScreen';
import AddCardScreen from './screens/payment/addCardScreen';
import EventScreen from './screens/event/eventScreen';
import LocationScreen from './screens/event/locationScreen';
import PayTicketScreen from './screens/event/payTicketScreen';
import MyTicketScreen from './screens/event/myTicketScreen';

import SearchFriendScreen from './screens/friend/searchFriendScreen';
import ListFriendScreen from './screens/friend/ListFriendScreen';


LogBox.ignoreAllLogs();
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
          screenOptions={{
            headerBackTitle: "",
            //headerShown: false, //para mostrar una cabecera
        }}
      >
        
        <Stack.Screen 
          options={{ headerShown: false }}
          name="Login" component={loginScreen} 
          
        />
        <Stack.Screen options={{ headerShown: false }} name="BottomTabBar" component={bottomTabBarScreen}  />


        <Stack.Screen options={{ headerShown: false }} name="EditProfile" component={editProfileScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Perfil" component={myprofileScreen} />
        <Stack.Screen options={{ headerShown: false }} name="MiQR" component={qrprofileScreen} />
        
        <Stack.Screen options={{ headerShown: false }} name="Payment" component={PaymentScreen} />
        <Stack.Screen options={{ headerShown: false }} name="AddCardPayment" component={AddCardScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Event" component={EventScreen} />
        <Stack.Screen options={{ headerShown: false }} name="EventLocation" component={LocationScreen} />

        <Stack.Screen options={{ headerShown: false }} name="PaymentTicket" component={PayTicketScreen} />
        <Stack.Screen options={{ headerShown: false }} name="MyTicket" component={MyTicketScreen} />

        <Stack.Screen options={{ headerShown: false }} name="SearchFriend" component={SearchFriendScreen} />

        <Stack.Screen options={{ headerShown: false }} name="ListFriend" component={ListFriendScreen} />

        
        

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;