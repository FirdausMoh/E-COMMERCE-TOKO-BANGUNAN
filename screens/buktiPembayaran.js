import {
  Input,
  Text,
  Button,
  ScrollView,
  Box,
  Heading,
  FormControl,
  Image,
  Center,
  HStack,
  Modal,
  Select,
  Spinner,
} from "native-base";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import FIREBASE from "../config/FIREBASE";
import ScreenTop from "../components/ScreenTop2";
import { Alert, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Pembayaran = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { cartItems, totalHarga } = route.params;
  const [Nama, setNama] = useState("");
  const [NoTelpon, setnoTelpon] = useState("");
  const [Email, setEmail] = useState("");
  const [Alamat, setAlamat] = useState("");
  const [Pesan, setPesan] = useState("");
  const [image, setImage] = useState(null);
  const [modal, setModal] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedRegency, setSelectedRegency] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          const userDataFromStorage = JSON.parse(storedUserData);
          setNama(userDataFromStorage.nama);
          setnoTelpon(userDataFromStorage.nohp);
          setEmail(userDataFromStorage.email);
        } else {
          const user = FIREBASE.auth().currentUser;
          if (user) {
            const userRef = FIREBASE.database().ref(`users/${user.uid}`);
            userRef.once("value", (snapshot) => {
              const userDataFromDatabase = snapshot.val();
              setNama(userDataFromDatabase.nama);
              setnoTelpon(userDataFromDatabase.nohp);
              setEmail(userDataFromDatabase.email);
            });
          } else {
            console.log("User not logged in!");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchUserData();


    const fetchProvinces = async () => {
      try {
        const response = await fetch(
          `https://api.goapi.io/regional/provinsi?api_key=92fc6e7e-10dc-5d95-4a43-e963da73`
        );
        if (response.ok) {
          const data = await response.json();
          setProvinces(data.data); //simpan data provinsi ke state
        } else {
          throw new Error("Gagal mengambil data provinsi");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProvinces();
  }, []);

  const fetchRegencies = async (provinceId) => {
    try {
      const response = await fetch(
        `https://api.goapi.io/regional/kota?provinsi_id=${provinceId}&api_key=92fc6e7e-10dc-5d95-4a43-e963da73`
      );
      if (response.ok) {
        const data = await response.json();
        setRegencies(data.data); // Simpan data kota ke state
      } else {
        throw new Error("Gagal mengambil data kota");
      }
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };
  const fetchDistricts = async (regencyId) => {
    try {
      const response = await fetch(
        `https://api.goapi.io/regional/kecamatan?kota_id=${regencyId}&api_key=92fc6e7e-10dc-5d95-4a43-e963da73`
      );
      if (response.ok) {
        const data = await response.json();
        setDistricts(data.data); // Simpan data kecamatan ke state
      } else {
        throw new Error("Gagal mengambil data kecamatan");
      }
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  const handleProvinceChange = (provinceId) => {
    setSelectedProvince(provinceId);
    setSelectedRegency(""); // Reset kota yang dipilih saat mengganti provinsi
    fetchRegencies(provinceId); // Ambil data kota berdasarkan provinsi yang dipilih
  };
  const handleRegencyChange = (regencyId) => {
    setSelectedRegency(regencyId);
    setSelectedDistrict(""); // Reset kecamatan yang dipilih saat mengganti kota
    fetchDistricts(regencyId); // Ambil data kecamatan berdasarkan ID kota yang dipilih
  };

  const handleModalOpen = () => {
    if (Nama && NoTelpon && Email && Alamat && Image) {
      setModal(true);
    } else {
      Alert.alert("Harap lengkapi semua form !");
    }
  };

  const sendDataToFirebase = () => {
    setIsLoading(true);
    try {
      const uploadImage = async () => {
        try {
          const response = await fetch(image);
          const blob = await response.blob();

          const imageName = Date.now(); // Nama unik untuk setiap gambar
          const storageRef = FIREBASE.storage()
            .ref()
            .child(`buktiPembayaran/${imageName}`);

          // Upload gambar ke Firebase Storage
          const snapshot = await storageRef.put(blob);

          // Dapatkan URL gambar dari Firebase Storage
          const imageUrl = await snapshot.ref.getDownloadURL();

          return imageUrl;
        } catch (error) {
          console.error("Gagal mengunggah gambar:", error);
          throw new Error("Gagal mengunggah gambar");
        }
      };

      uploadImage()
        .then((imageUrl) => {
          const pesananData = {
            totalHarga: totalHarga,
            userEmail: Email,
            timestamp: FIREBASE.database.ServerValue.TIMESTAMP,
            products: {}, // Buat objek kosong untuk menyimpan data produk
            imageUrl,
            Alamat,
            Nama,
            Pesan,
            Nama,
          };

          cartItems.forEach(async (item, index) => {
            pesananData[`namaproduct_${index}`] = item.namaproduct;
            pesananData[`quantity_${index}`] = item.quantity;
          });

          // Simpan data ke Firebase Database
          FIREBASE.database().ref("pesanan").push(pesananData)
          .then(() => {
            console.log("Data berhasil terkirim ke Firebase!");
          setModal(false);
          setIsLoading(false);

          // Mengosongkan nilai state
          setNama("");
          setnoTelpon("");
          setEmail("");
          setAlamat("");
          setPesan("");
          setProvinces([]);
          setRegencies([]);
          setDistricts([]);
          setImage(null);
        })
        navigation.replace('Keranjang');
      })
        .catch((error) => {
          console.error("Gagal menyimpan data:", error);
          Alert.alert("Gagal menyimpan data!");
          setIsLoading(false);
        });
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      Alert.alert("Terjadi kesalahan!");
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Izin akses galeri diperlukan");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Menggunakan kunci "assets" untuk mengakses gambar yang dipilih
      setImage(result.assets[0].uri);
    } else {
      console.log("Pemilihan gambar dibatalkan");
    }
  };

  const formatToRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", { currency: "IDR" }).format(amount);
  };
  return (
    <>
      <ScreenTop />
      <ScrollView flex={1}>
        <Box my={5} mx={4}>
          <Heading mb={4} fontSize={18} color={"#006664"}>
            Form Pembayaran
          </Heading>
          <Box backgroundColor={"white"} p={4} rounded={10}>
            <Heading fontSize={18} mb={2}>
              Informasi Pesanan :
            </Heading>
            {cartItems.map((item, index) => (
              <Box key={index}>
                <HStack
                  justifyContent={"space-between"}
                  alignItems={"flex-start"}
                >
                  <Text fontSize={14}>Nama Produk: {item.namaproduct}</Text>
                  <Text mt={2}> X {item.quantity}</Text>
                </HStack>

                {/* Tambahan informasi lainnya sesuai kebutuhan */}
              </Box>
            ))}
            <Box mt={2}>
              <Text bold>Total Harga: Rp {formatToRupiah(totalHarga)}</Text>
            </Box>
          </Box>
          <Box>
            <FormControl>
              <FormControl.Label> Nama Lengkap</FormControl.Label>
              <Input
                placeholder="Nama"
                value={Nama}
                onChangeText={setNama}
                h={12}
                backgroundColor={"white"}
                shadow={4}
              />
              <FormControl.Label> Nomer Telepon</FormControl.Label>
              <Input
                placeholder="NoTelpon"
                value={NoTelpon}
                onChangeText={setnoTelpon}
                h={12}
                backgroundColor={"white"}
                shadow={4}
              />
              <FormControl.Label> Email </FormControl.Label>
              <Input
                placeholder="Email"
                value={Email}
                onChangeText={setEmail}
                h={12}
                backgroundColor={"white"}
                shadow={4}
              />
              <FormControl.Label> Provinsi </FormControl.Label>
              <Select
                selectedValue={selectedProvince}
                onValueChange={(itemValue) => handleProvinceChange(itemValue)}
                h={12}
                backgroundColor={"white"}
                shadow={4}
              >
                <Select.Item label="Pilih Provinsi" value="" />
                {provinces &&
                  provinces.length > 0 &&
                  provinces.map((province) => (
                    <Select.Item
                      key={province.id}
                      label={province.name}
                      value={province.id}
                    />
                  ))}
              </Select>
              <FormControl.Label> Kabupaten/Kota </FormControl.Label>
              <Select
                selectedValue={selectedRegency}
                onValueChange={(itemValue) => handleRegencyChange(itemValue)}
                h={12}
                backgroundColor={"white"}
                shadow={4}
              >
                <Select.Item label="Pilih Kabupaten/Kota" value="" />
                {/* Menampilkan opsi kota */}
                {regencies &&
                  regencies.map((regency) => (
                    <Select.Item
                      key={regency.id}
                      label={regency.name}
                      value={regency.id}
                    />
                  ))}
              </Select>
              <FormControl.Label> Kecamatan </FormControl.Label>
              <Select
                selectedValue={selectedDistrict}
                onValueChange={(itemValue) => setSelectedDistrict(itemValue)}
                h={12}
                backgroundColor={"white"}
                shadow={4}
              >
                <Select.Item label="Pilih Kecamatan" value="" />
                {/* Menampilkan opsi kecamatan */}
                {districts &&
                  districts.map((district) => (
                    <Select.Item
                      key={district.id}
                      label={district.name}
                      value={district.id}
                    />
                  ))}
              </Select>
              <FormControl.Label>
                {" "}
                Tambahkan Informasi Alamat{" "}
              </FormControl.Label>
              <Input
                placeholder="Masukkan Detail Alamat Seperti Blok/nomer rumah"
                value={`${
                  provinces.find((p) => p.id === selectedProvince)?.name || ""
                }, ${
                  regencies.find((r) => r.id === selectedRegency)?.name || ""
                }, ${
                  districts.find((d) => d.id === selectedDistrict)?.name || ""
                }, ${Alamat}`}
                onChangeText={(text) => setAlamat(text)}
                h={12}
                backgroundColor={"white"}
                shadow={4}
              />
              <FormControl.Label> Pesan</FormControl.Label>
              <Input
                placeholder="Tinggalkan Pesan"
                value={Pesan}
                onChangeText={setPesan}
                h={12}
                backgroundColor={"white"}
                shadow={4}
              />
              <Box mt={5}>
                <Heading color={"#006664"} fontSize={18}>
                  Upload Bukti Pembayaran
                </Heading>
                <HStack>
                  <TouchableOpacity onPress={pickImage}>
                    <Box
                      backgroundColor={"gray.200"}
                      size={100}
                      mt={4}
                      display={!image ? "flex" : "none"} // Menyembunyikan box  saat ada gambar
                    >
                      <Center mt={4}>
                        <Ionicons name="cloud-upload" size={60} color="gray" />
                      </Center>
                    </Box>
                  </TouchableOpacity>
                  {image && (
                    <Image
                      source={{ uri: image }}
                      size={200}
                      alt="foto"
                      value={image}
                      mt={4}
                      borderRadius={10}
                    />
                  )}
                </HStack>
              </Box>
            </FormControl>
          </Box>
          <Center>
            <Button
              mt={5}
              h={16}
              w={"80%"}
              backgroundColor={"#006664"}
              rounded={40}
              onPress={handleModalOpen}
            >
              Kirim Bukti
            </Button>

            <Modal isOpen={modal} onClose={() => setModal(false)}>
              <Modal.Content>
                <Modal.Header>Proses Pengiriman Form</Modal.Header>
                <Modal.Body>
                  <Box
                    backgroundColor={"white"}
                    alignItems={"center"}
                    rounded={20}
                  >
                    <Ionicons name="time-outline" size={100} color="#4B4B4B" />
                    <Text>
                      Baik, silakan tunggu 1x24 jam apabila dalam 1x24 jam masih
                      berkendala silakan konfirmasi kembali agar dibantu lebih
                      lanjut. Terima kasih.
                    </Text>
                    {isLoading ? (
                      <Spinner color="#006664" />
                    ) : (
                      <Button
                        m={6}
                        borderRadius={10}
                        onPress={sendDataToFirebase}
                        backgroundColor={"#006664"}
                      >
                        <Heading color={"white"}>OK</Heading>
                      </Button>
                    )}
                  </Box>
                </Modal.Body>
              </Modal.Content>
            </Modal>
          </Center>
        </Box>
      </ScrollView>
    </>
  );
};

export default Pembayaran;
