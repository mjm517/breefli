import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text,
  Image,
  Alert,
  Platform,
  Modal,
} from "react-native";
import React, { useState, useLayoutEffect, useEffect, useContext } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import api from "../../../api";
import { getItemAsync, setItemAsync, deleteItemAsync } from "../../../utils/storage";
import { CheckBox } from "react-native-elements";
import { useAuth } from "../../../components/AuthContext.js";
import LoginHeader from "../../../shared/LoginHeader.js";
import colors from "../../../styles/colors.js";
import { Ionicons } from '@expo/vector-icons';
import { fontSizes } from '../../../styles/GlobalStyles';

TouchableOpacity.defaultProps = { activeOpacity: 0.8 };

const LoginView = () => {
  const nav = useNavigation();

  const route = useRoute();

  const isVolunteer = route.params?.isVolunteer || false;
  const isWeb = () => Platform.OS === "web";
  useEffect(() => {
    //alert('when ar you running')
    loadStoredCredentials("rememberMe");
  }, [rememberMe]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [dialogText, setDialogText] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signIn } = useAuth();

  const handleLogin = async () => {
    // Reset error messages
    setEmailError("");
    setPasswordError("");
    try {
      if (email.length < 1) {
        setEmailError("Please enter email address");
        return;
      } else if (!email.includes("@")) {
        setEmailError("Please enter a valid email address");
        return;
      } else if (password.length < 1) {
        setPasswordError("Please enter password");
        return;
      }

      const backendApiUrl = await api.post(`/auth/login`, {
        email,
        password,
      });

      // remember me storing
      if (rememberMe) {
        await setItemAsync("email", email);
        await setItemAsync("rememberMe", "true");
        console.log("storing credentials for " + email);
      } else {
        await deleteItemAsync("email");
        await deleteItemAsync("rememberMe");
      }

      if (backendApiUrl.status === 200) {
        await setItemAsync("access", backendApiUrl.data.data.access);
        console.log("setting refresh token " + backendApiUrl.data.data.refresh);
        await setItemAsync("refresh", backendApiUrl.data.data.refresh);
        await setItemAsync(
          "full_name",
          backendApiUrl.data.data.full_name
        );
        await setItemAsync("user_id", backendApiUrl.data.data.user_id);

        const loggedInUser = {
          full_name: backendApiUrl.data.data.full_name,
          first_name: backendApiUrl.data.data.first_name,
          last_name: backendApiUrl.data.data.last_name,
          user_id: backendApiUrl.data.data.user_id,
          user_group: backendApiUrl.data.data.user_group,
        };
        // signIn("dummy-auth-token", loggedInUser);
        signIn(null, loggedInUser);
      } else {
        console.log("Login failed");
        showAlert("Invalid email or password");
      }
    } catch (error) {
      //showAlert(error.response.data.message);
      //showAlert('Unable to contact server. Please contact System Admin.');
      console.log(error.response.data.message);
      setDialogText(error.response.data.message);
      setShowDialog(true);
      console.error("Error", error);
    }
  };

  const handleOkButtonClick = () => {
    setShowDialog(false);
  };

  const loadStoredCredentials = async (fldname) => {
    try {
      const storedremeber = await getItemAsync("rememberMe");

      if (storedremeber !== null && storedremeber === "true") {
        setRememberMe(true);
        console.log("setting remember in load " + storedremeber);
        const storedEmail = await getItemAsync("email");
        console.log("setting email from load " + storedEmail);
        if (storedEmail !== null) {
          setEmail(storedEmail);
        }
      }
    } catch (error) {
      console.error("Error stored credentials:", error);
    }
  };

  const showAlert = (title, message) => {
    console.log(Platform.OS);
    if (Platform.OS === "web") {
      alert(title, message);
    } else {
      Alert.alert(title, message, [{ text: "OK" }], { cancelable: false });
    }
  };
  /* <Image
          source={require("../../../assets/splash1.png")}
          style={styles.image}
        /> */

  //Render custom header only on web UI
  const renderCustomHeader = isWeb() ? <LoginHeader /> : null;

  return (
    <View style={styles.screenContainer}>
      <Image
        source={require("../../../assets/splash1.png")}
        style={styles.image}
      />
      <View style={[isWeb() && inputstyles.card]}>
        <View style={styles.viewStyle}>
          <Text style={[inputstyles.text]}>Email address</Text>
          <TextInput
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={[inputstyles.input, { fontSize: fontSizes.medium }]}
            keyboardType="email-address"
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
        </View>

        <View
          style={{
            flexDirection: "column",
            borderBottomColor: "#ccc",
            paddingBottom: 8,
            marginBottom: 25,
          }}
        >
          <Text style={inputstyles.text}>Password</Text>
          <View style={inputstyles.passwordContainer}>
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={!showPassword}
              style={inputstyles.passwordInput}
            />
            <TouchableOpacity
              style={inputstyles.showPasswordButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color={colors.primaryColorVariant}
              />
            </TouchableOpacity>
          </View>
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}
        </View>
        <CheckBox
          title="Remember me"
          checked={rememberMe}
          onPress={() => setRememberMe(!rememberMe)}
          textStyle={{ fontSize: fontSizes.medium }}
        />

        <AppButton
          title="Login"
          backgroundColor={colors.primaryColorVariant}
          onPress={handleLogin}
        />
      </View>
      <Modal
        visible={showDialog}
        transparent
      >
        <View style={inputstyles.modalContainer}>
          <View style={inputstyles.modalContent}>
            <Text>{dialogText}</Text>
            <TouchableOpacity
              onPress={() => handleOkButtonClick()}
              style={inputstyles.okButton}
            >
              <Text style={inputstyles.okButtonText}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const AppButton = ({ onPress, title, backgroundColor }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.appButtonContainer, backgroundColor && { backgroundColor }]}
  >
    <Text style={styles.appButtonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  appButton: {
    padding: 12,
  },
  appButtonContainer: {
    elevation: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    marginTop: 10,
    alignItems: "center",
    borderRadius: 25,
  },
  appButtonText: {
    fontSize: fontSizes.large,
    color: "#fff",
    alignSelf: "center",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  image: {
    width: 140,
    height: 140,
    marginBottom: 5,
    alignSelf: "center",
  },
  errorText: {
    fontSize: fontSizes.medium,
    color: "red",
    marginTop: 5,
  },
});

const inputstyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#228B22",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
  title: {
    fontSize: 40,
    color: "#fff",
    marginBottom: 20,
    //fontWeight: "bold",
  },
  text: {
    fontSize: fontSizes.medium,
  },
  input: {
    fontSize: fontSizes.medium,
    backgroundColor: "#fff",
    padding: 10,
    width: "100%",
    marginTop: 15,
    height: 48,
    borderColor: "#000000",
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "70%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    paddingTop: 20,
    marginHorizontal: 150,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background color
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1, // Add border width
    borderColor: "#C0C0C0", // Add border color
  },
  okButton: {
    backgroundColor: colors.primaryColorVariant, // Customize the button background color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 15,
  },
  okButtonText: {
    color: "white", // Customize the button text color
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 15,
  },
  passwordInput: {
    fontSize: fontSizes.medium,
    flex: 1,
    height: 48,
    padding: 10,
  },
  showPasswordButton: {
    padding: 10,
  },
});

export default LoginView;