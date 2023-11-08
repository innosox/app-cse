import React, { useState } from "react";
import { SafeAreaView, View, StatusBar, TextInput, TouchableOpacity, Dimensions, ScrollView, Image, StyleSheet, Text, FlatList, Alert, ActivityIndicator } from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import { MaterialIcons, AntDesign, MaterialCommunityIcons, Entypo , Feather, Ionicons   } from '@expo/vector-icons';
import { ImageBackground, useColorScheme  } from "react-native";
import QRCode from 'react-qr-code';
import { Button } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from "react";
const { height } = Dimensions.get('window');
import { mainApi, mainApiEvent } from "../../api/mainApi";
import { RefreshControl } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';

const PayTicketScreen = ({ navigation }) => {


    const route = useRoute();
    const objectReceived = route.params.objectReceived;

// Ahora puedes acceder a la data en objectReceived


    const [isLoading, setIsLoading] = useState(false);
    const [userDeb, setValueDebData] = useState(null); // Estado para almacenar los datos de usuario
    const [userData, setUserData] = useState(null); // Estado para almacenar los datos de usuario

    // Declara una variable global para mantener un registro de los números generados
    const numerosGenerados = new Set();


    const [selectedCard, setSelectedCard] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState([
      { id: '1', cardNumber: '**** **** **** 1234' },
      { id: '2', cardNumber: '**** **** **** 5678' },
      // Agrega más métodos de pago
    ]);
  
    const handleCardSelection = (card) => {
      setSelectedCard(card);
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

    // Función para generar un número aleatorio único
    function generarNumeroAleatorioUnico() {
        const numeroAleatorio = Math.floor(Math.random() * 100000000000).toString(); // Genera un número aleatorio de hasta 12 dígitos
        // Comprueba si el número ya se ha utilizado previamente (usando un conjunto o una variable global)
        if (numerosGenerados.has(numeroAleatorio)) {
        // Si el número ya existe, genera otro recursivamente
        return generarNumeroAleatorioUnico();
        }
        // Si es único, agrégalo al conjunto para evitar repeticiones
        numerosGenerados.add(numeroAleatorio);
        return numeroAleatorio;
    }

    const handlePay = async  (userDeb) => {
      
      if (selectedCard) {
        setIsLoading(true);
        
        try { 
            // Genera un número aleatorio único para pedido_codigo
            const pedidoCodigo = generarNumeroAleatorioUnico();
            const data = 
                {
                    "user": {
                        "usua_user": "codeinmove",
                        "usua_pass": "Cse_1929/*"
                    },
                    "info": {
                        "even_id": objectReceived.even_id,
                        "loca_id": objectReceived.loca_id,
                        "cliente_nombre": userData?.soci_nomb + userData?.soci_apel,
                        "cliente_cedula": userData?.soci_cedu,  
                        "cliente_mail": userData?.soci_mail,  
                        "cantidad_boleto": objectReceived.ticket_quantity,

                        "pedido_codigo": pedidoCodigo,
                        "codigo_reserva": objectReceived.detail.codigo_reserva
                    }
                };
                const response = await mainApiEvent.post('/boleto/venta', data, {})
                const objectTicketPayment = response.data;
                console.log(objectTicketPayment)
                setIsLoading(false);
                Alert.alert('Pago Exitoso', 'Tus Boletos han sido generados correctamente', [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.navigate('BottomTabBar');
                        }
                    }
                ]);
            
        } catch (error) {
            console.log(error)
            Alert.alert('Ha ocurrido un error', `${error}`);    
            setIsLoading(false);
        }

      } else {
        alert('Selecciona una tarjeta antes de pagar');
      }
      
    };

    useEffect(() => {
        //obtenerValorDeuda({})
    }, []);
    
    useEffect(() => {
        obtenerDataUsuario({})
    }, []);

    const [refreshing, setRefreshing] = useState(false);
    const handleRefresh = () => {
        // Realiza la lógica de actualización aquí (por ejemplo, llama a tus funciones obtenerValorDeuda)
        //obtenerValorDeuda();
        obtenerDataUsuario();
      };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1 }}>
                <View style={styles.headerWrapStyle}>
                    <View style={styles.headerLocationInfoWrapStyle}>
                    <MaterialIcons
                        name="arrow-back"
                        color={Colors.whiteColor}
                        size={22}
                        onPress={() => navigation.pop()}
                    />
                        {<Image
                            source={require('../../assets/images/users/fotoperfil.jpeg')}
                            style={{ width: 50.0, height: 50.0, borderRadius: 25.0, marginLeft: 20, }}
                        />}
                        <Text style={{marginLeft: 15, flex: 1, ...Fonts.whiteColor16Bold }}>
                            Metodo de Pago
                        </Text>
                    </View>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: Sizes.fixPadding }}
                    refreshControl={
                        <RefreshControl
                          refreshing={refreshing}
                          onRefresh={handleRefresh}
                        />
                      }
                >
                    <View
                            activeOpacity={0.8}
                            style={{
                                borderRadius: Sizes.fixPadding - 5.0,
                                marginHorizontal: Sizes.fixPadding * 2.0,
                                marginBottom: 5,
                            }}
                        >
                    
                        <View style={{ flex: 1, padding: 16 }}>

                            <TouchableOpacity
                                style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: 'gray',
                                padding: 10,
                                marginTop: 10,
                                borderRadius: 50,
                                color:"gray"
                                }}
                                onPress={() => navigation.push('AddCardPayment')}
                            >
                            <Feather name="plus" size={24} color="black" style={{padding: 7, marginRight: 10 }} />
                            <Text>Agregar Nueva Tarjeta</Text>
                            </TouchableOpacity>

                            <Text style={styles.header}>Total a pagar </Text>

                            <View
                                style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderColor: 'gray',
                                padding: 15,
                                borderRadius: 50, 
                                textAlign: 'center',
                                justifyContent: 'center', 
                                backgroundColor: '#DADADA'
                                }}
                            >

                            <Text style={{fontSize: 26, color:'#0134bd', fontWeight: 'bold' }}>${ objectReceived?.price_pay_tickets }</Text>
                            </View>                       

                                <Text style={styles.header}>Seleccionar una tarjeta </Text>
                                {paymentMethods.map((item) => (
                                    <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.card,
                                        selectedCard === item ? styles.selectedCard : null,
                                    ]}
                                    onPress={() => handleCardSelection(item)}
                                    >
                                    <View style={styles.cardContent}>
                                        <Text>{item.cardNumber}</Text>
                                        {selectedCard === item && (
                                        <Ionicons name="checkmark-circle" size={40} color="#0134bd" />
                                        )}
                                    </View>
                                    </TouchableOpacity>
                                ))}

                            <TouchableOpacity style={styles.button} 
                            disabled={isLoading} 
                            onPress={() => handlePay(userDeb)}
                            >
                                <View style={styles.buttonContent}>
                                    <Entypo name="credit-card" size={24} color="white" />
                                    {isLoading ? (
                                    <ActivityIndicator size="small" color="#ffffff" />
                                    ) : (
                                        <Text style={styles.buttonTextLeft}> PAGAR</Text>
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View> 
                </ScrollView>
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

    container: {
        flex: 1,
        padding: 16,
      },
      header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        marginTop: 24,
      },
      card: {
        //borderWidth: 1,
        borderColor: 'gray',
        padding: 20,
        marginBottom: 10,
        borderRadius: 50,
        backgroundColor: '#EEEEEE',
      },
      selectedCard: {
        borderColor: '#0134bd',
        backgroundColor: '#E6F7FF',
        borderWidth: 1,
      },
      cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },


      button: {
        backgroundColor: '#0134bd',
        marginTop: 10,
        padding: 20,
        borderRadius: 35,
        backgroundColor: Colors.primaryColor,
    },
    
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Centra icono y texto horizontalmente
      },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
    amountText: {
        color: 'white',
        fontSize: 18,
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


});

export default PayTicketScreen;