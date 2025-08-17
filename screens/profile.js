import {
  Image,
  Box,
  Text,
  VStack,
  Center,
  Heading,
  Button,
  View,
  Modal,
  Input,
} from "native-base";
import { TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import firebase from "../config/FIREBASE";
import "firebase/auth";

const Profile = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          const userDataFromStorage = JSON.parse(storedUserData);
          setUserData(userDataFromStorage);
        }

        const user = firebase.auth().currentUser;
        if (user) {

          setUserLoggedIn(true);
          const userRef = firebase.database().ref(`users/${user.uid}`);
          userRef.on('value', (snapshot) => {
            const userDataFromDatabase = snapshot.val();
            setUserData(userDataFromDatabase);
            AsyncStorage.setItem(
              'userData',
              JSON.stringify(userDataFromDatabase)
            ); // Simpan data pengguna terbaru dari Firebase ke AsyncStorage
          });
        } else {
          setUserLoggedIn(false);
          console.log('User not logged in!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userData");
      navigation.replace("Login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  const handleEditProfile = () => {
    // Jika user tidak login, tampilkan pesan peringatan
    if (!userLoggedIn) {
      Alert.alert(
        'Peringatan',
        'Anda harus login untuk mengedit profile.',
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('Login'),
          },
        ],
        { cancelable: false }
      );
    } else {
      // Set showModal to true to display the edit modal
      setShowModal(true);
    }
  };

  const handleSaveProfile = async (updatedUserData) => {
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        const userRef = firebase.database().ref(`users/${user.uid}`);
        await userRef.update(updatedUserData);

        // Change password logic
        if (currentPassword && newPassword) {
          const credential = firebase.auth.EmailAuthProvider.credential(
            user.email,
            currentPassword
          );
          await user.reauthenticateWithCredential(credential);
          await user.updatePassword(newPassword);
        }

        setShowModal(false);
      } else {
        console.log("User not logged in!");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <View flex={1} backgroundColor={"white"}>
      <VStack>

        <Box
          backgroundColor={"#078684"}
          h={Platform.OS === "ios" ? "47%" : "44%"}
        >
          <Box backgroundColor={"#006664"} roundedBottom={200} h="50%">
            <Center mt={"10%"}>
              <Ionicons name="person-circle" size={100} color="black" />
            </Center>
          </Box>
          <Center mt={2}>
            <Heading color={"white"}>
              {userData ? userData.nama : "Nama"}
            </Heading>
            <Text color={"white"} fontSize={20}>
              {userData ? userData.email : "email"}
            </Text>
            <Text color={"white"} fontSize={20}>
              {userData ? userData.nohp : "No Telepon"}
            </Text>
          </Center>
        </Box>
        <Box

          bottom={Platform.OS === "ios" ? 20 : "70px"}
          left={0}
          right={0}
          backgroundColor={"white"}
          p={3}
          m={4}
          rounded={30}
          shadow={4}
        >
          <Box borderBottomWidth={1} borderColor={"gray.400"} p={3}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.navigate("AboutUs")}
            >
              <Text fontSize={"2xl"} fontWeight={"semibold"}>
                Tentang kami
              </Text>
            </TouchableOpacity>
          </Box>
          <Box borderBottomWidth={1} borderColor={"gray.300"} p={3}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.navigate("Product")}
            >
              <Text fontSize={"2xl"} fontWeight={"semibold"}>
                Produk
              </Text>
            </TouchableOpacity>
          </Box>
          <Box borderBottomWidth={1} borderColor={"gray.300"} p={3}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.navigate("Keranjang")}
            >
              <Text fontSize={"2xl"} fontWeight={"semibold"}>
                Keranjang
              </Text>
            </TouchableOpacity>
          </Box>
          <Box borderBottomWidth={1} borderColor={"gray.300"} p={3}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.navigate("Faq")}
            >
              <Text fontSize={"2xl"} fontWeight={"semibold"}>
                FAQs
              </Text>
            </TouchableOpacity>
          </Box>
          <Box p={3}>
            <TouchableOpacity activeOpacity={0.5} onPress={handleEditProfile}>
              <Text fontSize={"2xl"} fontWeight={"semibold"}>
                Edit Profile
              </Text>
            </TouchableOpacity>
          </Box>
        </Box>
        <Center>
          <Button
            w={"50%"}
            h={12}
            rounded={16}
            backgroundColor={"#006664"}
            onPress={handleLogout}
            bottom={Platform.OS === "ios" ? 0 : 35} //buat ios
          >
            <Heading color={"white"}>Keluar</Heading>
          </Button>
        </Center>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content>
            <Modal.Header>
              <Heading>Edit Profil</Heading>
            </Modal.Header>
            <Modal.Body>
              {/* Form for editing profile */}
              <VStack space={4} p={4}>
                <Input
                  placeholder="Nama"
                  value={userData ? userData.nama : ""}
                  onChangeText={(text) =>
                    setUserData({ ...userData, nama: text })
                  }
                />
                <Input
                  placeholder="Email"
                  value={userData ? userData.email : ""}
                  onChangeText={(text) =>
                    setUserData({ ...userData, email: text })
                  }
                />
                <Input
                  placeholder="No Telepon"
                  value={userData ? userData.nohp : ""}
                  onChangeText={(text) =>
                    setUserData({ ...userData, nohp: text })
                  }
                />
                <Input
                  secureTextEntry
                  placeholder="Current Password"
                  value={currentPassword}
                  onChangeText={(text) => setCurrentPassword(text)}
                />
                <Input
                  secureTextEntry
                  placeholder="New Password"
                  value={newPassword}
                  onChangeText={(text) => setNewPassword(text)}
                />
                <Button
                  onPress={() => handleSaveProfile(userData)}
                  backgroundColor={"#006664"}
                >
                  Simpan
                </Button>
              </VStack>
            </Modal.Body>
          </Modal.Content>
        </Modal>
      </VStack>
    </View>
  );
};

export default Profile;