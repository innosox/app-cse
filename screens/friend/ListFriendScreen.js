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
import moment from "moment/moment";

const { height } = Dimensions.get('window');

const ListFriendScreen = ({ navigation }) => {

    const [isLoading, setIsLoading] = useState(false);
    const Tab = createMaterialTopTabNavigator();
    const [friends, setFriends] = useState([]); 
    const [friendPending, setFriendPending] = useState([]); 
    const [friendAccept, setFriendAccept] = useState([]); 


    const Friends = () => (
      
      <View style={{ flex: 1, marginBottom: 10, padding: 5  }}>
        <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
        >
        <View style={styles.tabFriend}>
          <Text style={{ textAlign: 'center', margin: Sizes.fixPadding * 2.0, ...Fonts.blackColor20Bold }}>
            Mis amigos
          </Text>
          <Ionicons name="add-circle" size={40} color="black" onPress={() => navigation.push('SearchFriend')}/>
        </View>
        {friends.map((contact) => (
        <View  style={styles.card}>
          <View style={styles.contactContainer} key={contact?.soci_id_recep}>
              {contact?.soci_id_recep ? (
              <Image 
                //source={`https://socioemelec.com/fotos/socios/foto_socio_{contact.soci_id_recep}.jpg`} 
                source={{ uri: `https://socioemelec.com/fotos/socios/foto_socio_${contact?.soci_id_recep}.jpg` }}
                style={styles.contactImage} />
              ) : (
                <Image
                source={require('../../assets/images/avatar.jpg')}
                //source={{uri: 'asset:/favicon.png'}}
                style={styles.contactImage} />
              )}
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact?.soci_ami_nom}</Text>
              {contact?.soci_desd ? (
                <Text style={styles.contactDescription}>
                  Socio desde: {moment(contact?.soci_desd).format('YYYY/MM')}
                </Text>
              ) : (
                <Text style={styles.contactDescription}>
                  Fecha no disponible
                </Text>
              )}
            </View>
          </View>
        </View>
        ))}
        </ScrollView>
      </View>
      
    );

    const FriendPending = () => (
      <View style={{ flex: 1, marginBottom: 10, padding: 5  }}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }>
        <Text style={{ textAlign: 'left', margin: Sizes.fixPadding * 2.0, ...Fonts.blackColor20Bold }}>
          Solicitudes por confirmar
        </Text>
        {friendPending.map((contact) => (
        <View  style={styles.card}>
          <View style={styles.contactContainer} key={contact?.soci_id_recep}>
            <Image 
            source={{ uri: `https://socioemelec.com/fotos/socios/foto_socio_${contact?.socio_receptor?.soci_id}.jpg` }}
            style={styles.contactImage} />
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact?.socio_receptor?.soci_nomb} {contact?.socio_receptor?.soci_apel} {contact?.socio_receptor?.soci_id}</Text>
              {/* Validación para la fecha */}
              {contact?.socio_receptor.soci_desd ? (
                <Text style={styles.contactDescription}>
                  Socio desde: {moment(contact?.socio_receptor?.soci_desd).format('YYYY/MM')}
                </Text>
              ) : (
                <Text style={styles.contactDescription}>
                  Fecha no disponible
                </Text>
              )}
              {/* Fin de la validación */}
            </View>
          </View>
        </View>
        ))}
        </ScrollView>
      </View>
    );

    const acceptFriend = async (soci_ami_id) => {    
      try { 
          const storedToken = await AsyncStorage.getItem('access_token');
          if (storedToken ) {
          setIsLoading(true);
            const saldoData = {soci_ami_id: soci_ami_id};
            const response = await mainApi.post('/solicitud-aceptar/amigo', saldoData, {
              headers: {
                  ...(storedToken && { Authorization: `Bearer ${storedToken}` })
              }
            })
            setIsLoading(false);
            Alert.alert('Solicitud Aceptada', 'Ya estas conectado con tu nuevo amigo', [
                {
                    text: 'OK',
                    onPress: () => {
                      handleRefresh();
                    }
                }
            ]);

          }
      } catch (error) {
          Alert.alert('Ha ocurrido un error', `${error}`);    
          console.log(error)
      }
    }

    const deleteFriend = async (soci_ami_id) => {    
      try { 
          const storedToken = await AsyncStorage.getItem('access_token');
          if (storedToken ) {
            setIsLoading(true);
              const url = `/solicitud-eliminar/amigo/${soci_ami_id}`;
              console.log(url)
              await mainApi.delete(url, {
              headers: {
                  ...(storedToken && { Authorization: `Bearer ${storedToken}` })
              }
            })
            setIsLoading(false);
            Alert.alert('Solicitud Eliminada', 'He ha eliminado correctamente la solicitud de amistad', [
                {
                    text: 'OK',
                    onPress: () => {
                      handleRefresh();
                    }
                }
            ]);
          }
      } catch (error) {
          Alert.alert('Ha ocurrido un error', `${error}`);    
          console.log(error)
      }
    }

    const FriendsToAccept = () => (
      <View style={{ flex: 1, marginBottom: 10, padding: 5  }}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }>
        <Text style={{ textAlign: 'left', margin: Sizes.fixPadding * 2.0, ...Fonts.blackColor20Bold }}>
          Solicitudes de amistad
        </Text>
        {friendAccept.map((contact) => (
        <View  style={styles.card}>
          <View style={styles.contactContainer} key={contact?.soci_id_emi}>
            <Image 
            source={{ uri: `https://socioemelec.com/fotos/socios/foto_socio_${contact?.socio_emisor?.soci_id}.jpg` }}
            style={styles.contactImage} />
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{contact?.socio_emisor?.soci_nomb} {contact?.socio_emisor?.soci_apel}</Text>
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    disabled={isLoading} 
                    style={[styles.button, styles.confirmButton]}
                    onPress={() => acceptFriend(contact.soci_ami_id)}
                  >
                    <Text style={styles.buttonText}>Confirmar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={isLoading} 
                    style={[styles.button, styles.deleteButton]}
                    onPress={() => deleteFriend(contact.soci_ami_id)}
                  >
                    <Text>Eliminar</Text>
                  </TouchableOpacity>
                </View>
            </View>
          </View>
        </View>
        ))}
        </ScrollView>
      </View>
    );

    const getFriends = async () => {    
      try { 

          const storedToken = await AsyncStorage.getItem('access_token');
          if (storedToken ) {
            const url = `/amigo`;
            const response = await mainApi.get(url, {
              headers: {
                  ...(storedToken && { Authorization: `Bearer ${storedToken}` })
              }
            })
            const dataFriend = response.data;
            setFriends(dataFriend);
          }
      } catch (error) {
          Alert.alert('Ha ocurrido un error', `${error}`);    
          console.log(error)
      }
    }

    const getFriendPending = async () => {    
      try { 

          const storedToken = await AsyncStorage.getItem('access_token');
          if (storedToken ) {
            const url = `/solicitud-por-confirmar/amigo`;
            const response = await mainApi.get(url, {
              headers: {
                  ...(storedToken && { Authorization: `Bearer ${storedToken}` })
              }
            })
            const dataFriendPending = response.data;
            setFriendPending(dataFriendPending);
          }
      } catch (error) {
          Alert.alert('Ha ocurrido un error', `${error}`);    
          console.log(error)
      }
    }
    
    const getFriendAccep = async () => {    
      try { 

          const storedToken = await AsyncStorage.getItem('access_token');
          if (storedToken ) {
            const url = `/solicitud-amistad/amigo`;
            const response = await mainApi.get(url, {
              headers: {
                  ...(storedToken && { Authorization: `Bearer ${storedToken}` })
              }
            })
            const dataFriendAcceppt = response.data;
            setFriendAccept(dataFriendAcceppt);
          }
      } catch (error) {
          Alert.alert('Ha ocurrido un error', `${error}`);    
          console.log(error)
      }
    }

    useEffect(() => {
      getFriends();
      getFriendPending();
      getFriendAccep();
    }, []);

    const [refreshing, setRefreshing] = useState(false);
    const handleRefresh = () => {
      // Realiza la lógica de actualización aquí (por ejemplo, llama a tus funciones obtenerDataUsuario y obtenerDeuda)
      getFriends();
      getFriendPending();
      getFriendAccep();
    };

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
            /* 
            tabBarOptions={{
              activeTintColor: Colors.primaryColor,
              inactiveTintColor: 'gray',
              labelStyle: {
                fontSize: 14,
                fontWeight: 'bold',
              },
              style: {backgroundColor: 'white',}
            }} 
          */
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
      width: 75,
      height: 75,
      borderRadius: 45,
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
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    button: {
      borderRadius: 5,
      paddingVertical: 8,
      paddingHorizontal: 15,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: Sizes.fixPadding + 25.0,
      shadowColor: Colors.primaryColor,
      elevation: 5.0,
      flex: 1, marginHorizontal: Sizes.fixPadding,
      paddingVertical: Sizes.fixPadding,
      alignItems: 'center',
      justifyContent: 'center',
    },
    confirmButton: {
      backgroundColor: Colors.primaryColor,
      marginRight: 5,
      width:'50%'
    },
    deleteButton: {
      backgroundColor: '#E1E1E1',
      width:'50%',
      color: 'black',
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 14,
    },


});

export default ListFriendScreen;