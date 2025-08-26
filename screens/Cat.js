import {
  Heading,
  Image,
  FlatList,
  Box,
  Input,
  HStack,
  Text,
  Center,
} from "native-base";
import { TouchableOpacity, Dimensions, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScreenTop } from "../components";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import FIREBASE from "../config/FIREBASE";
import { getDatabase, ref, onValue } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";

const Cat = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Get screen dimensions for responsive layout
  const { width: screenWidth } = Dimensions.get('window');
  
  // Calculate responsive item width
  const getItemWidth = () => {
    if (screenWidth > 768) {
      // Tablet - 4 columns
      return (screenWidth - 60) / 4;
    } else if (screenWidth > 414) {
      // Large phone - 2 columns with better spacing
      return (screenWidth - 50) / 2;
    } else {
      // Small phone - 2 columns
      return (screenWidth - 40) / 2;
    }
  };

  const itemWidth = getItemWidth();

  const formatToRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", { currency: "IDR" }).format(amount);
  };

  useEffect(() => {
    const db = getDatabase();
    const productRef = ref(db, "Product");

    const fetchData = () => {
      onValue(productRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const productList = Object.keys(data).map(async (key) => {
            const product = {
              id: key,
              ...data[key],
            };
            const storage = getStorage();
            const imageRef = storageRef(
              storage,
              `images/${product.gambar}.jpg`
            );
            const imageUrl = await getDownloadURL(imageRef);
            return { ...product, gambar: imageUrl };
          });

          Promise.all(productList).then((updatedProducts) => {
            // Filter products with category "Cat"
            const CatProducts = updatedProducts.filter(
              (product) => product.kategoriproduct === "Cat"
            );
            setProducts(CatProducts);
          });
        }
      });
    };

    fetchData();
  }, []);

  const renderItem = ({ item, index }) => {
    return (
      <Box 
        alignItems="center" 
        justifyContent="center"
        mb={4}
        px={1}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate("Detail Product", { item: item })}
          style={{ alignSelf: 'center' }}
        >
          <Box
            shadow={6}
            backgroundColor={"#FFFFFF"}
            borderRadius={12}
            flexDirection={"column"}
            w={itemWidth - 8}
            h={200}
            overflow="hidden"
            borderWidth={0.5}
            borderColor="gray.100"
          >
            <Box backgroundColor={"gray.50"} py={3} flex={1}>
              <Center flex={1}>
                <Image
                  source={{ uri: item.gambar }}
                  w={itemWidth - 40}
                  h="110"
                  resizeMode="contain"
                  alt="Product Image"
                  borderRadius={8}
                />
              </Center>
            </Box>
            
            <Box p={3} backgroundColor="white">
              <Text 
                fontSize={"13"} 
                fontWeight={"600"} 
                color={"gray.800"}
                numberOfLines={2}
                textAlign="center"
                mb={2}
              >
                {item.namaproduct}
              </Text>
              <Heading 
                fontSize={"md"} 
                color={"#006664"}
                textAlign="center"
              >
                Rp {formatToRupiah(item.harga)}
              </Heading>
            </Box>
          </Box>
        </TouchableOpacity>
      </Box>
    );
  };

  // Filter data produk berdasarkan teks pencarian
  const filterData = (text) => {
    const filtered = products.filter((item) =>
      item.namaproduct.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    // Panggil filterData saat nilai searchText berubah
    filterData(searchText);
  }, [searchText, products]);

  return (
    <>
      <ScreenTop />
      <Box>
        <HStack mx={5} my={3} alignItems="center">
          <Input
            placeholder="Cari produk..."
            placeholderTextColor={"#006664"}
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
            w="100%"
            h={12}
            borderRadius={12}
            bgColor="white"
            borderColor="gray.200"
            borderWidth={1}
            px={4}
            fontSize={14}
            shadow={2}
          />
        </HStack>
        
        <Box backgroundColor={"white"} py={4} mb={2} shadow={1}>
          <Text 
            ml={7} 
            fontWeight={"bold"} 
            color={"#006664"}
            fontSize={16}
          >
            PRODUK KAMI
          </Text>
        </Box>
      </Box>

      <Center flex={1}>
        <Box 
          alignSelf="center" 
          maxWidth={screenWidth - 20}
          flex={1}
        >
          <FlatList
            data={searchText ? filteredProducts : products}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            numColumns={screenWidth > 768 ? 4 : 2}
            key={screenWidth > 768 ? 'four-columns' : 'two-columns'} // Force re-render when columns change
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 10,
              paddingBottom: 20,
              paddingTop: 10
            }}
            columnWrapperStyle={
              screenWidth > 768 
                ? { justifyContent: 'space-evenly', marginBottom: 5 }
                : { justifyContent: 'space-evenly', marginBottom: 5 }
            }
            ItemSeparatorComponent={() => <Box h={2} />}
            ListEmptyComponent={() => (
              <Center mt={20}>
                <Text color="gray.500" fontSize={16}>
                  Tidak ada produk ditemukan
                </Text>
              </Center>
            )}
          />
        </Box>
      </Center>
    </>
  );
};

export default Cat;