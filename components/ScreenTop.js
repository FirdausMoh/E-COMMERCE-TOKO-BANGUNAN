import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { Box, HStack, Image, Heading, Button, Text } from "native-base";
import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const ScreenTop = ({ title, withBack = false }) => {
  const trueGray900 = "#171717";
  const navigation = useNavigation();
  return (
    <SafeAreaView edges={["right", "left", "top"]}>
      <StatusBar barStyle="light" backgroundColor={trueGray900} />
      <Box bg={"white"} p={"4"} shadow={2}>
        <HStack justifyContent="space-between" alignItems="center">
          <HStack>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Box mr={10} p={1} backgroundColor={"#006664"} borderRadius={10}>
                <Ionicons name="arrow-back" size={25} color="#FFFFFF" />
              </Box>
            </TouchableOpacity>
          </HStack>
          <HStack justifyContent={"space-between"}>
            <Box>
              <TouchableOpacity
                onPress={() => navigation.navigate("Keranjang")}
              >
                <Box px={3} py={2} borderRadius={10} bgColor="white" shadow={5}>
                  <Ionicons name="cart-outline" size={24} color="#006664" />
                </Box>
              </TouchableOpacity>
            </Box>
          </HStack>
        </HStack>
      </Box>
    </SafeAreaView>
  );
};

export default ScreenTop;
