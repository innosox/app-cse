import React, { useEffect, useState, useRef  } from "react";
import { SafeAreaView, View, StatusBar, TextInput, TouchableOpacity, Dimensions, 
  ScrollView, Image, StyleSheet, Text, FlatList, Alert, SectionList, RefreshControl, Button } from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import { MaterialIcons, AntDesign, MaterialCommunityIcons, Entypo, Feather   } from '@expo/vector-icons';
import { ImageBackground } from "react-native";
import QRCode from 'react-qr-code';


import AsyncStorage from '@react-native-async-storage/async-storage';
import { mainApi } from "../../api/mainApi";
import { format, parse } from 'date-fns';
import Share from 'react-native-share';
import ViewShot from "react-native-view-shot";
import moment from "moment";

const MyprofileScreen = ({ navigation }) => {

  const [isLoading, setIsLoading] = useState(false);

  
    const [token, setToken] = useState('');
    const [userData, setUserData] = useState(null); // Estado para almacenar los datos de usuario
    const [socioDeuda, setSocioDeuda] = useState([]); // Estado para almacenar los datos de usuario
    const viewRef = useRef(null);
    const [friends, setFriends] = useState([]); 

    const {width, height} = Dimensions.get('window');
    const actualImageHeight = 200;
    const actualImageWidth = 300;
    const [visibleFriends, setVisibleFriends] = useState(5); // Mostrar los primeros cinco amigos
    const [showAll, setShowAll] = useState(false);

    const dimensions = Dimensions.get('window');
    const imageHeight = Math.round(dimensions.width * 10 / 36);
    const imageWidth = dimensions.width;

    // Función para obtener el token almacenado en AsyncStorage
    const getTokenFromStorage = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('access_token');
        if (storedToken !== null) {
          setToken(storedToken);
        }
      } catch (error) {
        console.log('Error fetching token from AsyncStorage:', error);
      }
    };


  useEffect(() => {
    getTokenFromStorage();
  }, []);

  const obtenerDataUsuario = async () => {    
    try { 
        const storedToken = await AsyncStorage.getItem('access_token');
        if (storedToken !== null) {

            const response = await mainApi.post('/whoami', {}, {
                headers: {
                    //"Content-Type": "application/json",
                    //Accept: "application/json",
                    //Authorization: `Bearer ${token}`
                    ...(storedToken && { Authorization: `Bearer ${storedToken}` })
                }
            })
            //console.log(response.data)

            // Puedes reemplazar la URL con la que necesitas para tu petición
            //Alert.alert('Petición Exitosa', `${JSON.stringify(response.data.message)}`);
            const userDataFromAPI = response.data;
            // Actualiza el estado con los datos del usuario
            setUserData(userDataFromAPI);
            //Alert.alert('Petición Exitosa', 'el token es valido');
        }
    } catch (error) {
        Alert.alert('Ha ocurrido un error', `${error}`);    
        console.log(error)
        //navigation.navigate('Login');
    }
    
  }


    const obtenerDeuda = async () => {    
      try { 

          const storedToken = await AsyncStorage.getItem('access_token');
          if (storedToken && userData?.soci_id) {

            const soci_id = userData?.soci_id;
            const url = `/socios-obtener-deudas/${soci_id}`;
            const response = await mainApi.get(url, {
              headers: {
                  ...(storedToken && { Authorization: `Bearer ${storedToken}` })
              }
            })
            //Alert.alert('Petición Exitosa', `${JSON.stringify(response.data.message)}`);
            const userDataFromAPI = response.data;
            setSocioDeuda(userDataFromAPI);
            //Alert.alert('Petición Exitosa', 'el token es valido');
          }
      } catch (error) {
          Alert.alert('Ha ocurrido un error', `${error}`);    
          console.log(error)
      }
    }

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

    useEffect(() => {
      obtenerDataUsuario({})
      getFriends();
      }, []);

    useEffect(() => {
      obtenerDeuda();
    }, [userData]);

    const deudas = socioDeuda;
    
    // Obtén la fecha actual
    const currentDate = new Date();
    const formattedDate = format(currentDate, 'yyyyMM');

    // Verifica si la fecha obtenida es válida
    if (userData?.soci_acti != null) {
      // Formatea la cadena de fecha en el formato esperado
      const fechaFormateada = userData?.soci_acti.replace(' ', 'T'); // Reemplaza espacio por 'T'
    
      // Convierte la fecha formateada en un objeto de fecha
      const fechaUsuario = new Date(fechaFormateada);
      const formattedDateActive = format(fechaUsuario, 'yyyyMM');
      sociActivo = formattedDateActive;

    } else {
      // La fecha no es válida, maneja el error
      sociActivo = null;
    }

    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = () => {
      // Realiza la lógica de actualización aquí (por ejemplo, llama a tus funciones obtenerDataUsuario y obtenerDeuda)
      obtenerDataUsuario();
      obtenerDeuda();
    };

    const shareContent = async () => {
      try {
          if (viewRef.current) {
            const uri = await viewRef.current.capture();
            const options = {
              url: uri,
              title: 'Compartir en redes sociales',
            };
            await Share.open(options);
          }
        } catch (error) {
          // Manejar el caso en el que el usuario no comparte
          if (error.message === 'User did not share') {
            console.log('El usuario canceló la acción de compartir.');
          } else {
            console.error('Error al compartir: ', error);
          }
      };
    };
    

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1 }}>
                <View style={styles.headerWrapStyle}>
                    <View style={styles.headerLocationInfoWrapStyle}>
                        <Image
                            source={require('../../assets/images/users/fotoperfil.jpeg')}
                            style={{ width: 50.0, height: 50.0, borderRadius: 25.0, marginLeft: 10, }}
                        />
                        <Text style={{ marginLeft: 15, flex: 1, ...Fonts.whiteColor16Bold }}>
                            Bienvenido !! { userData?.soci_nomb } { userData?.soci_apel }
                        </Text>
                    </View>
                </View>
            <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            style={{ flex: 1 }} >

                {/* Inicio de tarjeta virtual */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                        borderRadius: Sizes.fixPadding - 5.0,
                        marginHorizontal: Sizes.fixPadding * 2.0,
                        marginBottom: Sizes.fixPadding,
                    }}
                    onPress={() => navigation.push('MiQR')}
                >
                    <View style={styles.container}>
                        <ImageBackground
                        source={
                          userData?.soci_memb_id == 1 && userData?.soci_esta === 'A'
                            ? require('../../assets/images/membresia/background-socio-abonado.jpg')
                            : userData?.soci_memb_id == 3 && userData?.soci_esta === 'A'
                            ? require('../../assets/images/membresia/background-socio-legend.jpg')
                            : userData?.soci_memb_id == 5 && userData?.soci_esta === 'A'
                            ? require('../../assets/images/membresia/background-socio-azul.jpg')
                            : userData?.soci_memb_id == 6 && userData?.soci_esta === 'A'
                            ? require('../../assets/images/membresia/background-socio-internacional.jpg')
                            : userData?.soci_memb_id == 7 && userData?.soci_esta === 'A'
                            ? require('../../assets/images/membresia/background-socio-bombillo-jr.jpg')
                            : require('../../assets/images/membresia/background-emelec-id.jpg')
                        }
                        style={styles.cardBackground}
                        resizeMode="cover"
                        >
                            <View style={styles.cardContent}>
                                <Text style={styles.cardName}> { userData?.soci_nomb } { userData?.soci_apel }</Text>
                                <Text style={styles.cardIdentification}>{ userData?.soci_cedu }</Text>
                            </View>
                            <View style={styles.cardContent}>
                                <View style={styles.cardNameContainer}>
                                    <Text style={styles.cardName}>Localidad: </Text>
                                    <Text style={styles.cardName}>{userData?.soci_plan_deta ? userData.soci_plan_deta : 'Sin Localidad'}</Text>
                                    <Text style={styles.cardName}></Text>
                                    <Text style={styles.cardName}>Acceso:</Text>
                                    <Text style={styles.cardName}>{ userData?.soci_plan_deta_acce ? userData.soci_plan_deta_acce : 'Sin Acceso' }</Text>
                                </View>
                            </View>
                            <View style={styles.cardFooter}>
                                <Text style={styles.cardDateLabel}>{ userData?.soci_memb_deta}</Text>
                                {userData?.fecha_activo ? (
                                  <Text style={styles.cardDate}>Activo: { userData?.fecha_activo }</Text>
                                ) :  (
                                null 
                                )}
                            </View>
                        </ImageBackground>
                    </View>
                </TouchableOpacity>
                {/* fin de tarjeta virtual */}


                {/* Inicio de Alicuotas */}
                {userData?.Saldo_genrador > 0 ? (
                  <TouchableOpacity
                        activeOpacity={0.8}
                        style={{
                            borderRadius: Sizes.fixPadding - 5.0,
                            marginHorizontal: Sizes.fixPadding * 2.0,
                            marginBottom: 10,
                        }}
                      >
                    <View  style={styles.card}>
                    <Text style={{ textAlign: 'center', margin: Sizes.fixPadding * 2.0, ...Fonts.blackColor20Bold }}>
                      ALÍCUOTAS
                    </Text>
                      <View style={styles.header}>
                        <Text style={styles.headerText}>REFERENCIA</Text>
                        <Text style={styles.headerText}>DETALLE</Text>
                        <Text style={styles.headerText}>VALOR</Text>
                        <Text style={styles.headerText}>OPCION</Text>
                      </View>
                      {deudas.map((item, index) => (
                        <View style={styles.row} key={index}>
                          <Text style={styles.cell}>{item?.soci_fact_id}</Text>
                          <Text style={styles.cell}>{item?.soci_fact_deta}</Text>
                          <Text style={styles.cell}>${item?.soci_fact_saldo}</Text>

                          {userData?.soci_esta == 'A' ? (
                                          
                              sociActivo <  formattedDate ? (
                                null
                              ) :  (
                                <TouchableOpacity style={styles.deleteButton}>
                                <Text style={styles.deleteButtonText}>
                                  <MaterialCommunityIcons 
                                  style={styles.deleteButtonText} 
                                  name="delete-forever-outline" 
                                  size={24} color="black" />
                                </Text>
                              </TouchableOpacity>

                              )

                            ) : (
                              null 
                            )}
                        </View>
                      ))}
                        <TouchableOpacity  
                          style={styles.button}
                          //onPress={() => navigation.push('BottomTabBar')}
                          onPress={() => navigation.push('Payment')}
                          >
                            <View style={styles.buttonContent}>
                                <Entypo name="credit-card" size={24} color="white" />
                                <Text style={styles.buttonText}> REALIZAR PAGO</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    </TouchableOpacity>
                ) :  (
                  null 
                  )}
                {/* Fin de Alicuotas */}

                <View style={{ flex: 1, marginBottom: 50, padding: 20 }}>
                  <View style={styles.card}>
                    <Text style={{ textAlign: 'center', margin: Sizes.fixPadding * 2.0, ...Fonts.blackColor20Bold }}>
                      MIS AMIGOS
                    </Text>
                    <View style={{ flex: 1, marginBottom: 10, padding: 5 }}>
                      {friends.slice(0, visibleFriends).map((contact, index) => (
                        <View style={styles.contactContainer} key={index}>
                          {contact?.soci_id_recep ? (
                            <Image 
                              source={{ uri: `https://socioemelec.com/fotos/socios/foto_socio_${contact?.soci_id_recep}.jpg` }}
                              style={styles.contactImage}
                            />
                          ) : (
                            <Image
                              source={require('../../assets/images/avatar.jpg')}
                              style={styles.contactImage}
                            />
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
                      ))}
                      {!showAll && friends.length > 5 && (
                        <TouchableOpacity 
                        style={[styles.buttonShowAll]}
                        onPress={() => navigation.push('ListFriend')}
                        >
                          <Text style={{ textAlign: 'center', marginVertical: 10 }}>
                            Mostrar todo
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                </View>


                  {/* inicio de compartir en redes */}
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>
                    <ViewShot ref={viewRef} options={{ format: 'jpg', quality: 0.9 }}>
                      <View style={{ width: 370, height: 300, backgroundColor: 'lightblue' }}>
                        <View style={styles.containerShare}>
                          <View style={styles.imageContainer}>
                              <Image
                                source={require('../../assets/images/FONDO-SUPERIOR-SOCIOS.png')}
                                style={[styles.image, styles.borderTop]}
                              />
                            </View>
                            <View style={styles.imageContainer}>
                              <Image
                                source={require('../../assets/images/FOTO-HINCHADA.png')}
                                style={styles.image}
                              />
                              <Text style={styles.text}>SÁBADO 7 DE OCTUBRE / 15:30</Text>
                            </View>
                            <View style={styles.imageContainer}>
                              <Image
                                source={require('../../assets/images/FONDO-CON-LOGO-SOCIOS.png')}
                                style={[styles.image, styles.borderBottom]}
                              />
                              <Text style={styles.text}>YO, { userData?.soci_nomb } { userData?.soci_apel }, ESTOY LISTO!</Text>
                              
                            </View>
                          </View>
                        </View>
                    </ViewShot>
                      <TouchableOpacity
                        style={styles.buttonBoletos}
                        disabled={isLoading}
                        onPress={shareContent}
                      >
                        <View style={styles.buttonContent}>
                        <Feather name="share-2" size={24} color="white" />
                          {isLoading ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                          ) : (
                            <Text style={styles.buttonTextLeft}> COMPARTIR</Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>
                  {/* fin de compartir en redes */}
              


                </View>

            </ScrollView>
            </View>
        </SafeAreaView>
    )


}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  cell: {
    flex: 1,
    padding: 5,
  },
  headerWrapStyle: {
        paddingTop: 5,
        paddingBottom: 10,
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
        padding: 16,
        borderRadius: 8,
        marginVertical: 8,
        elevation: 35, // Ajusta este valor para el nivel de sombra deseado
        shadowColor: '#000', // Solo para iOS
        shadowOffset: { width: 0, height: 2 }, // Solo para iOS
        shadowOpacity: 0.2, // Solo para iOS
        shadowRadius: 4, // Solo para iOS
    },
    button: {
        //backgroundColor: '#2269BE',
        backgroundColor: Colors.primaryColor,

        marginTop: 28,
        marginBottom: 24,
        padding: 22,
        borderRadius: 35,
        
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

    container: {
        width: '100%',
        aspectRatio: 1.650, // Aspect ratio of a standard credit card
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: Sizes.fixPadding,

      },
      cardBackground: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 25,
      },
      cardContent: {
        flexDirection: 'column',
        alignItems: 'flex-end', // Align content to the right
      },
      cardNameContainer: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
      },
      cardName: {
        fontSize: 12,
        color: 'white',
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
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#f2f2f2',
      },
      headerText: {
        fontWeight: 'bold',
        textAlign: 'center',
      },
      column: {
        flex: 1,
        textAlign: 'center',
      },
      deleteButton: {
        width: 40, // Establece el ancho que desees
        height: 40, // Establece la altura que desees
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red', // Puedes personalizar el color de fondo
        borderRadius: 5, // Ajusta el radio de borde si es necesario
      },
      deleteButtonText: {
        color: 'white',
        //fontWeight: 'bold',
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

      containerShare: {
        flex: 1,
        justifyContent: 'space-between',
      },
      imageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      image: {
        width: '100%',
        height: 120,
        resizeMode: 'cover',
      },
      borderTop: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      },
      borderBottom: {
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      },
      text: {
        position: 'absolute',
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        //backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 5,
      },

      buttonBoletos: {
        backgroundColor: '#000000',
        borderColor: '#ffffff',
        borderWidth: 1,
        padding: 10,
        borderRadius: 35,
        width: '50%',
        padding: 10,
        marginTop: 2,
        marginBottom:10,
      },
      buttonTextLeft: {
        color: '#fff',
        textAlign: 'left',
        fontWeight: 'bold',
        fontSize: 16,
    },

    buttonShowAll: {
      paddingVertical: 3,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: Sizes.fixPadding + 25.0,
      backgroundColor: '#E1E1E1',
      color: 'black',
    },


});

export default MyprofileScreen;