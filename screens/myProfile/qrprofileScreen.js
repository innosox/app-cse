import React, { useState } from "react";
import { SafeAreaView, View, StatusBar, TextInput, TouchableOpacity, Dimensions, ScrollView, Image, StyleSheet, Text, FlatList } from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import { MaterialIcons, AntDesign, MaterialCommunityIcons, Entypo   } from '@expo/vector-icons';
import { ImageBackground, useColorScheme  } from "react-native";
import QRCode from 'react-qr-code';
const { height } = Dimensions.get('window');


const QrprofileScreen = ({ navigation }) => {

    const [state, setState] = useState({
        fullName: null,
        email: null,
        mobileNo: null,
        password: null,
        securePassword: true,
        confirmPassword: null,
        secureConfirmPassword: true,
    })
    const colorScheme = useColorScheme(); // Obtener el tema del dispositivo

    // Determinar el color de fondo según el tema
    const backgroundColor = colorScheme === 'dark' ? 'black' : 'white';

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        fullName,
        email,
        mobileNo,
        password,
        securePassword,
        confirmPassword,
        secureConfirmPassword,
    } = state;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1 }}>
                {header()}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: Sizes.fixPadding }}
                >
                    {amigos()}
                </ScrollView>
            </View>
        </SafeAreaView>
    )

    

    function amigos(){
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={{
                    borderRadius: Sizes.fixPadding - 5.0,
                    marginHorizontal: Sizes.fixPadding * 2.0,
                    marginBottom: 5,
                }}
            >
            <View style={{ height: 30 }} />

            <View style={styles.card}>
                <QRCode 
                value='30' 
                size={250}
                color="black"
                backgroundColor={backgroundColor} 
                />
            </View>    
            <Text style={{ textAlign: 'center', margin: Sizes.fixPadding * 2.0, ...Fonts.blackColor20Bold }}>
                QR DE ACCESO
            </Text>
            </TouchableOpacity>
        )
    }


    function header() {
        return (
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
                       QR de acceso 
                    </Text>
                </View>
            </View>
        )
    }
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
        width: '100%',
        aspectRatio: 1.650, // Aspect ratio of a standard credit card
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: Sizes.fixPadding,
        alignItems: 'center',

      },
      cardBackground: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
      },
      cardContent: {
        flexDirection: 'column',
      },
      cardName: {
        fontSize: 16,
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
      },
});

export default QrprofileScreen;