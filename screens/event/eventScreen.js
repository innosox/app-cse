import React, { useState, useEffect } from "react";
import { SafeAreaView, View, StatusBar, TextInput, TouchableOpacity, Dimensions, ScrollView, Image, StyleSheet, Text, FlatList, Alert, Button } 
from "react-native";

import { Colors, Fonts, Sizes, } from "../../constants/styles";
import { MaterialIcons, AntDesign, MaterialCommunityIcons, Entypo   } from '@expo/vector-icons';
import { ImageBackground, useColorScheme  } from "react-native";
import QRCode from 'react-qr-code';
import { RefreshControl } from "react-native";
import { mainApiEvent } from "../../api/mainApi";
import { color } from "@rneui/themed/dist/config";

const { height } = Dimensions.get('window');
import { useNavigation } from '@react-navigation/native';

const EventScreen = ({ navigation }) => {

    const [isLoading, setIsLoading] = useState(false);

    const [refreshing, setRefreshing] = useState(false);
    const [eventoError, setEventoError] = useState(false);
    const [eventoLista, setEventLista] = useState([]);
    const [getTicket, setgetTicket] = useState([]);

    const obtenerListaEvento = async () => {    
      try { 
          const response = await mainApiEvent.get('/eventos?usua_user=codeinmove&usua_pass=Cse_1929/*')
          const userDataFromAPI = response.data;
          //console.log(userDataFromAPI)
          setEventLista(userDataFromAPI);

      } catch (error) {
          console.log('error: '+error)
          setEventoError(error);
      }
  }



  useEffect(() => {
      obtenerListaEvento({})
  }, []);



    const handleRefresh = () => {
      obtenerListaEvento();
    };


    const goToLocality = (index) => {
      const objetoSeleccionado = eventoLista[index];
      //console.log(objetoSeleccionado)
      navigation.navigate('EventLocation', { objetoSeleccionado });
    };

    
    const goToMyTicket = (index) => {
      const objetoSeleccionado = eventoLista[index];
      //console.log(objetoSeleccionado)
      navigation.navigate('MyTicket', { objetoSeleccionado });
    };

    const obtenerTicketByEvent = async (even_id, client_cedu) => {
      try {
        const response = await mainApiEvent.get(`/boleto/ver/${even_id}?cliente_cedula=${client_cedu}`);
        
        if (response.status === 200 && response.data && response.data.length > 0) {
          console.log('true');
          setgetTicket(response.data);
          return true;
        } else {
          console.log('false');
          setgetTicket([]);

          return false;
        }
      } catch (error) {
        console.log('error: ' + error);
        setgetTicket([]);
        return false;
      }
    };
      

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
          <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                {/* INICIO HEADDER */}
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
                            style={{ width: 50.0, height: 50.0, borderRadius: 25.0, marginLeft: 20, }}
                        />
                        <Text style={{ marginLeft: 15, flex: 1, ...Fonts.whiteColor16Bold }}>
                        Eventos
                        </Text>
                    </View>
                </View>
                {/* FIN HEADDER */}
            </View>

                {/* Inicio de Evento */}
                {eventoLista.length > 0 ? (
                  eventoLista.map((item, index) => (
                    <View 
                    key={index}
                    activeOpacity={0.8}
                    style={[
                      styles.container
                    ]}>
                      <ImageBackground
                      source={
                        require('../../assets/images/background.jpg')
                      }
                      style={styles.cardBackground}
                      resizeMode="cover"
                      >
                      <View style={styles.cardContent} key={index} >
                        <View style={styles.teamContainer}>
                          <Text style={styles.vs}>{item?.even_nombre}</Text>
                          <Text style={styles.teamNameRight}>{item?.dia_letra} {item?.dia} DE {item?.mes}</Text>
                          <Text style={styles.teamNameHora}>{item?.hora} HRS.</Text>
                          <TouchableOpacity 
                            style={[
                                styles.buttonLocalidad
                            ]}
                            disabled={isLoading}
                            onPress={() => goToLocality(index)}
                            >
                            <View style={styles.buttonContent}>
                                <Entypo name="ticket" size={24} color="white" />
                                {isLoading ? (
                                <ActivityIndicator size="small" color="#ffffff" />
                                ) : (
                                    <Text style={styles.buttonTextLeft}> COMPRAR</Text>
                                )}
                            </View>
                          </TouchableOpacity> 



                            <TouchableOpacity
                              style={styles.buttonBoletos}
                              disabled={isLoading}
                              //onPress={() => navigation.navigate('MyTicket')}
                              onPress={() => goToMyTicket(index)}
                            >
                              <View style={styles.buttonContent}>
                                <Entypo name="ticket" size={24} color="white" />
                                {isLoading ? (
                                  <ActivityIndicator size="small" color="#ffffff" />
                                ) : (
                                  <Text style={styles.buttonTextLeft}> VER BOLETOS</Text>
                                )}
                              </View>
                            </TouchableOpacity>
                  
   


                        </View>
                      </View>

                    </ImageBackground>
                    </View>
        
                  ))
                  ) : (
                    <View style={styles.container}>
                      <Text style={styles.header}>{eventoError}</Text>
                    </View>

                  )}
                {/* fin de Evento */}

              
          </ScrollView>




        </SafeAreaView>
    )



}

const styles = StyleSheet.create({
  buttonLocalidad: {
    backgroundColor: Colors.primaryColor,
    borderColor: '#ffffff',
    borderWidth: 1,
    padding: 10,
    borderRadius: 35,
    width: '100%',
    marginTop: 20,
    marginBottom:10,
    },

    buttonBoletos: {
      backgroundColor: '#000000',
      borderColor: '#ffffff',
      borderWidth: 1,
      padding: 10,
      borderRadius: 35,
      width: '100%',
      padding: 10,
      marginTop: 20,
      marginBottom:10,
    },


    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center', // Centra icono y texto horizontalmente
  },
  buttonTextLeft: {
    color: '#fff',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 16,
},

buttonContainer: {
 
  alignItems: 'center',
},


  teamContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    color: '#fff',
    padding: 10,

  },
  teamNameLeft: {
    width: '100%',
    textAlign: 'center',
    fontSize: 18, // Tamaño de fuente
    fontWeight: 'bold', // Peso de fuente
    color: '#fff',
    padding: 10,


  },
  vs: {
    width: '100%',
    textAlign: 'center',
    fontSize: 22, // Tamaño de fuente
    fontWeight: 'bold', // Peso de fuente
    color: '#fff',
    marginTop: 10,
    marginBottom: 5,

  },
  teamNameRight: {
    width: '100%',
    textAlign: 'center',
    fontSize: 16, // Tamaño de fuente
    color: '#fff',
    marginTop:20,
  },
  teamNameHora: {
    width: '100%',
    textAlign: 'center',
    fontSize: 16, // Tamaño de fuente
    color: '#fff',
  },

  

      cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },




      
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
        padding: 10,
        borderRadius: 8,
        marginVertical: 5,
        elevation: 10, // Ajusta este valor para el nivel de sombra deseado
        shadowColor: '#000', // Solo para iOS
        shadowOffset: { width: 0, height: 2 }, // Solo para iOS
        shadowOpacity: 0.2, // Solo para iOS
        shadowRadius: 4, // Solo para iOS
        alignItems: 'center',

    },
    activeIndicator: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'green',
        padding: 10,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 8,
        width: 100,

    },
    activeText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },


    container: {
        //width: '100%',
        //aspectRatio: 1.350, // Aspect ratio of a standard credit card
        //borderRadius: 10,
        overflow: 'hidden',
        marginTop: Sizes.fixPadding,
        borderRadius: 25,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding,
      },
      containerWithoutButton: {
        aspectRatio: 1.550, // Cambia el aspect ratio cuando no hay botón "Ver Boletos"
      },
      
      cardBackground: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingVertical: 15,
      },

      cardName: {
        fontSize: 16,
        color: 'black',
        alignSelf: 'flex-start', // Align to the top left corner
      },
      cardIdentification: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'flex-start', // Align to the top left corner
        fontWeight: 'bold',
        
      },
      cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
       // alignItems: 'flex-end', // Align to the bottom right corner
      },
      cardDateLabel: {
        fontSize: 14,
        color: 'white',
      },
      cardDate: {
        fontSize: 16,
        color: 'white',
      },

      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#2269BE',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        marginTop: 24,
        color: '#FFFFFF',
        borderRadius: 15,
      },


});

export default EventScreen;