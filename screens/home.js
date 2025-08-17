import {
  Heading,
  Image,
  FlatList,
  Box,
  VStack,
  HStack,
  Text,
  Center,
  ScrollView,
  Link,
  View,
} from "native-base";
import { TouchableOpacity, Dimensions, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Header } from "../components";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { getDatabase, ref, onValue } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [randomProducts, setRandomProducts] = useState([]);
  const [screenData, setScreenData] = useState(Dimensions.get('window'));

  // Get screen dimensions
  const { width: screenWidth, height: screenHeight } = screenData;
  
  // Calculate responsive values
  const getResponsiveValues = () => {
    const isTablet = screenWidth >= 768;
    const isLargePhone = screenWidth >= 414;
    
    let numColumns, itemWidth, itemSpacing;
    
    if (isTablet) {
      numColumns = 4;
      itemSpacing = 15;
      itemWidth = (screenWidth - 60) / numColumns; // Better spacing for tablets
    } else if (isLargePhone) {
      numColumns = 2;
      itemSpacing = 12;
      itemWidth = (screenWidth - 50) / numColumns; // Better spacing for large phones
    } else {
      numColumns = 2;
      itemSpacing = 10;
      itemWidth = (screenWidth - 40) / numColumns; // Better spacing for small phones
    }
    
    return { numColumns, itemWidth, itemSpacing, isTablet };
  };

  const { numColumns, itemWidth, itemSpacing, isTablet } = getResponsiveValues();

  const formatToRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", { currency: "IDR" }).format(amount);
  };

  // Listen to screen orientation changes
  useEffect(() => {
    const onChange = (result) => {
      setScreenData(result.screen);
    };
    
    const subscription = Dimensions.addEventListener('change', onChange);
    
    return () => subscription?.remove();
  }, []);

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
            // Ambil 8 produk secara acak (atau lebih untuk tablet)
            const productCount = isTablet ? 12 : 8;
            const randomProducts = getRandomProducts(updatedProducts, productCount);
            setRandomProducts(randomProducts);
          });
        }
      });
    };

    // Fungsi untuk mendapatkan produk secara acak
    const getRandomProducts = (products, count) => {
      const shuffled = products.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    fetchData();
  }, [isTablet]);

  const renderItem = ({ item, index }) => {
    // Calculate responsive font sizes
    const titleFontSize = isTablet ? 14 : 12;
    const priceFontSize = isTablet ? "md" : "sm";
    const imageSize = isTablet ? 120 : 100;
    const itemHeight = isTablet ? 220 : 180;

    return (
      <Box
        width={itemWidth}
        marginBottom={itemSpacing}
        alignItems="center"
        justifyContent="center"
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate("Detail Product", { item: item })}
          style={{
            width: itemWidth - 8, // Slight reduction for better spacing
            alignSelf: 'center',
          }}
        >
          <Box
            shadow={3}
            backgroundColor={"#FFFFFF"}
            borderRadius={8}
            flexDirection={"column"}
            width="100%"
            height={itemHeight}
            overflow="hidden"
          >
            {/* Image Container */}
            <Box 
              backgroundColor={"gray.100"} 
              flex={1}
              justifyContent="center"
              alignItems="center"
              p={2}
            >
              <Image
                source={{ uri: item.gambar }}
                width={imageSize}
                height={imageSize}
                resizeMode="contain"
                alt="Product Image"
                borderRadius={4}
              />
            </Box>
            
            {/* Product Info Container */}
            <Box p={3} justifyContent="space-between" minH="70">
              <Text 
                fontSize={titleFontSize} 
                fontWeight={"semibold"} 
                color={"black"}
                numberOfLines={2}
                lineHeight={titleFontSize + 2}
                textAlign="left"
              >
                {item.namaproduct}
              </Text>
              <Heading 
                mt={2} 
                fontSize={priceFontSize} 
                color={"#006664"}
                numberOfLines={1}
              >
                Rp {formatToRupiah(item.harga)}
              </Heading>
            </Box>
          </Box>
        </TouchableOpacity>
      </Box>
    );
  };

  // Custom render for empty space in last row
  const renderEmptyItem = () => (
    <Box 
      width={itemWidth} 
      marginBottom={itemSpacing}
    />
  );

  // Add empty items to fill last row if needed
  const getDataWithEmptyItems = () => {
    const data = [...randomProducts];
    const remainder = data.length % numColumns;
    
    if (remainder !== 0) {
      const emptyItems = numColumns - remainder;
      for (let i = 0; i < emptyItems; i++) {
        data.push({ id: `empty-${i}`, empty: true });
      }
    }
    
    return data;
  };

  const renderItemWithEmpty = ({ item, index }) => {
    if (item.empty) {
      return renderEmptyItem();
    }
    return renderItem({ item, index });
  };

  return (
    <View flex={1}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack>
          <Box mx={3} mt={5}>
            <Image
              source={require("../assets/Suburjaya.png")}
              alt="banner"
              w="full"
              h={Platform.OS === "ios" ? "220" : "190"}
              borderRadius={25}
            />
          </Box>
          
          <Box>
            <VStack>
              <HStack justifyContent={"space-between"} mx={2}>
                <Heading
                  marginLeft={3}
                  my={5}
                  fontSize={18}
                  fontWeight={"bold"}
                >
                  Kategori Produk
                </Heading>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => navigation.navigate("Product")}
                >
                  <Text
                    color={"#006664"}
                    marginLeft={3}
                    my={5}
                    fontSize={14}
                    fontWeight={"bold"}
                  >
                    Lihat Semua
                  </Text>
                </TouchableOpacity>
              </HStack>

              <VStack>
                <Center>
                  <ScrollView
                    horizontal
                    mx={2}
                    showsHorizontalScrollIndicator={false}
                  >
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Bata")}
                      mx
                    >
                      <Box
                        backgroundColor={"#006664"}
                        px={2}
                        pt={2}
                        borderRadius={15}
                        mx={2}
                        w={"90%"}
                      >
                        <Image
                          source={require("../assets/bata.png")}
                          w="80px"
                          h="70px"
                          alt="Logo"
                          resizeMode="contain"
                          borderRadius={10}
                        />
                        <Center mb={1}>
                          <Text color={"trueGray.100"} fontSize={14}>
                            Bata
                          </Text>
                        </Center>
                      </Box>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Semen")}
                    >
                      <Box
                        backgroundColor={"#006664"}
                        px={2}
                        pt={2}
                        borderRadius={15}
                        mx={2}
                        w={"90%"}
                      >
                        <Image
                          source={require("../assets/semen.png")}
                          w="80px"
                          h="70px"
                          alt="Logo"
                          resizeMode="contain"
                          borderRadius={10}
                        />
                        <Center mb={1}>
                          <Text color={"trueGray.100"} fontSize={14}>
                            Semen
                          </Text>
                        </Center>
                      </Box>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Cat")}
                    >
                      <Box
                        backgroundColor={"#006664"}
                        px={2}
                        pt={2}
                        borderRadius={15}
                        mx={2}
                        w={"90%"}
                      >
                        <Image
                          source={require("../assets/cat.png")}
                          w="80px"
                          h="70px"
                          alt="Logo"
                          resizeMode="contain"
                          borderRadius={10}
                        />
                        <Center mb={1}>
                          <Text color={"trueGray.100"} fontSize={14}>
                            Cat
                          </Text>
                        </Center>
                      </Box>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Galvalum")}
                    >
                      <Box
                        backgroundColor={"#006664"}
                        px={2}
                        pt={2}
                        borderRadius={15}
                        mx={2}
                        w={"90%"}
                      >
                        <Image
                          source={require("../assets/galvalum.png")}
                          w="80px"
                          h="70px"
                          alt="Logo"
                          resizeMode="contain"
                          borderRadius={10}
                        />
                        <Center mb={1}>
                          <Text color={"trueGray.100"} fontSize={14}>
                            Galvalum
                          </Text>
                        </Center>
                      </Box>
                    </TouchableOpacity>
                  </ScrollView>
                </Center>
              </VStack>
            </VStack>
          </Box>
        </VStack>
        
        <Box backgroundColor={"gray.100"} my={5}>
          <Text
            marginLeft={3}
            my={3}
            fontSize={20}
            fontWeight={"bold"}
            color={"#006664"}
          >
            Rekomendasi
          </Text>
        </Box>
        
        {/* Responsive FlatList */}
        <Center>
          <Box 
            width="100%" 
            maxWidth={screenWidth - 20}
            alignSelf="center"
          >
            <FlatList
              data={getDataWithEmptyItems()}
              renderItem={renderItemWithEmpty}
              keyExtractor={(item, index) => item.id || `empty-${index}`}
              showsVerticalScrollIndicator={false}
              numColumns={numColumns}
              key={numColumns} // Force re-render when numColumns changes
              scrollEnabled={false} // Disable scroll since we're inside ScrollView
              contentContainerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 10,
              }}
              columnWrapperStyle={numColumns > 1 ? {
                justifyContent: 'space-evenly',
                alignItems: 'center',
                paddingHorizontal: 5,
              } : undefined}
            />
          </Box>
        </Center>
        
        <Box backgroundColor={"#006664"} mt={30} h={80}>
          <Heading m={5} fontSize={20} color={"trueGray.100"}>
            Kontak Kami
          </Heading>
          <HStack
            mb={5}
            backgroundColor={"white"}
            mx={5}
            borderRadius={30}
            shadow={2}
          >
            <Image
              source={require("../assets/JAAA.png")}
              w={Platform.OS === "ios" ? "140" : "105"}
              h="140"
              alt="Logo"
              borderRadius={100}
              resizeMode="contain"
              my={5}
            />
            <VStack mt={8}>
              <HStack ml={2}>
                <Ionicons name="logo-instagram" size={30} color="black" />
                <Link
                  ml={5}
                  href="https://www.instagram.com/hanifbahyhasyid/?hl=en"
                  isUnderlined
                  _text={{ fontSize: "md" }}
                >
                  @suburjaya
                </Link>
              </HStack>
              <HStack ml={2} mt={2}>
                <Ionicons name="logo-whatsapp" size={30} color="black" />
                <Link
                  ml={5}
                  href="whatsapp://send?text=Saya Customer Ryapp &phone=+6282229850927"
                  isUnderlined
                  _text={{ fontSize: "md" }}
                >
                  08003337221
                </Link>
              </HStack>
              <HStack ml={2} mt={2}>
                <Ionicons name="mail-outline" size={30} color="black" />
                <Link
                  ml={5}
                  href="mailto:mohamadfahri302@gmail.com"
                  isUnderlined
                  _text={{ fontSize: "md" }}
                >
                  suburjaya@gmail.com
                </Link>
              </HStack>
            </VStack>
          </HStack>
        </Box>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;