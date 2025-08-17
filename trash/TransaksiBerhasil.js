import { Heading, Center, Box,Image, HStack, Button } from "native-base";
import { useNavigation } from "@react-navigation/native";
import HeaderCategory from "../components/HeaderCategory";


const TransaksiBerhasil = () => {
  const navigation = useNavigation();
  return (
    <>
      <HeaderCategory/>
      <Center>
      <Box w={'400px'} h={'600px'} m={10} backgroundColor={"white"} shadow={5}>
        <Box>
        <Center>
        <Image
            source={require("../assets/JAAA.png")}
            w="200px"
            h="200px"
            alt="Logo"
            resizeMode="cover"
            />
        </Center>
        </Box>

        <Box borderBottomColor={"gray.300"} borderBottomWidth={1} py={5}>
        <Center>
        <Heading>Pembayaran Berhasil</Heading>
        </Center>
        </Box>
        <Box>
            <HStack m={5}>
            <Heading mr={20}fontSize={'xl'} >Total Bayar :  </Heading>
            <Heading fontSize={'xl'}>Rp 200.000 </Heading>
            </HStack>
        </Box>
        <Box>
            <Button m={10} borderRadius={10}  onPress={() => navigation.navigate("Home")} backgroundColor={'red.600'}>
                <Heading color={"white"}>OK</Heading>
            </Button>
        </Box>
      </Box>
      </Center>
      
    </>
  );
};

export default TransaksiBerhasil;