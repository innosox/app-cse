import React, { useState, useEffect } from "react";
import { SafeAreaView, View, StatusBar, TextInput, TouchableOpacity, Dimensions, ScrollView, Image, 
    StyleSheet, Text, FlatList, Alert, Button } 
from "react-native";

import { Colors, Fonts, Sizes, } from "../../constants/styles";
import { MaterialIcons, FontAwesome, Ionicons   } from '@expo/vector-icons';
import { useColorScheme, useWindowDimensions   } from "react-native";

import { RefreshControl } from "react-native";
import { mainApi, mainApiEvent } from "../../api/mainApi";

import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TabView, SceneMap } from 'react-native-tab-view';

const { height } = Dimensions.get('window');

const ListFriendScreen = ({ navigation }) => {

    const [isLoading, setIsLoading] = useState(false);

    const Friends = () => (
      <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
        {/* Content for the First Tab */}
        <Text>Mis amigos</Text>
      </View>
    );
  
    const PendingConfirmation = () => (
      <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
        {/* Content for the Second Tab */}
        <Text>Amigos pendientes por confirmar</Text>
      </View>
    );
    
    const PendingAccept = () => (
        <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
          {/* Content for the Second Tab */}
          <Text>Solicitudes pendientes por aceptar</Text>
        </View>
      );

    const renderScene = SceneMap({
      first: Friends,
      second: PendingConfirmation,
      third: PendingAccept,
    });
  
    const layout = useWindowDimensions();
  
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
      { key: 'first', title: 'Amigos' },
      { key: 'second', title: 'Confirmar' },
      { key: 'third', title: 'Aceptar' },
    ]);


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
        <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
        <View style={{ flex: 1 }}>
          {/* CABECERA */}
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
                Lista Amigos
              </Text>
            </View>
          </View>
          {/* FIN DE CABECERA */}

        {/* VISTA DE PESTAÑA */}
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          style={{ marginTop: 0, backgroundColor: Colors.primaryColor }} // Ajusta este valor según tus necesidades
          tabBarStyle={{ backgroundColor: '#ffghr' }} // Ajusta el color de fondo de las pestañas
        />


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
});

export default ListFriendScreen;