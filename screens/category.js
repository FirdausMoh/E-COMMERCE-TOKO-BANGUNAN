import {
  Heading,
  Image,
  Text,
  Box,
  ScrollView,
  View,
  Center,
  VStack,
  HStack,
} from "native-base";
import { Header } from "../components";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, Dimensions } from "react-native";
import { useState, useEffect } from "react";

const Category = () => {
  const navigation = useNavigation();
  const [screenData, setScreenData] = useState(Dimensions.get('window'));

  // Get screen dimensions
  const { width: screenWidth } = screenData;

  // Calculate responsive values
  const getResponsiveValues = () => {
    const isTablet = screenWidth >= 768;
    const isLargePhone = screenWidth >= 414;
    
    let itemSize, imageSize, fontSize, spacing;
    
    if (isTablet) {
      itemSize = 200;
      imageSize = 140;
      fontSize = 20;
      spacing = 20;
    } else if (isLargePhone) {
      itemSize = 170;
      imageSize = 120;
      fontSize = 18;
      spacing = 15;
    } else {
      itemSize = 150;
      imageSize = 100;
      fontSize = 16;
      spacing = 12;
    }
    
    return { itemSize, imageSize, fontSize, spacing, isTablet };
  };

  const { itemSize, imageSize, fontSize, spacing, isTablet } = getResponsiveValues();

  // Listen to screen orientation changes
  useEffect(() => {
    const onChange = (result) => {
      setScreenData(result.screen);
    };
    
    const subscription = Dimensions.addEventListener('change', onChange);
    
    return () => subscription?.remove();
  }, []);

  const CategoryButton = ({ onPress, imageSrc, title, marginLeft = 0 }) => (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.8}
      style={{ marginLeft }}
    >
      <Center>
        <Box
          shadow={4}
          backgroundColor={"#006664"}
          w={itemSize}
          h={itemSize}
          borderRadius={20}
          justifyContent="center"
          alignItems="center"
          p={3}
        >
          <Center flex={1}>
            <Box flex={1} justifyContent="center" alignItems="center">
              <Image
                source={imageSrc}
                w={imageSize}
                h={imageSize}
                resizeMode="contain"
                alt={`${title} Logo`}
              />
            </Box>
            <Box justifyContent="center" alignItems="center" minH={8}>
              <Text 
                color={"#FFFFFF"} 
                fontSize={fontSize}
                fontWeight="semibold"
                textAlign="center"
                numberOfLines={1}
              >
                {title}
              </Text>
            </Box>
          </Center>
        </Box>
      </Center>
    </TouchableOpacity>
  );

  return (
    <View flex={1} backgroundColor="gray.50">
      <Header />
      
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <VStack flex={1} p={4}>
          {/* Header Section */}
          <Box mb={6} mt={2}>
            <Heading 
              fontSize={isTablet ? 28 : 24} 
              fontWeight="bold" 
              color="#006664"
              textAlign="center"
            >
              Kategori Produk
            </Heading>
            <Text 
              fontSize={isTablet ? 16 : 14} 
              color="gray.600" 
              textAlign="center" 
              mt={2}
            >
              Pilih kategori produk yang Anda butuhkan
            </Text>
          </Box>

          {/* Categories Grid */}
          <Center>
            <VStack space={spacing} alignItems="center">
              {/* Row 1: Semen & Cat */}
              <HStack 
                space={spacing} 
                justifyContent="center" 
                alignItems="center"
                width="100%"
              >
                <CategoryButton
                  onPress={() => navigation.navigate("Semen")}
                  imageSrc={require("../assets/semen.png")}
                  title="Semen"
                />
                <CategoryButton
                  onPress={() => navigation.navigate("Cat")}
                  imageSrc={require("../assets/cat.png")}
                  title="Cat"
                />
              </HStack>

              {/* Row 2: Bata & Galvalum */}
              <HStack 
                space={spacing} 
                justifyContent="center" 
                alignItems="center"
                width="100%"
              >
                <CategoryButton
                  onPress={() => navigation.navigate("Bata")}
                  imageSrc={require("../assets/bata.png")}
                  title="Bata"
                />
                <CategoryButton
                  onPress={() => navigation.navigate("Galvalum")}
                  imageSrc={require("../assets/galvalum.png")}
                  title="Galvalum"
                />
              </HStack>
            </VStack>
          </Center>

          {/* Additional Info Section */}
          <Box mt={8} p={4} backgroundColor="white" borderRadius={12} shadow={2}>
            <VStack space={3}>
              <Heading fontSize={18} color="#006664" textAlign="center">
                UD Subur Jaya
              </Heading>
              <Text fontSize={14} color="gray.600" textAlign="center" lineHeight={20}>
                Kami menyediakan berbagai kategori material bangunan berkualitas tinggi 
                untuk memenuhi kebutuhan konstruksi Anda.
              </Text>
              <HStack space={4} justifyContent="center" mt={2}>
                <VStack alignItems="center" flex={1}>
                  <Text fontSize={20} fontWeight="bold" color="#006664">
                    4
                  </Text>
                  <Text fontSize={12} color="gray.500" textAlign="center">
                    Kategori
                  </Text>
                </VStack>
                <VStack alignItems="center" flex={1}>
                  <Text fontSize={20} fontWeight="bold" color="#006664">
                    100+
                  </Text>
                  <Text fontSize={12} color="gray.500" textAlign="center">
                    Produk
                  </Text>
                </VStack>
                <VStack alignItems="center" flex={1}>
                  <Text fontSize={20} fontWeight="bold" color="#006664">
                    ⭐ 4.8
                  </Text>
                  <Text fontSize={12} color="gray.500" textAlign="center">
                    Rating
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </Box>

          {/* Footer Spacing */}
          <Box py={6} />
        </VStack>
      </ScrollView>
    </View>
  );
};

export default Category;