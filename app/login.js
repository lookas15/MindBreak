import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
  const router = useRouter();
  const auth = getAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", "Invalid email or password");
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <Image
              source={require("../assets/images/logo.png")}
              style={styles.logo}
            />
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.push("/landing")}
            >
              <Text style={styles.backButtonText}>{"< Back"}</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Log in</Text>
            <Text style={styles.subtitle}>Welcome back!</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Username"
                style={styles.input}
                placeholderTextColor="#bbb"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                placeholder="Password"
                style={styles.input}
                placeholderTextColor="#bbb"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.createAccountButton}
                onPress={() => router.push("/register")}
              >
                <Text style={styles.createAccountText}>Create account</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
              >
                <Text style={styles.loginText}>Log in</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.orContinueWith}>Or continue with</Text>
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Image
                  source={require("../assets/images/google.png")}
                  style={styles.socialIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Image
                  source={require("../assets/images/x.png")}
                  style={styles.socialIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Image
                  source={require("../assets/images/facebook.png")}
                  style={styles.socialIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <Text style={styles.footerText}>© All Right Reserved to de VSAUCE</Text>
    </View>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2d046e",
    width: width,
    height: height,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  backButton: {
    alignSelf: "flex-start",
    padding: 10,
    marginLeft: 10,
    backgroundColor: "#4c3c90",
    borderRadius: 5,
    position: "absolute",
    top: 60,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    alignItems: "center",
    padding: 20,
    justifyContent: "center",
    flex: 1,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#bbb",
    fontSize: 16,
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#4c3c90",
    color: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  forgotPassword: {
    color: "#bbb",
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  createAccountButton: {
    backgroundColor: "#4c3c90",
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  createAccountText: {
    color: "white",
  },
  loginButton: {
    backgroundColor: "#f15a29",
    padding: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
  },
  loginText: {
    color: "white",
  },
  orContinueWith: {
    color: "#bbb",
    marginVertical: 20,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    marginBottom: 20,
  },
  socialButton: {
    backgroundColor: "#4c3c90",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  socialIcon: {
    width: 30,
    height: 30,
  },
  footerText: {
    color: "#bbb",
    textAlign: "center",
    paddingBottom: 10,
  },
});