import {
  Heading,
  ScrollView,
  Text,
  Box,
  Image,
  Button,
  HStack,
  Divider,
  VStack,
  Center,
} from "native-base";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenTop from "../components/ScreenTop";

const DetailProduct = ({ route }) => {
  const { namaproduct, harga, gambar, deskripsiproduct } = route.params.item;
  const navigation = useNavigation();
  const formatToRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", { currency: "IDR" }).format(amount);
  };

  const addToCart = async () => {
    try {
      const product = {
        gambar,
        namaproduct,
        harga,
      };

      let cartItems = await AsyncStorage.getItem("keranjang");
      if (!cartItems) {
        cartItems = [];
      } else {
        cartItems = JSON.parse(cartItems);
      }

      cartItems.push(product);
      await AsyncStorage.setItem("keranjang", JSON.stringify(cartItems));

      alert("Produk telah ditambahkan ke keranjang!");
    } catch (error) {
      console.error("Gagal menambahkan produk ke keranjang:", error);
    }
  };

  return (
    <>
      <ScreenTop />
      <ScrollView flex={1} backgroundColor={"gray.100"}>
        <Box mt={1}>
          <VStack>
            <Box backgroundColor={"gray.200"} w={"auto"}>
              <Center>
              <Image
                source={{ uri: gambar }}
                width={400}
                height={200}
                alt="gambar"
                resizeMode="contain"
              />
              </Center>
              
            </Box>
            <HStack mx={3} mt={4} justifyContent={"space-between"}>
              <Box flex={1}>
                <Heading fontSize={28} color={"gray.800"} mb={2}>
                  {namaproduct}
                </Heading>
                <Heading fontSize={18} color={"#006664"}>
                  Rp {formatToRupiah(harga)}
                </Heading>
                <Heading pb={10} fontSize={14} color={"gray.500"}>
                  Biaya pengiriman dihitung saat checkout
                </Heading>
              </Box>
            </HStack>
          </VStack>
          <Box mx={3}>
            <VStack>
              <Heading fontSize={18} color={"#006664"} mb={1}>
                Deskripsi Produk
              </Heading>
              <Divider
                mb={5}
                backgroundColor={"#006664"}
                thickness={3}
                w={160}
              ></Divider>
              <Text
                fontWeight={"semibold"}
                fontSize={16}
                color={"gray.500"}
                mr={2}
              >
                {deskripsiproduct}
              </Text>
            </VStack>
            <VStack>
              <Box m={10} pb={20}></Box>
            </VStack>
          </Box>
        </Box>
      </ScrollView>
      <Box
        position="absolute"
        rounded={0}
        bottom={0}
        left={0}
        right={0}
        backgroundColor={"gray.100"}
        shadow={9}
        borderTopColor={"black"}
        p={4}
      >
        <HStack justifyContent={"flex-end"} space={6} mr={2}>
          <Box>
            <Button
              onPress={addToCart}
              borderWidth={2}
              borderColor={"#066664"}
              backgroundColor={"white"}
              rounded={10}
              w={"auto"}
              h={12}
            >
              <Text
                mx={2}
                fontWeight={"semibold"}
                fontSize={14}
                color={"#006664"}
              >
                + Keranjang
              </Text>
            </Button>
          </Box>
          <Box>
            <Button
              onPress={() => {
                addToCart();
                navigation.navigate("Keranjang");
              }}
              backgroundColor={"#006664"}
              rounded={10}
              w={"auto"}
              h={12}
            >
              <Text
                mx={2}
                fontWeight={"semibold"}
                fontSize={14}
                color={"white"}
              >
                Beli Sekarang
              </Text>
            </Button>
          </Box>
        </HStack>
      </Box>
    </>
  );
};

export default DetailProduct;
