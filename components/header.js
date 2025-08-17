import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { Box, HStack, Image, Heading, Button, Text, Center } from "native-base";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Header = ({ title, withBack = false }) => {
  const trueGray900 = "#171717";
  const navigation = useNavigation();

  return (
    <SafeAreaView edges={["right", "left", "top"]}>
      <StatusBar barStyle="light" backgroundColor={trueGray900} />
      <Box bg={"white"} p={"4"} shadow={3}>
        <HStack justifyContent="space-between" alignItems="center">
          <HStack>
            <Image
              source={require("../assets/JAAA.png")}
              w="100px"
              h="40px"
              alt="Logo"
              resizeMode="cover"
            />
          </HStack>

          <Box>
            <HStack justifyContent={"space-between"} space={2}>
              <Text fontWeight={"semibold"} my={2}></Text>
              <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                <Ionicons name="person-circle" size={35} color="#373737" />
              </TouchableOpacity>
            </HStack>
          </Box>
        </HStack>
      </Box>
    </SafeAreaView>
  );
};

export default Header;
