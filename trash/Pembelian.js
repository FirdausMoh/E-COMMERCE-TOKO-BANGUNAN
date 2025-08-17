import { Box, Heading, View,Image, Center, HStack, Text, VStack, FormControl, Input, Divider, Button, Radio} from "native-base";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from 'react';
import { ScreenTop } from "../components";

const formatRupiah = (number) => {
  const formattedNumber = new Intl.NumberFormat('id-ID', {
    currency: 'IDR'
  }).format(number);

  return formattedNumber;
};

const Pembelian = ({ route }) => {
  const { image, title, content, price, Price } = route.params.item;
  const navigation = useNavigation();

  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(price);

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity > 1) {
      setQuantity(newQuantity);
      setTotalPrice(price * newQuantity);
    }
  };
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('bankTransfer');

return (
        <View>
          <ScreenTop />
          <Box m={5} shadow={3} backgroundColor={"#006664"} borderRadius={30} pb={10}>
          <HStack my={5} mx={3}>
            <Box backgroundColor={'gray.100'} borderRadius={20}>
              <Image
                source={{ uri: image }}
                width={140}
                height={140}
                alt={title}
                resizeMode="contain"
                borderRadius={20}
              />
            </Box>
            <Box>
              <Box mt={3} ml={3}>
                <Heading color={'gray.100'} fontSize={16}>
                  {content}
                </Heading>
                <Heading color={'green.400'} fontSize={16}>
                  {Price}
                </Heading>
                <Center>
                <HStack space={2} mt={4}>
                <Button
  onPress={() => handleQuantityChange(-1)}
  backgroundColor={'black'}
  _pressed={{ backgroundColor: '#bfbfbf' }}
  borderRadius="full" // Mengubah menjadi bentuk bulat
  width={10} // Menentukan lebar tombol
  height={10} // Menentukan tinggi tombol
>
  -
</Button>
<Text color={'gray.100'}>{quantity}</Text>
<Button
  onPress={() => handleQuantityChange(1)}
  backgroundColor={'black'}
  _pressed={{ backgroundColor: '#bfbfbf' }}
  borderRadius="full" // Mengubah menjadi bentuk bulat
  width={10} // Menentukan lebar tombol
  height={10} // Menentukan tinggi tombol
>
  +
</Button>
                </HStack>
                </Center>
                
              </Box>
            </Box>
          </HStack> 
        <Box mx={5}>
          <FormControl>
            <VStack mt={3}>
            <Heading fontSize={'sm'} color={"gray.100"} mb={3}>Alamat Pengiriman : </Heading>
            <Input backgroundColor={"gray.200"} w={'full'} h={'35px'} />
            </VStack>
            <VStack mt={3}>
            <Heading fontSize={'sm'} color={"gray.100"} mb={3}>Nama Pembeli : </Heading>
            <Input backgroundColor={"gray.200"} w={'full'} h={'35px'} />
            </VStack>
          </FormControl>
          <VStack mt={5} mx={5}>
  <Heading color={'gray.100'} fontSize={16} mb={2}>
    Pilih Metode Pembayaran:
  </Heading>
  <Radio.Group
    name="paymentMethod"
    value={selectedPaymentMethod}
    onChange={setSelectedPaymentMethod}
  >
    <VStack space={2}>
      <Radio value="bankTransfer">
        <Text color={'gray.100'}>Transfer Bank</Text>
      </Radio>
      <Radio value="creditCard">
        <Text color={'gray.100'}>Kartu Kredit</Text>
      </Radio>
      <Radio value="eWallet">
        <Text color={'gray.100'}>Dompet Digital</Text>
      </Radio>
    </VStack>
  </Radio.Group>
</VStack>

          </Box>
          <HStack alignItems={'center'} justifyContent={"center"}>
          <Box mx={10} mt={5}>
            <Heading color={"gray.100"} fontSize={20}>
              Total Bayar
            </Heading>
            <Heading color={"gray.100"} fontSize={20}>
            {formatRupiah(totalPrice)}
            </Heading>
          </Box>
          <Box mx={10} mt={5}>
          <Button 
              w={150}  borderRadius={10} borderWidth={3} borderColor={'#006664'} backgroundColor={'gray.100'} 
              onPress={() => navigation.navigate("TransaksiBerhasil")}>
                <Heading fontSize={"sm"} color={"#006664"} >Bayar Sekarang</Heading>
            </Button>
          </Box>
          </HStack>
          
    </Box>
          <Box mt={3} >
          <HStack shadow={3} w={"full"} py={2} px={5} backgroundColor={""} >
          <Center>
          <Box>
            
          </Box>
          </Center>
          </HStack>
          </Box>
          
          
        </View>
    );

};

export default Pembelian;