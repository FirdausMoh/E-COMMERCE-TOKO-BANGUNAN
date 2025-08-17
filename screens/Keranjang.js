import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import {
  Heading,
  View,
  Radio,
  Text,
  Box,
  Image,
  Button,
  HStack,
  VStack,
  FormControl,
  Input,
  Modal,
  ScrollView,
  Center,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import ScreenTop from "../components/ScreenTop2";
import FIREBASE from "../config/FIREBASE";
import { useNavigation } from "@react-navigation/native";

const Keranjang = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const getCartItems = async () => {
      try {
        const storedCart = await AsyncStorage.getItem("keranjang");
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          console.log(
            "berhasil dapat data keranjang dari AsyncStorage:",
            parsedCart
          );
          setCartItems(parsedCart);
        }
      } catch (error) {
        console.error("Gagal mengambil data keranjang:", error);
      }
    };

    getCartItems();
  }, []);

  const updateCart = async (updatedCartItems) => {
    try {
      await AsyncStorage.setItem("keranjang", JSON.stringify(updatedCartItems));
    } catch (error) {
      console.error("Gagal menyimpan data keranjang:", error);
    }
  };

  const removeFromCart = (index) => {
    const updatedCartItems = [...cartItems];
    updatedCartItems.splice(index, 1);
    setCartItems(updatedCartItems);
    updateCart(updatedCartItems);
  };
  const increaseQuantity = (index) => {
    const updatedCartItems = [...cartItems];
    updatedCartItems[index].quantity =
      (updatedCartItems[index].quantity || 0) + 1;
    setCartItems(updatedCartItems);
    updateCart(updatedCartItems);
  };

  const decreaseQuantity = (index) => {
    const updatedCartItems = [...cartItems];
    if (updatedCartItems[index].quantity > 1) {
      updatedCartItems[index].quantity -= 1;
      setCartItems(updatedCartItems);
      updateCart(updatedCartItems);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.harga || 0) * (item.quantity || 0);
    }, 0);
  };

  const formatToRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", { currency: "IDR" }).format(amount);
  };

  return (
    <View flex={1}>
      <ScreenTop shadow={3} />
      <Box m={5}>
        <Text fontSize={20} fontWeight={"bold"} color={"#006664"}>
          Keranjang Saya
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {cartItems.map((item, index) => (
            <Box
              key={index}
              backgroundColor={"white"}
              mt={4}
              shadow={3}
              borderWidth={2}
              borderColor={"#006664"}
              rounded={10}
            >
              <HStack justifyContent={"space-between"}>
                <Box
                  mx={2}
                  my={4}
                  backgroundColor={"white"}
                  w={"25%"}
                  rounded={20}
                >
                  <Image
                    source={{ uri: item.gambar }}
                    resizeMode="contain"
                    h={20}
                    alt="gambar"
                    my={5}
                  />
                </Box>
                <Box w={"45%"}>
                  <VStack mx={2} my={4}>
                    <Box>
                      <Text fontSize={18} fontWeight={"bold"}>
                        {item.namaproduct}
                      </Text>
                      <Text fontSize={12} color={"gray.400"}>
                        Biaya Pengiriman Dihitung Saat Checkout
                      </Text>
                    </Box>
                    <Box mt={2}>
                      <Heading fontSize={18} color={"#006664"}>
                        Rp {formatToRupiah(item.harga)}
                      </Heading>
                      <Box flexDirection={"row"} alignItems={"center"}>
                        <TouchableOpacity
                          onPress={() => decreaseQuantity(index)}
                        >
                          <Ionicons
                            name="remove-circle"
                            size={25}
                            color="#006664"
                          />
                        </TouchableOpacity>
                        <Text mx={2}>{item.quantity}</Text>
                        <TouchableOpacity
                          onPress={() => increaseQuantity(index)}
                        >
                          <Ionicons
                            name="add-circle"
                            size={25}
                            color="#006664"
                          />
                        </TouchableOpacity>
                      </Box>
                    </Box>
                  </VStack>
                </Box>

                <Button
                  onPress={() => removeFromCart(index)}
                  backgroundColor="#006664"
                  w={"20%"}
                  borderLeftRadius={0}
                  borderRightRadius={5}
                >
                  <Heading fontSize={14} color={"white"}>
                    Hapus
                  </Heading>
                </Button>
              </HStack>
            </Box>
          ))}
          <Box h={300}></Box>
        </ScrollView>
      </Box>
      <Box
        position="absolute"
        bottom={5}
        left={0}
        right={0}
        backgroundColor={"white"}
        p={3}
        m={4}
        rounded={30}
        shadow={8}
      >
        <HStack justifyContent={"space-between"} mx={2}>
          <Box mt={2}>
            <Heading fontSize={20} color={"#006664"}>
              Total : Rp {formatToRupiah(calculateTotal())}
            </Heading>
          </Box>

          <Box>
            <Button
              onPress={() => setShowSuccessModal(true)}
              backgroundColor={"#006664"}
              rounded={20}
            >
              <Text fontSize={16} fontWeight={"bold"} color={"white"}>
                Pembayaran
              </Text>
            </Button>
          </Box>
        </HStack>
        <Modal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
        >
          <Modal.Content>
            <Modal.Header>
              <Heading color={"#006664"} fontSize={20}>
                KODE PEMBAYARAN
              </Heading>
            </Modal.Header>
            <Modal.Body mt={4}>
              <Box backgroundColor={"white"} rounded={20}>
                <Center>
                  <Heading fontSize={20}>3167 0101 5812 508</Heading>
                </Center>
                <Box justifyContent={"flex-start"} mt={4}>
                  <Heading fontSize={14}>Tata Cara Pembayaran :</Heading>
                  <Text>
                    1. Gunakan layanan perbankan Anda (mobile banking, internet
                    banking, atau ATM) untuk melakukan transfer uang ke rekening
                    yang disediakan
                  </Text>
                  <Text>
                    2. Pastikan untuk memasukkan jumlah nominal yang benar
                  </Text>
                  <Text>
                    3. Simpan bukti transfer atau lakukan screenshoot pada bukti
                    transfer
                  </Text>
                  <Text>
                    4. Pergi Kehalaman Form Bukti Pembayaran pada profile
                  </Text>
                  <Text>
                    5. Isi form dengan lengkap dan upload foto bukti Pembayaran
                  </Text>
                  <Text>6. Pemesanan akan diproses</Text>
                </Box>

                <Button
                  m={10}
                  borderRadius={10}
                  onPress={async () => {
                    navigation.navigate("Pembayaran", {
                      cartItems,
                      totalHarga: calculateTotal(),
                    });
                    setShowSuccessModal(false);
                  }}
                  backgroundColor={"#006664"}
                >
                  <Heading color={"white"}>OK</Heading>
                </Button>
              </Box>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </Box>
    </View>
  );
};

export default Keranjang;
