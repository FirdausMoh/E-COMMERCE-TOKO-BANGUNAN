import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Center, NativeBaseProvider, Text } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import Profile from "./screens/profile";
import HomeScreen from "./screens/home";
import Category from "./screens/category";
import Product from "./screens/Product";
import Login from "./screens/login";
import Register from "./screens/register";
import DetailProduct from "./screens/detailproduct";
import Aboutus from "./screens/AboutUs";
import Semen from "./screens/Semen";
import Cat from "./screens/Cat";
import Bata from "./screens/Bata";
import Keranjang from "./screens/Keranjang";
import Faqs from "./screens/Faq";
import Galvalum from "./screens/Galvalum";
import Splash from "./screens/Splash";
import Pembayaran from "./screens/buktiPembayaran";

Ionicons.loadFont();

// Navigator Declaration
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const noHead = { headerShown: false };

const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          switch (route.name) {
            case "Home":
              iconName = "home-outline";
              break;
            case "Profile":
              iconName = "person-circle-outline";
              break;
            case "Category":
              iconName = "basket";
              break;
          }
          return (
            <Ionicons
              name={iconName}
              size={30}
              color={focused ? "#006664" : color}
              marginBottom={ Platform.OS === "ios" ? 2 : 0 } // Tambahkan buat ios
            />
          );
        },
        tabBarIconStyle: { marginTop: 5 },
        tabBarStyle: {
          height: '7%',
          width: "full",
          borderTopWidth: 0,
          backgroundColor: "#373737",
          marginVertical: 10,
          marginHorizontal: 40,
          borderRadius: 15,
          position: "absolute",
          paddingBottom: Platform.OS === "ios" ? 2 : 0, //buat ios
        },
        tabBarLabel: ({}) => {},
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={noHead} />
      <Tab.Screen name="Category" component={Category} options={noHead} />
      <Tab.Screen name="Profile" component={Profile} options={noHead} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen name="Tabs" component={Tabs} options={noHead} />
          <Stack.Screen name="Splash" component={Splash} options={noHead} />
          <Stack.Screen name="Product" component={Product} options={noHead} />
          <Stack.Screen
            name="Detail Product"
            component={DetailProduct}
            options={noHead}
          />
          <Stack.Screen name="Login" component={Login} options={noHead} />
          <Stack.Screen name="AboutUs" component={Aboutus} options={noHead} />
          <Stack.Screen name="Semen" component={Semen} options={noHead} />
          <Stack.Screen name="Bata" component={Bata} options={noHead} />
          <Stack.Screen name="Cat" component={Cat} options={noHead} />
          <Stack.Screen name="Faq" component={Faqs} options={noHead} />
          <Stack.Screen name="Register" component={Register} options={noHead} />
          <Stack.Screen name="Galvalum" component={Galvalum} options={noHead} />
          <Stack.Screen
            name="Keranjang"
            component={Keranjang}
            options={noHead}
          />
          <Stack.Screen
            name="Pembayaran"
            component={Pembayaran}
            options={noHead}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default App;
