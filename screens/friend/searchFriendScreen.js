import React, { useState, useEffect } from "react";
import { SafeAreaView, View, StatusBar, TextInput, TouchableOpacity, Dimensions, ScrollView, Image, 
    StyleSheet, Text, FlatList, Alert, Button } 
from "react-native";

import { Colors, Fonts, Sizes, } from "../../constants/styles";
import { MaterialIcons, FontAwesome   } from '@expo/vector-icons';
import { ImageBackground, useColorScheme  } from "react-native";
import QRCode from 'react-qr-code';
import { RefreshControl } from "react-native";
import { mainApi, mainApiEvent } from "../../api/mainApi";
import { color } from "@rneui/themed/dist/config";

import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
33

const { height } = Dimensions.get('window');

const SearchFriendScreen = ({ navigation }) => {

    const [friend, setFriend] = useState([]);

    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState(friend);

      
    const handleSearch = async (text) => {
        setSearchText(text);
        if (text !== '') {
            try {

            const friendData = await getFriend(text);
            const filteredData = friendData.filter((item) =>
              item.soci_nomb + ' ' + item.soci_apel
            );
            setFilteredData(filteredData);

            } catch (error) {
            console.error('Error fetching friend data:', error);
            }
        } else {
            setFilteredData([]);
        }
    };
      
      
    const getFriend = async (text) => {    
        try { 
            const storedToken = await AsyncStorage.getItem('access_token');
            if (storedToken) {
                const url = `/buscar/amigo?search=${text}`
                const response = await mainApi.get(url, {
                headers: {
                    ...(storedToken && { Authorization: `Bearer ${storedToken}` })
                }
                })
                const userDataFromAPI = response.data.data;
                //console.log(userDataFromAPI)
                //setFriend(userDataFromAPI);
                return userDataFromAPI;
            }
        } catch (error) {
            Alert.alert('Ha ocurrido un error', `${error}`);    
            console.log(error)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
          <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
          <ScrollView
            style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                {/* INICIO HEADDER */}
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
                        Buscar Amigos
                        </Text>
                    </View>
                </View>
                {/* FIN HEADDER */}
            </View>

            <View style={{ paddingHorizontal: Sizes.fixPadding * 2 }}>
                <View style={styles.searchInput}>
                    <FontAwesome name="search" size={24} color="black" style={{ marginRight: 10 }} />
                    <TextInput
                    placeholder="Buscar Amigos ..."
                    value={searchText}
                    onChangeText={(text) => handleSearch(text)}
                    />
                </View>
                <View style={styles.resultContainer}>
                    {filteredData.map((item) => (

                    <TouchableOpacity key={item?.soci_id}>
                        <Text style={styles.resultText}>{item?.soci_nomb} {item?.soci_apel}</Text>
                    </TouchableOpacity>

                    ))}
                    
                </View>
            </View>




          </ScrollView>



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
    searchInput: {
        //borderWidth: 1,
        //borderColor: Colors.primaryColor,
        marginTop: 10,
        marginBottom: 24,
        padding: 15,
        borderRadius: 35,
        backgroundColor: '#D5D5D5',
        flexDirection: 'row',
        alignItems: 'left',
        justifyContent: 'left',
      },
      resultContainer: {
        marginTop: 10,
      },
      resultText: {
        fontSize: 16,
        padding: 10,
        borderWidth: 1,
        borderColor: Colors.primaryColor,
        borderRadius: 5,
        marginBottom: 5,
      },
});

export default SearchFriendScreen;