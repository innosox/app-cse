import React, { useState, useEffect } from "react";
import { SafeAreaView, View, StatusBar, TextInput, TouchableOpacity, Dimensions, ScrollView, Image, 
    StyleSheet, Text, FlatList, Alert, Button } 
from "react-native";

import { Colors, Fonts, Sizes, } from "../../constants/styles";
import { MaterialIcons, FontAwesome   } from '@expo/vector-icons';
import { ImageBackground, useColorScheme  } from "react-native";
import QRCode from 'react-qr-code';
import { RefreshControl } from "react-native";
import { mainApiEvent } from "../../api/mainApi";
import { color } from "@rneui/themed/dist/config";

const { height } = Dimensions.get('window');
import { useNavigation } from '@react-navigation/native';

const SearchFriendScreen = ({ navigation }) => {

    const data = [
        { id: '1', name: 'Item 1' },
        { id: '2', name: 'Item 2' },
        { id: '3', name: 'Item 3' },
        // Agrega más datos aquí
      ];

      const [searchText, setSearchText] = useState('');
      const [filteredData, setFilteredData] = useState(data);
    
      const handleSearch = (text) => {
        setSearchText(text);
        const filtered = data.filter((item) =>
          item.name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredData(filtered);
      };
      

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
                    <TouchableOpacity key={item.id}>
                        <Text style={styles.resultText}>{item.name}</Text>
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