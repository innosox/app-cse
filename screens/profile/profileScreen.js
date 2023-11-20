import React, { useEffect, useState } from "react";
import { SafeAreaView, View, StatusBar, ScrollView, Image, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { Overlay } from "@rneui/themed";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mainApi } from "../../api/mainApi";


const ProfileScreen = ({ navigation }) => {

    const [showLogoutDialog, setshowLogoutDialog] = useState(false)
    const [userData, setUserData] = useState(null); 

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
            //navigation.navigate('Login');
        }
        
      }

    useEffect(() => {
        obtenerDataUsuario({})
    }, []);


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1 }}>
                <View style={styles.headerWrapStyle}>
                    <Text style={{ ...Fonts.whiteColor20Bold }}>
                        Perfil
                    </Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 7.0 }}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.push('EditProfile', { id: "photo" })}
                >
                    <View style={styles.profileInfoWrapStyle}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                source={require('../../assets/images/users/fotoperfil.jpeg')}
                                style={{ width: 60.0, height: 60.0, borderRadius: 30.0, }}
                            />
                            <View style={{ flex: 1, marginLeft: Sizes.fixPadding, }}>
                                <Text style={{ ...Fonts.grayColor14SemiBold }}>
                                    Hola,
                                </Text>
                                <Text style={{ ...Fonts.blackColor16SemiBold }}>
                                { userData?.soci_nomb } { userData?.soci_apel }
                                </Text>
                            </View>
                        </View>
                        <MaterialIcons
                            name="arrow-forward-ios"
                            color={Colors.blackColor}
                            size={18}
                            //onPress={() => navigation.push('EditProfile', { id: "photo" })}
                        />
                    </View>
                </TouchableOpacity>

                {/*DIVISION*/}
                <View
                style={{ backgroundColor: Colors.lightGrayColor, height: 1.0, marginHorizontal: Sizes.fixPadding * 2.0, }}
                />
                <View>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => navigation.push('SearchFriend')}
                    >
                        {profileOptionsSort({ optionTitle: 'Amigos', optionDescription: 'Mis Amigos' })}
                    </TouchableOpacity>
                    <View
                    style={{ backgroundColor: Colors.lightGrayColor, height: 1.0, marginHorizontal: Sizes.fixPadding * 2.0, }}
                    />
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('ListFriend')}
                    >
                        {profileOptionsSort({ optionTitle: 'Boletos', optionDescription: 'Lista de boletos comprados' })}
                    </TouchableOpacity>
                    <View
                    style={{ backgroundColor: Colors.lightGrayColor, height: 1.0, marginHorizontal: Sizes.fixPadding * 2.0, }}
                    />
                    <TouchableOpacity
                        activeOpacity={0.8}
                        //onPress={() => navigation.navigate('Notification')}
                    >
                    
                        {profileOptionsSort({ optionTitle: 'Notificaciones', optionDescription: 'Conozca la actividad de su cuenta' })}
                    </TouchableOpacity>
                    <View
                    style={{ backgroundColor: Colors.lightGrayColor, height: 1.0, marginHorizontal: Sizes.fixPadding * 2.0, }}
                    />
                    <TouchableOpacity
                        activeOpacity={0.8}
                        //onPress={() => navigation.push('TermsAndConditions')}
                    >
                        {profileOptionsSort({ optionTitle: 'Terminos & Condiciones', optionDescription: 'Conozca la política del Club' })}
                    </TouchableOpacity>
                    <View
                    style={{ backgroundColor: Colors.lightGrayColor, height: 1.0, marginHorizontal: Sizes.fixPadding * 2.0, }}
                    />
                    <TouchableOpacity
                        activeOpacity={0.8}
                        //onPress={() => navigation.push('FAQs')}
                    >
                        {profileOptionsSort({ optionTitle: 'Preguntas frecuentes', optionDescription: 'Obtenga respuesta a su pregunta' })}
                    </TouchableOpacity>

                    <View
                    style={{ backgroundColor: Colors.lightGrayColor, height: 1.0, marginHorizontal: Sizes.fixPadding * 2.0, }}
                    />
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setshowLogoutDialog(true)}
                    >
                        {profileOptionsSort({ optionTitle: 'Cerrar sesión', optionDescription: 'Cerrar sesión en su cuenta' })}
                    </TouchableOpacity>
                    <View
                    style={{ backgroundColor: Colors.lightGrayColor, height: 1.0, marginHorizontal: Sizes.fixPadding * 2.0, }}
                    />
                </View>


                </ScrollView>
                {logoutDialog()}
            </View>
        </SafeAreaView>
    )

    function logoutDialog() {
        return (
            <Overlay
                isVisible={showLogoutDialog}
                onBackdropPress={() => { setshowLogoutDialog(false) }}
                overlayStyle={styles.logoutDialogStyle}
            >
                <View style={{ backgroundColor: Colors.whiteColor, }}>
                    <View style={styles.logoutTitleWrapStyle}>
                        <Text style={{ ...Fonts.whiteColor20Bold }}>
                        Cerrar sesión
                        </Text>
                    </View>
                    <Text style={{ marginVertical: Sizes.fixPadding * 2.0, textAlign: 'center', ...Fonts.blackColor18Bold, }}>
                        ¿Estás seguro(a) de cerrar sesión?
                    </Text>
                    <View style={styles.cancelAndLogoutButtonWrapStyle}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => setshowLogoutDialog(false)}
                            style={styles.cancelAndLogoutButtonStyle}
                        >
                            <Text style={{ ...Fonts.whiteColor18ExtraBold }}>
                                No
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => {
                                setshowLogoutDialog(false)
                                navigation.push('Login')
                            }}
                            style={styles.cancelAndLogoutButtonStyle}
                        >
                            <Text style={{ ...Fonts.whiteColor18ExtraBold }}>
                            SI
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Overlay>
        )
    }


    function profileOptionsSort({ optionTitle, optionDescription, navigateTo }) {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginVertical: Sizes.fixPadding, }}>
                <Text style={{ ...Fonts.blackColor16SemiBold }}>
                    {optionTitle}
                </Text>
                <Text style={{ ...Fonts.grayColor12SemiBold }}>
                    {optionDescription}
                </Text>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    headerWrapStyle: {
        paddingTop: Sizes.fixPadding * 2.0,
        paddingBottom: Sizes.fixPadding + 5.0,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        backgroundColor: Colors.primaryColor,
        borderBottomLeftRadius: Sizes.fixPadding + 5.0,
        borderBottomRightRadius: Sizes.fixPadding + 5.0,
    },
    profileInfoWrapStyle: {
        marginTop: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding + 5.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    logoutDialogStyle: {
        width: '80%',
        padding: 0.0,
        borderRadius: Sizes.fixPadding + 5.0,
        overflow: 'hidden'
    },
    cancelAndLogoutButtonStyle: {
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding + 25.0,
        shadowColor: Colors.primaryColor,
        elevation: 5.0,
        //borderColor: 'rgba(34, 105, 190, 0.7)',
        borderWidth: 1.0,
        flex: 1, marginHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelAndLogoutButtonWrapStyle: {
        marginHorizontal: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding * 2.0,
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoutTitleWrapStyle: {
        backgroundColor: Colors.primaryColor,
        paddingVertical: Sizes.fixPadding,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default ProfileScreen;