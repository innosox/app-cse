import React, { useState, useEffect } from "react";
import { SafeAreaView, 
  View, 
  StatusBar, 
  Dimensions, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  StyleSheet, 
  Text,
  Alert, 
  ActivityIndicator,
  Linking} 
from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { mainApi } from "../../api/mainApi";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');


const LoginScreen = ({ navigation }) => {

  //const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  // function para logearse
  const loginData = async (data) => {
    //console.log(data)
    setIsLoading(true);
    try {
      //const token = 'suyjdiobdiud,f'
      const response = await mainApi.post('/login', data, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        }
      })

      //console.log(response.status)
      
      const {access_token} = response.data;
      await AsyncStorage.setItem('access_token', access_token);
      //console.log('acces_token_response', access_token);
      //Alert.alert('Petición Exitosa', `${JSON.stringify(response.data.message)}`);
      //Alert.alert('Petición Exitosa', 'Te has logeado correctamente');
      setIsLoading(false);
      navigation.navigate('BottomTabBar');

    } catch (error) {
      //console.log(error)
      Alert.alert('Ha ocurrido un error', `${error}`);
      setIsLoading(false);

    }
    
  }



  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);


  const [state, setState] = useState({
      securePassword: true,
      rememberPassword: false,
  })

  const updateState = (data) => setState((state) => ({ ...state, ...data }))

  const {
      securePassword,
      rememberPassword,
  } = state;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
    <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
    <View style={{ flex: 1 }}>
        {
            header()
        }
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: Sizes.fixPadding }}
        >
           <Text style={{ textAlign: 'center', margin: Sizes.fixPadding * 2.0, ...Fonts.blackColor20Bold }}>
                Iniciar Sesion
            </Text>
         
            <View style={{ ...styles.textFieldWrapStyle }}>
                <MaterialIcons
                    name="email"
                    color={Colors.grayColor}
                    size={18}
                />
                <TextInput
                    placeholder="Email o Cédula"
                    placeholderTextColor={Colors.grayColor}
                    style={{ flex: 1, ...Fonts.blackColor14Regular, 
                      marginLeft: Sizes.fixPadding, }}
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    selectionColor={Colors.primaryColor}
                    keyboardType="email-address"
                />
            </View>

            <View style={{ ...styles.textFieldWrapStyle, marginTop: Sizes.fixPadding + 10.0, }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcons
                        name="lock"
                        color={Colors.grayColor}
                        size={18}
                    />
                    <TextInput
                        secureTextEntry={securePassword}
                        placeholder="Contraseña"
                        placeholderTextColor={Colors.grayColor}
                        style={{ flex: 1, ...Fonts.blackColor14Regular, marginLeft: Sizes.fixPadding, }}
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                    />
                </View>
                <MaterialIcons
                    name={securePassword ? "visibility-off" : 'visibility'}
                    color={Colors.grayColor}
                    size={16}
                    onPress={() => updateState({ securePassword: !securePassword })}
                />
            </View>

            <View style={styles.rememberPassordAndForgetInfoWrapStyle}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => updateState({ rememberPassword: !rememberPassword })}
                        style={{
                            ...styles.checkBoxStyle,
                            backgroundColor: rememberPassword ? Colors.primaryColor : 'transparent'
                        }}
                    >
                        {
                            rememberPassword ?
                                <MaterialIcons
                                    name="done"
                                    color={Colors.whiteColor}
                                    size={12}
                                />
                                :
                                null
                        }
                    </TouchableOpacity>
                    <Text style={{ marginLeft: Sizes.fixPadding - 3.0, ...Fonts.primaryColor12SemiBold }}>
                    Recordar contraseña
                    </Text>
                </View>
                <Text style={{ ...Fonts.redColor12SemiBold }}>
                    ¿Contraseña olvidada?
                </Text>
            </View>

            <TouchableOpacity
                activeOpacity={0.8}
//                onPress={() => navigation.push('BottomTabBar')}
                  //onPress={handleSubmit}
                  onPress={() =>{
                    loginData({ username: email, password: password});
                  }}

                style={styles.loginButtonStyle}
                disabled={isLoading} //Evita múltiples clics mientras se está cargando
            >
                {isLoading ? (
                <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                <Text style={{ ...Fonts.whiteColor18ExtraBold }}>
                    INGRESAR
                </Text>
                )}

            </TouchableOpacity>

            
            <Text style={{ textAlign: 'center', ...Fonts.grayColor16SemiBold }}>
                O inicia sesión con
            </Text>

            <Text style={{ textAlign: 'center' }}>
                <Text style={{ ...Fonts.grayColor14SemiBold }}>
                ¿No tienes una cuenta?{` `}
                </Text>
                <Text
                    onPress={() => navigation.push('MyTicket')}
                    //onPress={() => Linking.openURL('https://demo.emelec.com.ec/socios/')}
                    style={{ ...Fonts.primaryColor14SemiBold }}
                >
                    Registrate ahora
                </Text>
            </Text>
        </ScrollView>
    </View>
</SafeAreaView>
  );
  
  function header() {
    return (
        <View style={styles.headerWrapStyle}>
            <Image
                source={require('../../assets/images/logo-socio-2023-emelec-blanco.png')}
                /*source={{
                    uri: '../../assets/images/logo-socio-2023-emelec-blanco.png',
                  }}*/
                style={{ height: height / 9.5, width: '100%', resizeMode: 'contain' }}
            />
        
        </View>
    )
}

}


const styles = StyleSheet.create({
  headerWrapStyle: {
      height: height / 6.5,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.primaryColor,
      borderBottomLeftRadius: Sizes.fixPadding + 5.0,
      borderBottomRightRadius: Sizes.fixPadding + 5.0,
  },
  textFieldWrapStyle: {
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
  checkBoxStyle: {
      borderColor: Colors.primaryColor,
      borderWidth: 1.0,
      width: 16.0,
      height: 16.0,
      borderRadius: 2.0,
      alignItems: 'center',
      justifyContent: 'center',
  },
  rememberPassordAndForgetInfoWrapStyle: {
      marginTop: Sizes.fixPadding,
      marginHorizontal: Sizes.fixPadding * 2.5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
  },
  loginButtonStyle: {
      backgroundColor: Colors.primaryColor,
      marginHorizontal: Sizes.fixPadding * 2.0,
      marginTop: Sizes.fixPadding * 2.5,
      marginBottom: Sizes.fixPadding + 5.0,
      alignItems: 'center', justifyContent: 'center',
      paddingVertical: Sizes.fixPadding + 2.0,
      borderRadius: Sizes.fixPadding + 25,
      shadowColor: Colors.primaryColor,
      elevation: 5.0,
      //borderColor: 'rgba(34, 105, 190, 0.7)',
      borderWidth: 1.0,
      height: 60.0,

  },
  googleAndFacebookButtonStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.whiteColor,
      borderRadius: Sizes.fixPadding - 5.0,
      borderColor: '#e0e0e0',
      borderWidth: 0.50,
      paddingVertical: Sizes.fixPadding,
      elevation: 2.0,
      marginHorizontal: Sizes.fixPadding,
  },
  googleAndFacebookButtonWrapStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: Sizes.fixPadding,
  }
});


export default LoginScreen;

