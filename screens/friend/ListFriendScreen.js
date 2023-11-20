import React, { useState, useEffect } from "react";
import { SafeAreaView, View, StatusBar, TextInput, TouchableOpacity, Dimensions, ScrollView, Image, 
    StyleSheet, Text, FlatList, Alert, Button, Animated } 
from "react-native";

import { Colors, Fonts, Sizes, } from "../../constants/styles";
import { MaterialIcons, FontAwesome, Ionicons   } from '@expo/vector-icons';
import { useColorScheme, useWindowDimensions   } from "react-native";

import { RefreshControl } from "react-native";
import { mainApi, mainApiEvent } from "../../api/mainApi";

import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TabView, SceneMap } from 'react-native-tab-view';


import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';


const { height } = Dimensions.get('window');

const ListFriendScreen = ({ navigation }) => {

    const [isLoading, setIsLoading] = useState(false);
    const Tab = createMaterialTopTabNavigator();

    const contacts = [
      {
        id: 1,
        name: 'Jose Pillegi',
        description: 'Socio desde 2017/01',
        image: {uri: 'https://pbs.twimg.com/profile_images/477815932723929088/TNR3pbtd_400x400.jpeg'} 
      },
      {
        id: 2,
        name: 'Marlon Vera',
        description: 'Socio desde 2020/03',
        image: {uri: 'https://dmxg5wxfqgb4u.cloudfront.net/2023-08/VERA_MARLON_08-19.png'}

      },
      {
        id: 3,
        name: 'Daniel Noboa',
        description: 'Socio desde 2017/06',
        //image: require('../../assets/images/users/fotoperfil.jpeg'), // Ruta de la imagen
        image: {uri: 'https://pbs.twimg.com/profile_images/1661543581067124737/0jrto2L3_400x400.jpg'}
      }
    ];

    const Friends = () => (
      
      <View style={{ flex: 1, marginBottom: 10, padding: 5  }}>
        <View style={styles.tabFriend}>
          <Text style={{ textAlign: 'center', margin: Sizes.fixPadding * 2.0, ...Fonts.blackColor20Bold }}>
            Mis amigos
          </Text>
          <Ionicons name="add-circle" size={40} color="black" onPress={() => navigation.push('SearchFriend')}/>
        </View>
        {contacts.map((contact) => (
        <View  style={styles.card}>
          <View style={styles.contactContainer} key={contact.id}>
            <Image source={contact.image} style={styles.contactImage} />
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactDescription}>{contact.description}</Text>
            </View>
          </View>
        </View>
        ))}
      </View>
      
    );

    const FriendPending = () => (
      <View style={{ flex: 1, marginBottom: 10, padding: 5  }}>
        <Text style={{ textAlign: 'left', margin: Sizes.fixPadding * 2.0, ...Fonts.blackColor20Bold }}>
          Solicitudes por confirmar
        </Text>
        {contacts.map((contact) => (
        <View  style={styles.card}>
          <View style={styles.contactContainer} key={contact.id}>
            <Image source={contact.image} style={styles.contactImage} />
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactDescription}>{contact.description}</Text>
            </View>
          </View>
        </View>
        ))}
      </View>
    );

    const FriendsToAccept = () => (
      <View style={{ flex: 1, marginBottom: 10, padding: 5  }}>
        <Text style={{ textAlign: 'left', margin: Sizes.fixPadding * 2.0, ...Fonts.blackColor20Bold }}>
          Solicitudes de amistad
        </Text>
        {contacts.map((contact) => (
        <View  style={styles.card}>
          <View style={styles.contactContainer} key={contact.id}>
            <Image source={contact.image} style={styles.contactImage} />
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact.name}</Text>
              <Text style={styles.contactDescription}>{contact.description}</Text>
            </View>
          </View>
        </View>
        ))}
      </View>
    );


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
        <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
        <View style={{ flex: 1 }}>
          {/* CABECERA */}
          <View style={styles.headerWrapStyle}>
            <View style={styles.headerLocationInfoWrapStyle}>
              <MaterialIcons
                name="arrow-back"
                color={Colors.whiteColor}
                size={22}
                onPress={() => navigation.pop()}
              />
              <Image
                source={require('../../assets/images/users/fotoperfil.jpeg')}
                style={{ width: 50.0, height: 50.0, borderRadius: 25.0, marginLeft: 20 }}
              />
              <Text style={{ marginLeft: 15, flex: 1, ...Fonts.whiteColor16Bold }}>
                Lista Amigos
              </Text>
            </View>
          </View>
          {/* FIN DE CABECERA */}

          <Tab.Navigator
            tabBarOptions={{
              activeTintColor: Colors.primaryColor,
              inactiveTintColor: 'gray',
              labelStyle: {
                fontSize: 14,
                fontWeight: 'bold',
              },
              style: {backgroundColor: 'white',},
            }}
          >
            <Tab.Screen name="AMIGOS" component={Friends} />
            <Tab.Screen name="PENDIENTE" component={FriendPending} />
            <Tab.Screen name="ACEPTAR" component={FriendsToAccept} />
          </Tab.Navigator>


        </View>

      </SafeAreaView>
    )

}

const styles = StyleSheet.create({      
    headerWrapStyle: {
        paddingBottom: 5,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primaryColor,
        borderBottomLeftRadius: Sizes.fixPadding + 5.0,
        borderBottomRightRadius: Sizes.fixPadding + 5.0,
    },
    headerLocationInfoWrapStyle: {
        flex: 1,
        marginRight: Sizes.fixPadding,
        flexDirection: 'row',
        alignItems: 'center',
    },
    card: {
      backgroundColor: '#fff',
      //padding: 3,
      //borderRadius: 8,
      //marginVertical: 2,
      elevation: 5, // Ajusta este valor para el nivel de sombra deseado
      shadowColor: '#000', // Solo para iOS
      shadowOffset: { width: 0, height: 2 }, // Solo para iOS
      shadowOpacity: 0.2, // Solo para iOS
      shadowRadius: 4, // Solo para iOS
    },
    contactContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
    },
    contactImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 30,
    },
    contactInfo: {
      flex: 1,
    },
    contactName: {
      fontSize: 18,
    },
    contactDescription: {
      color: 'gray',
    },
    tabFriend:{
      flexDirection: 'row',
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginBottom: 5,
    }

});

export default ListFriendScreen;