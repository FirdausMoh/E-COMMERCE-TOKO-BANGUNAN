import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { Box, HStack, Image, Heading,Button, Text } from "native-base";
import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";


const HeaderCategory = ({ title, withBack = false }) => {
  const trueGray900 = "#171717";
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <StatusBar barStyle="light" backgroundColor={trueGray900} />
      <Box bg={"white"} p={"4"} shadow={3}>
      <HStack justifyContent="space-between" alignItems="center">
          <HStack alignItems="center">
          <TouchableOpacity onPress={() => navigation.navigate("Category")}>
            <Box mr={10}>
            <Ionicons name="arrow-back"  size={40} color="black"/>
            </Box>
          </TouchableOpacity>
            <Heading color={"red.600"} marginLeft={2}>
              {title}
            </Heading>
          </HStack>
        </HStack>
      </Box>
    </SafeAreaView>
  );
};

export default HeaderCategory;