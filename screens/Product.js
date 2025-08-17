import {
  Heading,
  Image,
  FlatList,
  Box,
  Input,
  HStack,
  Text,
  Center,
  View,
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

const Product = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
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
            setProducts(updatedProducts);
          });
        }
      });
    };

    fetchData();
  }, []);

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
  const getDataWithEmptyItems = (dataSource) => {
    const data = [...dataSource];
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

  // Get current data source
  const currentData = searchText ? filteredProducts : products;

  return (
    <View flex={1} backgroundColor="gray.50">
      <ScreenTop />
      
      {/* Search Section */}
      <Box backgroundColor="white" pb={3}>
        <HStack mx={5} my={3} alignItems="center">
          <Box position="relative" width="100%">
            <Input
              placeholder="Cari produk..."
              placeholderTextColor={"gray.400"}
              value={searchText}
              onChangeText={(text) => setSearchText(text)}
              w="100%"
              h={12}
              borderRadius={12}
              backgroundColor="gray.100"
              borderColor="gray.200"
              fontSize={16}
              paddingLeft={12}
              paddingRight={12}
              _focus={{
                backgroundColor: "white",
                borderColor: "#006664",
                borderWidth: 2,
              }}
              InputLeftElement={
                <Box ml={3}>
                  <Ionicons name="search" size={20} color="#006664" />
                </Box>
              }
              InputRightElement={
                searchText ? (
                  <TouchableOpacity
                    onPress={() => setSearchText("")}
                    style={{ marginRight: 12 }}
                  >
                    <Ionicons name="close-circle" size={20} color="gray" />
                  </TouchableOpacity>
                ) : null
              }
            />
          </Box>
        </HStack>
        
        <Box backgroundColor={"white"} py={2}>
          <HStack justifyContent="space-between" alignItems="center" mx={5}>
            <Text fontWeight={"bold"} color={"#006664"} fontSize={16}>
              {searchText ? `Hasil Pencarian "${searchText}"` : "SEMUA PRODUK"}
            </Text>
            <Text color={"gray.500"} fontSize={14}>
              {currentData.length} produk
            </Text>
          </HStack>
        </Box>
      </Box>

      {/* Products Section */}
      {currentData.length > 0 ? (
        <Center flex={1} mt={2}>
          <Box 
            width="100%" 
            maxWidth={screenWidth - 20}
            alignSelf="center"
            flex={1}
          >
            <FlatList
              data={getDataWithEmptyItems(currentData)}
              renderItem={renderItemWithEmpty}
              keyExtractor={(item, index) => item.id || `empty-${index}`}
              showsVerticalScrollIndicator={false}
              numColumns={numColumns}
              key={`${numColumns}-${searchText}`} // Force re-render when numColumns or search changes
              contentContainerStyle={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 10,
                paddingVertical: 10,
                flexGrow: 1,
              }}
              columnWrapperStyle={numColumns > 1 ? {
                justifyContent: 'space-evenly',
                alignItems: 'center',
                paddingHorizontal: 5,
              } : undefined}
            />
          </Box>
        </Center>
      ) : (
        // Empty State
        <Center flex={1}>
          <Box alignItems="center" p={8}>
            <Ionicons 
              name={searchText ? "search" : "cube-outline"} 
              size={60} 
              color="#006664" 
              style={{ marginBottom: 16 }}
            />
            <Heading fontSize="lg" color="#006664" textAlign="center" mb={2}>
              {searchText ? "Produk Tidak Ditemukan" : "Belum Ada Produk"}
            </Heading>
            <Text 
              color="gray.500" 
              textAlign="center" 
              fontSize="md"
              lineHeight={20}
            >
              {searchText 
                ? `Tidak ada produk yang sesuai dengan "${searchText}". Coba kata kunci lain.`
                : "Produk akan segera tersedia."
              }
            </Text>
            {searchText && (
              <TouchableOpacity
                onPress={() => setSearchText("")}
                style={{
                  marginTop: 16,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  backgroundColor: "#006664",
                  borderRadius: 8,
                }}
              >
                <Text color="white" fontWeight="semibold">
                  Lihat Semua Produk
                </Text>
              </TouchableOpacity>
            )}
          </Box>
        </Center>
      )}
    </View>
  );
};

export default Product;