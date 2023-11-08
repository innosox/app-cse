import React, { useState, useEffect } from "react";
import { SafeAreaView, View, StatusBar, TextInput, TouchableOpacity, Dimensions, ScrollView, Image, StyleSheet, Text, FlatList, Alert } 
from "react-native";

import { Colors, Fonts, Sizes, } from "../../constants/styles";
import { MaterialIcons, AntDesign, MaterialCommunityIcons, Entypo   } from '@expo/vector-icons';
import { ImageBackground, useColorScheme  } from "react-native";
import QRCode from 'react-qr-code';
import { RefreshControl } from "react-native";
import { mainApi, mainApiEvent } from "../../api/mainApi";
import { color } from "@rneui/themed/dist/config";

const { height } = Dimensions.get('window');

import { useRoute } from '@react-navigation/native';
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LocationScreen = ({ navigation }) => {
    
    const [isLoading, setIsLoading] = useState(false);

    const [refreshing, setRefreshing] = useState(false);
    const [eventoError, setEventoError] = useState(false);
    const [eventoLocalidades, setEventLocalidad] = useState([]);
    const [selectedLocalidad, setSelectedLocalidad] = useState(null);
    const [cantidadBoletos, setCantidadBoletos] = useState(1);
    const [localidadSeleccionada, setLocalidadSeleccionada] = useState(null);
    const [precioBoleto, setPrecioBoleto] = useState(null); // Precio inicial
    const [userData, setUserData] = useState(null); // Estado para almacenar los datos de usuario
    
    const [precioTotal, setPrecioTotal] = useState(0); // Precio inicial

    const route = useRoute();
    const { objetoSeleccionado } = route.params; // Obtener el objeto específico pasado como parámetro
  

    const obtenerListaLocalidades = async () => {    
      try { 
            const even_id = objetoSeleccionado.even_id
            const response = await mainApiEvent.get('/eventos/localidades?usua_user=codeinmove&usua_pass=Cse_1929/*&even_id='+ even_id)
            const userDataFromAPI = response.data;
            setEventLocalidad(userDataFromAPI);

      } catch (error) {
            console.log('error: '+error)
            setEventoError(error);
      }
    }

    const handleRefresh = () => {
        obtenerListaLocalidades();
    };

    const CargarLocalidad = (id) => {
        // Lógica para cargar la localidad según el ID.
        //console.log(`Cargando localidad con ID: ${id}`);
        setSelectedLocalidad(id); // Marcar la localidad como seleccionada
        setLocalidadSeleccionada(id); 
        // Actualizar el precio del boleto según la localidad seleccionada
        const localidad = eventoLocalidades.find(localidad => localidad.Loca_id === id);
        if (localidad) {
        setPrecioBoleto(localidad.Precio_bole);
        } else {
        setPrecioBoleto(null); // La localidad no se encontró en el array
        }

    };

    // Función para incrementar la cantidad de boletos
    const incrementarBoletos = () => {
        // Verificar si la localidad seleccionada tiene un valor válido
        if (localidadSeleccionada) {
            // Buscar la localidad seleccionada en el array eventoLocalidades
            const localidad = eventoLocalidades.find(localidad => localidad.Loca_id === localidadSeleccionada);
            // Verificar si se encontró la localidad y si la cantidad actual es menor que Localidad_Venta_Maxima
            if (localidad && cantidadBoletos < parseInt(localidad.Localidad_Venta_Maxima, 10)) {
                setCantidadBoletos(cantidadBoletos + 1);
            }
        }
    };
  
    const decrementarBoletos = () => {
      if (cantidadBoletos > 1) {
        setCantidadBoletos(cantidadBoletos - 1);
      }
    };
  
    const calcularMontoTotal = () => {
        return cantidadBoletos * precioBoleto;
    };

    const localidadImages = {
        10: require('../../assets/images/estadio/GQ.png'),
        20: require('../../assets/images/estadio/GPM.png'),
        30: require('../../assets/images/estadio/TGG.png'),
        40: require('../../assets/images/estadio/TSM.png'),
      };
      
    const actualizarPrecioBoleto = () => {
        if (selectedLocalidad) {
          const localidad = eventoLocalidades.find(localidad => localidad.Loca_id === selectedLocalidad);
          if (localidad) {
            setPrecioBoleto(localidad.Precio_bole);
          } else {
            setPrecioBoleto(null); // La localidad no se encontró en el array
          }
        } else {
          setPrecioBoleto(null); // No se ha seleccionado ninguna localidad
        }
      };

    const obtenerDataUsuario = async () => {    
        try { 
            const storedToken = await AsyncStorage.getItem('access_token');
            if (storedToken !== null) {

                const response = await mainApi.post('/whoami', {}, {
                    headers: {
                        ...(storedToken && { Authorization: `Bearer ${storedToken}` })
                    }
                })
                const userDataFromAPI = response.data;
                setUserData(userDataFromAPI);
            }
        } catch (error) {
            Alert.alert('Ha ocurrido un error', `${error}`);    
            console.log(error)
        }
    
    }

    const reserverTicket = async () => { 
        setIsLoading(true);
        try { 
            const data = 
                {
                    "user": {
                        "usua_user": "codeinmove",
                        "usua_pass": "Cse_1929/*"
                    },
                    "info": {
                        "even_id": objetoSeleccionado.even_id,
                        "loca_id": localidadSeleccionada,
                        "cliente_nombre": userData?.soci_nomb + userData?.soci_apel,
                        "cliente_cedula": userData?.soci_cedu,  
                        "cantidad_boleto": cantidadBoletos
                    }
                };
                const response = await mainApiEvent.post('/boleto/reservar', data, {})
                const objectReceived = response.data;
                // Agrega campos adicionales al objeto objectReceived
                objectReceived.price_pay_tickets = cantidadBoletos * precioBoleto;
                objectReceived.ticket_quantity = cantidadBoletos;
                objectReceived.even_id = objetoSeleccionado.even_id;
                objectReceived.loca_id = localidadSeleccionada; 

                //console.log(objectReceived)
                setIsLoading(false);
                if(objectReceived){
                    navigation.navigate('PaymentTicket', { objectReceived });
                }
        } catch (error) {
            Alert.alert('Ha ocurrido un error', `${error}`);    
            setIsLoading(false);
        }
    }

    useEffect(() => {
        obtenerListaLocalidades({})
      }, [objetoSeleccionado]);
      
    useEffect(() => {
        // Llama a la función para actualizar el precio del boleto cada vez que cambie la localidad seleccionada
        actualizarPrecioBoleto();
    }, [selectedLocalidad]);

    useEffect(() => {
        obtenerDataUsuario({})
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
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
                Localidades
                </Text>
            </View>
            </View>
        
            <ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
            style={{ flex: 1 }}
            >
            <Text style={{ padding: 15, fontWeight: 'bold', color: '#000', fontSize: 26, marginTop: 10, textAlign: 'center' }}>
                {objetoSeleccionado?.even_nombre}
            </Text>
        
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name="keyboard-arrow-left" size={24} color="black" paddingTop={10} />
                <Text style={{ fontWeight: 'bold', color: '#000', fontSize: 14, marginTop: 10, marginLeft: 20, marginRight: 20, textAlign: 'center' }}>
                    DESLIZA PARA SELECCIONAR 
                </Text>
                <MaterialIcons name="keyboard-arrow-right" size={24} color="black" paddingTop={10} />
            </View>


            {/* Contenedor de lista de localidades */}
            <ScrollView horizontal contentContainerStyle={{ padding: 16 }}>
                {eventoLocalidades.map((localidad) => (
                <TouchableOpacity
                    key={localidad.Loca_id}
                    style={[
                    styles.localidadItem,
                    selectedLocalidad === localidad.Loca_id && { backgroundColor: '#0134bd' },
                    ]}
                    onPress={() => CargarLocalidad(localidad.Loca_id)}
                >
                    {/*<Image
                    source={{ uri: localidad.icono }}
                    style={[
                        styles.icono,
                        selectedLocalidad === localidad.id && { backgroundColor: '#ffffff' },
                    ]}
                    />*/}
                    <Text style={styles.localidadNombre}>{localidad.Localidad}</Text>
                </TouchableOpacity>
                ))}
            </ScrollView>
            {/* Fin del contenedor de lista de localidades */}
        
        
            <View style={{ flex: 1, padding: 16  }}>
                <Image
                    source={localidadImages[selectedLocalidad] || require('../../assets/images/estadio/01SL.png')}
                    style={{ width: '100%', height: 300, borderRadius: 25.0 }}
                />
                <View style={styles.container}>
                    <View style={styles.leftContainer}>
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity onPress={decrementarBoletos} 
                        // style={styles.button}
                            style={[
                                styles.button,
                                (isLoading || localidadSeleccionada === null) && styles.disabledButton // Aplica el estilo si está deshabilitado
                            ]}
                            disabled={isLoading || localidadSeleccionada === null}
                            >
                            <Text style={styles.buttonText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.quantity}>{cantidadBoletos}</Text>
                            <TouchableOpacity onPress={incrementarBoletos}                             
                            style={[
                                styles.button,
                                (isLoading || localidadSeleccionada === null || cantidadBoletos >= 5) && styles.disabledButton, // Deshabilitar cuando se alcanza el límite (5)
                              ]}
                              disabled={isLoading || localidadSeleccionada === null || cantidadBoletos >= 5}
                            
                            >
                            <Text style={styles.buttonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.rightContainer}>
                        <Text style={styles.totalAmount}>
                            ${calcularMontoTotal()}
                            </Text>
                    </View>
                </View>

                <TouchableOpacity 
                    style={[
                        styles.buttonPagar,
                        (isLoading || localidadSeleccionada === null) && styles.disabledButton
                    ]}
                    disabled={isLoading || localidadSeleccionada === null}
                    //onPress={() => navigation.push('PaymentTicket')}
                    onPress={() => reserverTicket()}
                    >
                    <View style={styles.buttonContent}>
                        <Entypo name="ticket" size={24} color="white" />
                        {isLoading ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <Text style={styles.buttonTextLeft}> CONFIRMAR COMPRA</Text>
                        )}
                    </View>
                </TouchableOpacity>
            </View>



            {/* Agrega más componentes aquí según tus necesidades */}
            </ScrollView>
        </SafeAreaView>
    );
    


}

const styles = StyleSheet.create({
    teamContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        color: '#fff',
        padding: 15,

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
        marginTop: 25,
        marginBottom: 25,

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



 
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
        paddingHorizontal: 20,
        marginTop:20,
      },
      leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      rightContainer: {
        alignItems: 'flex-end',
      },
      label: {
        fontSize: 16,
      },
      buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      button: {
        width: 40,
        height: 40,
        backgroundColor: '#0134bd',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
      },
      buttonPagar: {
        backgroundColor: '#0134bd',
        marginTop: 20,
        padding: 20,
        borderRadius: 35,
        backgroundColor: Colors.primaryColor,
        },
      disabledButton: {
        backgroundColor: 'gray', 
      },
      buttonText: {
        color: 'white',
        fontSize: 20,
      },
      quantity: {
        fontSize: 18,
        marginHorizontal: 10,
      },
      totalAmount: {
        fontSize: 24,
        fontWeight: 'bold',
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
        buttonTextRight: {
            color: '#fff',
            textAlign: 'right',
            fontWeight: 'bold',
            fontSize: 16,
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


      localidadItem: {
        width: 180, // Ancho personalizado
        height: 70, // Altura personalizada
        marginRight: 5,
        backgroundColor: '#7BBAEA', // Fondo gris
        color: '#000',
        borderRadius: 30, // Bordes redondeados
        //borderWidth: 1, // Borde
        borderColor: 'black', // Color del borde
        flexDirection: 'row', // Para alinear el ícono y el texto horizontalmente
        alignItems: 'center', // Para centrar verticalmente los elementos
      },
      icono: {
        width: 30,
        height: 30,
        marginLeft: 10, // Espacio entre el ícono y el borde izquierdo
      },
      localidadNombre: {
        flex: 1, // Para que el texto ocupe el espacio restante
        fontSize: 14,
        color: 'white', // Color del texto
        //color: '#000', // Color del texto
        //marginLeft: 10, // Espacio entre el texto y el ícono
        fontWeight: 'bold',
        alignItems: 'center', // Para centrar verticalmente los elementos
        textAlign: 'center',

      },



});

export default LocationScreen;