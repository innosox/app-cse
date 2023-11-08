import React, { useState, useRef, useEffect  } from "react";
import { SafeAreaView, View, StatusBar, TextInput, TouchableOpacity, Dimensions, ScrollView, Image, StyleSheet,
     Text, FlatList, RefreshControl } from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import { MaterialIcons, AntDesign, MaterialCommunityIcons, Entypo   } from '@expo/vector-icons';
import { ImageBackground, useColorScheme  } from "react-native";
import QRCode from 'react-qr-code';

import Swiper from 'react-native-swiper';
import DashedLine from "react-native-dashed-line";
import { useRoute } from "@react-navigation/native";
import { mainApi, mainApiEvent } from "../../api/mainApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";


const MyTicketScreen = ({ navigation }) => {

    const colorScheme = useColorScheme(); // Obtener el tema del dispositivo

    // Determinar el color de fondo según el tema
    const backgroundColor = colorScheme === 'dark' ? 'black' : 'white';

    const [refreshing, setRefreshing] = useState(false);
    const qrSize = Dimensions.get('screen').width * 0.45;
    const imageWidth = Dimensions.get('screen').width - 40;
    const flatListRef = useRef(null); // Referencia al FlatList
    const [currentIndex, setCurrentIndex] = useState(0); // Estado para el índice actual
    const [userData, setUserData] = useState(null); // Estado para almacenar los datos de usuario

    const route = useRoute();
    const { objetoSeleccionado } = route.params; // Obtener el objeto específico pasado como parámetro
    const [tickets, setTicket] = useState([]);

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
                //console.log(userDataFromAPI)
                setUserData(userDataFromAPI);
            }
        } catch (error) {
            console.log(error)
        }
    }
    
    useEffect(() => {
        obtenerDataUsuario({})
    }, []);

    const obtenerTicketByEvent = async () => {    
        try { 
            const even_id = objetoSeleccionado.even_id
            const client_cedu = userData?.soci_cedu
            //console.log(even_id, client_cedu )
            const response = await mainApiEvent.get(`/boleto/ver/${even_id}?cliente_cedula=${client_cedu}`);

            const userDataFromAPI = response.data;
            setTicket(userDataFromAPI);
            
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        obtenerTicketByEvent()
    }, [userData]);


    const handleRefresh = () => {
         tickets.map((ticket) => renderItem(ticket))
    };

    const renderItem = (item) => (
        <View key={item} style={{  justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{ marginBottom: 1 }}></Text>
        <View key={item.even_bole_id} style={styles.bookingInfoWrapStyle}>
          <Text>Ticket #{item.even_bole_id}</Text>
          <View style={{ alignItems: 'center' }}>
            <QRCode
              value={item.even_bole_codi}
              size={200}
              color="black"
              backgroundColor="white" // Cambiado para mayor contraste
            />
          </View>
          <Text
            style={{
              padding: 5,
              fontWeight: 'bold',
              color: '#000',
              fontSize: 26,
              marginTop: 20,
              marginBottom: 30,
              textAlign: 'center',
            }}
          >
           {item?.even_nombre}
          </Text>
            {/* INICIO NUMERO PEDIDO */}
            <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ ...Fonts.grayColor14Regular }}>
                        NUMERO DE PEDIDO
                    </Text>
                    <Text numberOfLines={1} style={{ textAlign: 'right', flex: 1, ...Fonts.blackColor14SemiBold }}>
                        {item?.even_bole_pedi_codi}
                    </Text>
                </View>
                <DashedLine
                    dashLength={5}
                    dashThickness={2}
                    dashGap={2}
                    dashColor={Colors.lightGrayColor}
                    dashStyle={{
                        marginBottom: Sizes.fixPadding + 5.0,
                        marginTop: Sizes.fixPadding + 5.0,
                    }} />
            </View>
            {/* FIN NUMERO PEDIDO */}

            {/* INICIO CODIGO RESERVA */}
            <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ ...Fonts.grayColor14Regular }}>
                        CÓDIGO DE RESERVA
                    </Text>
                    <Text numberOfLines={1} style={{ textAlign: 'right', flex: 1, ...Fonts.blackColor14SemiBold }}>
                        {item?.even_bole_codi_reserv}  
                    </Text>
                </View>
                <DashedLine
                    dashLength={5}
                    dashThickness={2}
                    dashGap={2}
                    dashColor={Colors.lightGrayColor}
                    dashStyle={{
                        marginBottom: Sizes.fixPadding + 5.0,
                        marginTop: Sizes.fixPadding + 5.0,
                    }} />
            </View>
            {/* FIN CODIGO RESERVA */}

            {/* INICIO NOMBRE */}
            <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ ...Fonts.grayColor14Regular }}>
                        NOMBRE
                    </Text>
                    <Text numberOfLines={1} style={{ textAlign: 'right', flex: 1, ...Fonts.blackColor14SemiBold }}>
                        {item?.even_bole_clie_name}   
                    </Text>
                </View>
                <DashedLine
                    dashLength={5}
                    dashThickness={2}
                    dashGap={2}
                    dashColor={Colors.lightGrayColor}
                    dashStyle={{
                        marginBottom: Sizes.fixPadding + 5.0,
                        marginTop: Sizes.fixPadding + 5.0,
                    }} />
            </View>
            {/* FIN NOMBRE */}

            {/* INICIO EMAIL */}
            <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ ...Fonts.grayColor14Regular }}>
                    EMAIL
                    </Text>
                    <Text numberOfLines={1} style={{ textAlign: 'right', flex: 1, ...Fonts.blackColor14SemiBold }}>
                        {item?.even_bole_clie_mail}   
                    </Text>
                </View>
                <DashedLine
                    dashLength={5}
                    dashThickness={2}
                    dashGap={2}
                    dashColor={Colors.lightGrayColor}
                    dashStyle={{
                        marginBottom: Sizes.fixPadding + 5.0,
                        marginTop: Sizes.fixPadding + 5.0,
                    }} />
            </View>
            {/* FIN EMAIL */}


            {/* INICIO CEDULA */}
            <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ ...Fonts.grayColor14Regular }}>
                    CEDULA
                    </Text>
                    <Text numberOfLines={1} style={{ textAlign: 'right', flex: 1, ...Fonts.blackColor14SemiBold }}>
                        {item?.even_bole_clie_cedu}   
                    </Text>
                </View>
                <DashedLine
                    dashLength={5}
                    dashThickness={2}
                    dashGap={2}
                    dashColor={Colors.lightGrayColor}
                    dashStyle={{
                        marginBottom: Sizes.fixPadding + 5.0,
                        marginTop: Sizes.fixPadding + 5.0,
                    }} />
            </View>
            {/* FIN CEDULA */}

            
            {/* INICIOLOCALIDAD */}
            <Text style={{...Fonts.grayColor14Regular , fontSize: 16, textAlign: 'center' }}>
            LOCALIDAD
            </Text>
            <Text style={{...Fonts.blackColor14SemiBold , fontWeight: 'bold', fontSize: 18,  marginBottom:10, textAlign: 'center' }}>
                {item?.loca_deta}   
            </Text>
            {/* FIN LOCALIDAD */}

        </View>
      </View>
    );
    
      
      return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
                <View style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
                    <View style={styles.headerWrapStyle}>
                        <View style={styles.headerLocationInfoWrapStyle}>
                            <MaterialIcons
                            name="arrow-back"
                            color="white"
                            size={22}
                            onPress={() => navigation.pop()}
                            />
                            <Image
                            source={require('../../assets/images/users/fotoperfil.jpeg')}
                            style={{ width: 50, height: 50, borderRadius: 25, marginLeft: 20 }}
                            />
                            <Text style={{ marginLeft: 15, flex: 1, fontSize: 16, fontWeight: 'bold', color: 'white' }}>
                            Mis boletos
                            </Text>
                        </View>
                    </View>
                    <ImageBackground
                        source={
                        require('../../assets/images/background.jpg')
                        }
                        style={styles.cardBackground}
                        resizeMode="cover"
                        >
                        <ScrollView showsVerticalScrollIndicator={false} 
                            contentContainerStyle={{ paddingBottom: Sizes.fixPadding }}
                            refreshControl={
                                <RefreshControl
                                refreshing={refreshing}
                                onRefresh={handleRefresh}
                                />
                            }
                        >

                    {tickets.length > 0 ? (
                            <Swiper showsPagination loop={false} dotStyle={styles.paginationDot} 
                                activeDotStyle={styles.activePaginationDot}>
                                {tickets.map((ticket) => renderItem(ticket))}
                            </Swiper>

                    ) : (

                        <View style={{  justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{ marginBottom: 1 }}></Text>
                            <View style={styles.bookingInfoWrapStyle}>
                            {/* INICIOLOCALIDAD */}
                            <Text style={{...Fonts.grayColor14Regular , padding: 5, fontWeight: 'bold', fontSize: 16, textAlign: 'center', color: '#EA7B7B' }}>
                            Aún no has comprado boletos para este evento.
                            </Text>

                            </View>
                        </View>

                    )}
                        </ScrollView>
                    </ImageBackground>
                </View>
            </SafeAreaView>
        );

}

const styles = StyleSheet.create({

    paginationDot: {
        backgroundColor: 'gray', // Color de los puntos inactivos
        width: 10,
        height: 10,
        borderRadius: 4,
        marginHorizontal: 30, // Aumenta el margen horizontal
    },
    activePaginationDot: {
        backgroundColor: 'white', // Color de los puntos activos
        width: 10,
        height: 10,
        borderRadius: 4,
        marginHorizontal: 10, // Aumenta el margen horizontal
    },
    bookingInfoWrapStyle: {
        top: - 10.0,
        backgroundColor: Colors.whiteColor,
        elevation: 4.0,
        borderRadius: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding * 2.0,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding + 8.0,
        width: '100%'
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

    cardBackground: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },


});

export default MyTicketScreen;