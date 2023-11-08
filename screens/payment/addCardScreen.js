import React, { useState } from "react";
import { SafeAreaView, View, StatusBar, TextInput, TouchableOpacity, Dimensions, ScrollView, Image, StyleSheet, Text, FlatList } from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import { MaterialIcons, AntDesign, MaterialCommunityIcons, Entypo , Feather, Ionicons   } from '@expo/vector-icons';
import { ImageBackground, useColorScheme  } from "react-native";
import QRCode from 'react-qr-code';
import { Button } from "react-native";
const { height } = Dimensions.get('window');


const AddCardScreen = ({ navigation }) => {

    const [cardData, setCardData] = useState({
        name: '',
        cardNumber: '',
        expirationMonth: '',
        expirationYear: '',
        cvv: ''
      });


      const handleAddCard = () => {
        // Validación personalizada: verificar que la fecha esté en formato MM/YY
        const isDateValid = cardData.expirationMonth.length === 2 && cardData.expirationYear.length === 2;
    

      };
    
      const handleExpirationDateChange = (text) => {
        const formattedDate = text.replace(/[^0-9]/g, ''); // Elimina caracteres no numéricos
        if (formattedDate.length <= 4) {
          // Asegura que la fecha no sea más larga que MM/YY
          const month = formattedDate.substring(0, 2);
          const year = formattedDate.substring(2, 4);
          setCardData({ ...cardData, expirationMonth: month, expirationYear: year });
        }
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
                            Agregar tarjeta
                        </Text>
                    </View>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: Sizes.fixPadding }}
                >
                    <View
                        activeOpacity={0.8}
                        style={{
                            borderRadius: Sizes.fixPadding - 5.0,
                            marginHorizontal: Sizes.fixPadding * 2.0,
                            marginBottom: 5,
                        }}
                        >
                           
                        {/* INICIO COMPONENTE ADD CARD */}
                        <View style={styles.container}>
                            <Text style={styles.label}>Nombre en la Tarjeta</Text>
                            <TextInput
                                placeholder="Nombre en la Tarjeta"
                                style={styles.input}
                                value={cardData.name}
                                onChangeText={(text) => setCardData({ ...cardData, name: text })}
                            />
                            <Text style={styles.label}>Número de Tarjeta</Text>
                            <TextInput
                                placeholder="Número de Tarjeta"
                                style={styles.input}
                                value={cardData.cardNumber}
                                onChangeText={(text) => setCardData({ ...cardData, cardNumber: text })}
                                keyboardType='numeric'

                            />
                            <View style={styles.row}>
                                <View style={styles.labelContainer}>
                                <Text style={styles.label}>Fecha de Expiración</Text>
                                </View>
                                <View style={styles.labelContainer}>
                                <Text style={styles.label}>CVV</Text>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <TextInput
                                placeholder="MM/YY"
                                style={styles.flex1}
                                value={`${cardData.expirationMonth}/${cardData.expirationYear}`}
                                onChangeText={handleExpirationDateChange}
                                maxLength={5}
                                keyboardType='numeric'
                                />
                                <TextInput
                                placeholder="CVV"
                                style={styles.flex1}
                                value={cardData.cvv}
                                onChangeText={(text) => setCardData({ ...cardData, cvv: text.replace(/\D/g, '') })} 
                                maxLength={3}
                                keyboardType="numeric"
                                />
                            </View>
                        </View>
                        {/* FIN COMPONENTE ADD CARD */}


                        <TouchableOpacity style={styles.button} onPress={handleAddCard} >
                            <View style={styles.buttonContent}>
                                <Entypo name="credit-card" size={24} color="white" />
                                <Text style={styles.buttonTextLeft}> AGREGAR TARJETA</Text>
                            </View>
                        </TouchableOpacity>

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
        alignItems: 'center',
        justifyContent: 'center',
    },
    labelContainer: {
        marginBottom: 4,
      },
      label: {
        color: 'gray',
      },
    input: {
        width: '100%',
        marginBottom: 12,
        paddingHorizontal: 8,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Sizes.fixPadding,
        borderRadius: Sizes.fixPadding + 25,
        borderColor: '#e0e0e0',
        borderWidth: 0.50,
        elevation: 2.0,
        backgroundColor: Colors.whiteColor,
        marginHorizontal: Sizes.fixPadding * 2.0,
        height: 60.0,

    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    flex1: {
        flex: 1,
        marginRight: 4,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Sizes.fixPadding,
        borderRadius: Sizes.fixPadding + 25,
        borderColor: '#e0e0e0',
        borderWidth: 0.50,
        elevation: 2.0,
        backgroundColor: Colors.whiteColor,
        marginHorizontal: Sizes.fixPadding * 2.0,
        height: 60.0,
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

export default AddCardScreen;