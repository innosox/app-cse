import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Puedes usar cualquier conjunto de iconos que prefieras
import { FontAwesome5, MaterialIcons, Ionicons  } from '@expo/vector-icons';
// Importa tus pantallas para cada pestaña
import myprofileScreen from '../screens/myProfile/myprofileScreen';
import { StyleSheet, Text, View } from 'react-native';
import ProfileScreen from "../screens/profile/profileScreen";
import EventScreen from '../screens/event/eventScreen';

const Tab = createBottomTabNavigator();

const BottomTabBarScreen = ({ navigation }) => {
  return (

      <Tab.Navigator
        initialRouteName="Perfil"
        /*tabBarOptions={{
          activeTintColor: 'blue', // Color del icono de la pestaña activa
          inactiveTintColor: 'gray', // Color del icono de la pestaña inactiva
        }}*/
        screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: { ...styles.bottomTabBarStyle }
        }}
      >
        <Tab.Screen
          name="Perfil"
          component={myprofileScreen}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarLabel: 'Inicio',
            tabBarIcon: ({ focused }) => (  
            <View style={{ alignItems: 'center' }}>     
                <MaterialIcons
                    name="home"
                    size={26}
                    color={focused ? "#0134bd" : "#D2D2D2"}
                />
                <Text style={focused ? "#0134bd" : "#D2D2D2"}>
                Inicio
                </Text>
            </View>
            )     
          }}
        />

        <Tab.Screen
          name="Event"
          component={EventScreen}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarLabel: 'Eventos',
            tabBarIcon: ({ focused }) => (  
            <View style={{ alignItems: 'center' }}>     
                <MaterialIcons name="event" size={24} color={focused ? "#0134bd" : "#D2D2D2" } />
                <Text style={focused ? "#0134bd" : "#D2D2D2" }>
                Eventos
                </Text>
            </View>
            )     
          }}
        />

        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarLabel: 'Perfil',
            tabBarIcon: ({ focused }) => (  
            <View style={{ alignItems: 'center' }}>     
                  <Ionicons
                      name="person"
                      size={22}
                      color={focused ? "#0134bd" : "#D2D2D2" }
                  />
                <Text style={focused ? "#0134bd" : "#D2D2D2" }>
                Perfil
                </Text>
            </View>
            )     
          }}
        />

      </Tab.Navigator>

  );
};

const styles = StyleSheet.create({
    bottomTabBarStyle: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 10.0 * 2.0,
        borderTopRightRadius: 10.0 * 2.0,
        height: 60.0,
        position: 'absolute',
        overflow: 'hidden',
        borderTopWidth: 0.0,
        elevation: 10.0,
        zIndex: 100,
    }
});

export default BottomTabBarScreen;
