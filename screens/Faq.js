import { Heading, Image, Text, FlatList, VStack } from "native-base";
import { Box, ScrollView } from "native-base";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Header, ScreenTop } from "../components";
import dataFaq from "../dataFaq";

const Faqs = () => {
  const navigation = useNavigation();
  const renderitem = ({ item }) => {
    return (
      <ScrollView>
        <VStack mt={15}>
          <Box ml={5} mr={5} mt={2}>
            <Box backgroundColor={"white"} rounded={"lg"} shadow={2}>
              <Box>
                <Box borderBottomColor={"coolGray.300"} borderBottomWidth={2}>
                  <Heading mb={4} mt={5} ml={5} mr={5} fontSize={16}>
                    {item.title}
                  </Heading>
                </Box>
                <Text
                  mb={4}
                  ml={5}
                  mt={5}
                  mr={5}
                  fontSize={14}
                  fontWeight={"normal"}
                >
                  {item.content}
                </Text>
              </Box>
            </Box>
          </Box>
        </VStack>
      </ScrollView>
    );
  };

  return (
    <>
      <ScreenTop title={"FAQ"} />
      <Heading ml={5} mb={4} mt={5} fontSize={20}>
        Pertanyaan yang Sering Ditanyakan
      </Heading>
      <FlatList
        data={dataFaq}
        renderItem={renderitem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </>
  );
};

export default Faqs;