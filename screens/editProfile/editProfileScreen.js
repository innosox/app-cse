import React, { useEffect, useState } from "react";
import { SafeAreaView, View, StatusBar, ScrollView, StyleSheet, TouchableOpacity, Image, Text, Alert } from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import { MaterialIcons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';
import { BottomSheet } from '@rneui/themed';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { mainApi } from "../../api/mainApi";

const EditProfileScreen = ({ navigation }) => {

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
        }
      }

    const [fullName, setFullName] = useState(userData?.soci_nomb);
    const [lastName, setLastName] = useState(userData?.soci_apel);
    const [address, setAddress] = useState(userData?.soci_dire);
    const [email, setEmail] = useState(userData?.soci_mail);
    const [mobileNo, setMobileNo] = useState(userData?.soci_celu);
    const [showBottomSheet, setShowBottomSheet] = useState(false);
    
    // Similarmente, agrega efectos secundarios para otros campos según sea necesario
    const updateState = (data) => {
        // Actualiza el estado correspondiente según el campo que se está modificando
        if (data.fullName !== undefined) setFullName(data.fullName);
        if (data.lastName !== undefined) setLastName(data.lastName);
        if (data.address !== undefined) setAddress(data.address);
        if (data.email !== undefined) setEmail(data.email);
        if (data.mobileNo !== undefined) setMobileNo(data.mobileNo);
        if (data.showBottomSheet !== undefined) setShowBottomSheet(data.showBottomSheet);
    };

    // Agrega un efecto secundario para actualizar los campos cuando userData cambie
    useEffect(() => {
        setFullName(userData?.soci_nomb);
        setLastName(userData?.soci_apel);
        setAddress(userData?.soci_dire);
        setEmail(userData?.soci_mail);
        setMobileNo(userData?.soci_celu);
    }, [userData]);

    useEffect(() => {
        obtenerDataUsuario({})
    }, []);
    
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1 }}>
                {header()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ margin: Sizes.fixPadding * 2.0, alignSelf: 'center', alignItems: 'center' }}>
                        <Image
                            source={require('../../assets/images/users/fotoperfil.jpeg')}
                            style={{ width: 100.0, height: 100.0, borderRadius: 50.0, }}
                        />
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => updateState({ showBottomSheet: true })}
                            style={styles.cameraIconWrapStyle}
                        >
                            <Entypo name="camera" size={12} color={Colors.whiteColor} />
                        </TouchableOpacity>
                    </View>

            
                <TextInput
                    label="Nombre"
                    value={fullName}
                    onChangeText={text => updateState({ fullName: text })}
                    mode='outlined'
                    selectionColor={Colors.primaryColor}
                    style={styles.textFieldStyle}
                    theme={{ colors: { primary: Colors.primaryColor, underlineColor: 'transparent', } }}
                />

                <TextInput
                    label="Apellido"
                    value={lastName}
                    onChangeText={text => updateState({ lastName: text })}
                    mode='outlined'
                    selectionColor={Colors.primaryColor}
                    style={styles.textFieldStyle}
                    theme={{ colors: { primary: Colors.primaryColor, underlineColor: 'transparent', } }}
                />

                
                <TextInput
                    label="Dirección"
                    value={address}
                    onChangeText={text => updateState({ address: text })}
                    mode='outlined'
                    selectionColor={Colors.primaryColor}
                    style={styles.textFieldStyle}
                    theme={{ colors: { primary: Colors.primaryColor, underlineColor: 'transparent', } }}
                />

                <TextInput
                    label="Celular"
                    value={mobileNo}
                    onChangeText={text => updateState({ mobileNo: text })}
                    mode='outlined'
                    selectionColor={Colors.primaryColor}
                    style={styles.textFieldStyle}
                    theme={{ colors: { primary: Colors.primaryColor, underlineColor: 'transparent', } }}
                    keyboardType='numeric'
                />
                <TextInput
                    label="Telefono"
                    value={mobileNo}
                    onChangeText={text => updateState({ mobileNo: text })}
                    mode='outlined'
                    selectionColor={Colors.primaryColor}
                    style={styles.textFieldStyle}
                    theme={{ colors: { primary: Colors.primaryColor, underlineColor: 'transparent', } }}
                    keyboardType='numeric'
                />


                <TextInput
                    label="E-mail"
                    value={email}
                    onChangeText={text => updateState({ email: text })}
                    mode='outlined'
                    selectionColor={Colors.primaryColor}
                    style={styles.textFieldStyle}
                    theme={{ colors: { primary: Colors.primaryColor, underlineColor: 'transparent', } }}
                    keyboardType="email-address"
                />
            
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.pop()}
                    style={styles.saveButtonStyle}
                >
                    <Text style={{ ...Fonts.whiteColor18ExtraBold }}>
                        Guardar
                    </Text>
                </TouchableOpacity>

                </ScrollView>
            </View>
            {changeProfilePicOptionsSheet()}
        </SafeAreaView>
    )

    function changeProfilePicOptionsSheet() {
        return (
            <BottomSheet
                isVisible={showBottomSheet}
                containerStyle={{ backgroundColor: 'rgba(0.5, 0.50, 0, 0.50)' }}
                onBackdropPress={() => { updateState({ showBottomSheet: false }) }}
            >
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => updateState({ showBottomSheet: false })}
                    style={styles.changeProfilePicBottomSheetStyle}
                >
                    <Text style={{ ...Fonts.blackColor18Bold }}>
                        Choose Option
                    </Text>
                    <View style={{ marginTop: Sizes.fixPadding + 2.0, flexDirection: 'row', }}>
                        {changeProfilePicOptionsSort({
                            bgColor: '#009688',
                            icon: <Entypo name="camera" size={22} color={Colors.whiteColor} />,
                            option: 'Camera'
                        })}
                        <View style={{ marginHorizontal: Sizes.fixPadding * 4.0, }}>
                            {changeProfilePicOptionsSort({
                                bgColor: '#00A7F7',
                                icon: <MaterialCommunityIcons name="image" size={24} color={Colors.whiteColor} />,
                                option: 'Gallery'
                            })}
                        </View>
                        {changeProfilePicOptionsSort({
                            bgColor: '#DD5A5A',
                            icon: <MaterialCommunityIcons name="delete" size={24} color={Colors.whiteColor} />,
                            option: 'Remove photo'
                        })}
                    </View>
                </TouchableOpacity>
            </BottomSheet>
        )
    }

    function changeProfilePicOptionsSort({ bgColor, icon, option }) {
        return (
            <View>
                <View style={{
                    ...styles.changeProfilePicOptionsIconWrapStyle,
                    backgroundColor: bgColor,
                }}>
                    {icon}
                </View>
                <Text style={{ marginTop: Sizes.fixPadding - 5.0, width: 50.0, ...Fonts.grayColor13SemiBold }}>
                    {option}
                </Text>
            </View>
        )
    }

    function saveButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.pop()}
                style={styles.saveButtonStyle}
            >
                <Text style={{ ...Fonts.whiteColor18ExtraBold }}>
                    Guardar
                </Text>
            </TouchableOpacity>
        )
    }

    function passwordTextField() {
        return (
            <TextInput
                label="Password"
                value={password}
                onChangeText={text => updateState({ password: text })}
                mode='outlined'
                selectionColor={Colors.primaryColor}
                style={styles.textFieldStyle}
                theme={{ colors: { primary: Colors.primaryColor, underlineColor: 'transparent', } }}
                secureTextEntry={true}
            />
        )
    }

    function mobileNoTextField() {
        return (
            <>
                <TextInput
                    label="Celular"
                    value={mobileNo}
                    onChangeText={text => updateState({ mobileNo: text })}
                    mode='outlined'
                    selectionColor={Colors.primaryColor}
                    style={styles.textFieldStyle}
                    theme={{ colors: { primary: Colors.primaryColor, underlineColor: 'transparent', } }}
                    keyboardType='numeric'
                />
                <TextInput
                    label="Telefono"
                    value={mobileNo}
                    onChangeText={text => updateState({ mobileNo: text })}
                    mode='outlined'
                    selectionColor={Colors.primaryColor}
                    style={styles.textFieldStyle}
                    theme={{ colors: { primary: Colors.primaryColor, underlineColor: 'transparent', } }}
                    keyboardType='numeric'
                />
            </>
        )
    }

    function emailTextField() {
        return (
            <TextInput
                label="E-mail"
                value={email}
                onChangeText={text => updateState({ email: text })}
                mode='outlined'
                selectionColor={Colors.primaryColor}
                style={styles.textFieldStyle}
                theme={{ colors: { primary: Colors.primaryColor, underlineColor: 'transparent', } }}
                keyboardType="email-address"
            />
        )
    }

    function fullNameTextField() {
        return (
            <>
                <TextInput
                    label="Nombre"
                    value={fullName}
                    onChangeText={text => updateState({ fullName: text })}
                    mode='outlined'
                    selectionColor={Colors.primaryColor}
                    style={styles.textFieldStyle}
                    theme={{ colors: { primary: Colors.primaryColor, underlineColor: 'transparent', } }}
                />

                <TextInput
                    label="Apellido"
                    value={lastName}
                    onChangeText={text => updateState({ lastName: text })}
                    mode='outlined'
                    selectionColor={Colors.primaryColor}
                    style={styles.textFieldStyle}
                    theme={{ colors: { primary: Colors.primaryColor, underlineColor: 'transparent', } }}
                />

                
                <TextInput
                    label="Dirección"
                    value={address}
                    onChangeText={text => updateState({ address: text })}
                    mode='outlined'
                    selectionColor={Colors.primaryColor}
                    style={styles.textFieldStyle}
                    theme={{ colors: { primary: Colors.primaryColor, underlineColor: 'transparent', } }}
                />
            </>
        )
    }

    function profilePic() {
        return (
            <View style={{ margin: Sizes.fixPadding * 2.0, alignSelf: 'center', alignItems: 'center' }}>
                <Image
                    source={require('../../assets/images/users/fotoperfil.jpeg')}
                    style={{ width: 100.0, height: 100.0, borderRadius: 50.0, }}
                />
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => updateState({ showBottomSheet: true })}
                    style={styles.cameraIconWrapStyle}
                >
                    <Entypo name="camera" size={12} color={Colors.whiteColor} />
                </TouchableOpacity>
            </View>
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <MaterialIcons
                    name="arrow-back"
                    color={Colors.whiteColor}
                    size={22}
                    onPress={() => navigation.pop()}
                />
                <Text style={{ marginLeft: Sizes.fixPadding, flex: 1, ...Fonts.whiteColor20Bold }}>
                    Actualización de mi información
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
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primaryColor,
        borderBottomLeftRadius: Sizes.fixPadding + 5.0,
        borderBottomRightRadius: Sizes.fixPadding + 5.0,
    },
    cameraIconWrapStyle: {
        position: 'absolute',
        bottom: 3.0,
        right: 5.0,
        width: 28.0, height: 28.0,
        borderRadius: 14.0,
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Colors.whiteColor,
        borderWidth: 1.8,
        elevation: 4.0,
    },
    textFieldStyle: {
        marginBottom: Sizes.fixPadding + 10.0,
        ...Fonts.blackColor16SemiBold,
        backgroundColor: Colors.whiteColor,
        marginHorizontal: Sizes.fixPadding * 2.0,
    },
    saveButtonStyle: {
        backgroundColor: Colors.primaryColor,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 2.0,
        alignItems: 'center', justifyContent: 'center',
        paddingVertical: Sizes.fixPadding + 2.0,
        borderRadius: Sizes.fixPadding - 5.0,
        shadowColor: Colors.primaryColor,
        elevation: 5.0,
        borderColor: 'rgba(34, 105, 190, 0.7)',
        borderWidth: 1.0,
    },
    changeProfilePicBottomSheetStyle: {
        backgroundColor: Colors.whiteColor,
        borderTopLeftRadius: Sizes.fixPadding + 5.0,
        borderTopRightRadius: Sizes.fixPadding + 5.0,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding + 5.0,
    },
    changeProfilePicOptionsIconWrapStyle: {
        width: 50.0,
        height: 50.0,
        borderRadius: 25.0,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default EditProfileScreen;