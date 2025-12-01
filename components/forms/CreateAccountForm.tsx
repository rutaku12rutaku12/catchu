import { auth } from "@/firebase/config";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface CreateAccountProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function CreateAccountForm({
  onBack,
  onSuccess,
}: CreateAccountProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isValidateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidatePassword = (password: string) => {
    return password.length >= 6;
  };

  const isValidateConfirmPassword = (
    password: string,
    confirmPassword: string
  ) => {
    return password === confirmPassword;
  };

  const validateForm = () => {
    if (!email.trim()) {
      Alert.alert("이메일을 입력해주세요.");
      return false;
    }

    if (!isValidateEmail(email)) {
      Alert.alert("이메일 형식이 올바르지 않습니다.");
      return false;
    }

    if (!password.trim()) {
      Alert.alert("비밀번호를 입력해주세요.");
      return false;
    }

    if (!isValidatePassword(password)) {
      Alert.alert("비밀번호는 6자 이상이어야 합니다.");
      return false;
    }

    if (!confirmPassword.trim()) {
      Alert.alert("비밀번호 확인을 입력해주세요.");
      return false;
    }

    if (!isValidateConfirmPassword(password, confirmPassword)) {
      Alert.alert("비밀번호가 일치하지 않습니다.");
      return false;
    }

    return true;
  };

  // 회원가입 버튼 클릭 시 실행될 함수
  const handleSignup = async (email: string, password: string) => {
    if (!validateForm()) return;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // 회원가입 후 자동 로그아웃
      await auth.signOut();
      
      Alert.alert(
      "회원가입 완료되었습니다.", 
      "로그인해주세요.",
      [{ text: "확인", onPress: () => onSuccess() }]
    );
    } catch (error: any) {
      let errorMessage = "회원가입 실패";

      switch (error.code) {
        case "auth/email-already-exists":
          errorMessage = "이미 존재하는 이메일입니다.";
          break;
        case "auth/invalid-email":
          errorMessage = "이메일 형식이 올바르지 않습니다.";
          break;
        case "auth/weak-password":
          errorMessage = "비밀번호가 너무 약합니다.";
          break;
        case "auth/network-request-failed":
          errorMessage = "네트워크 연결을 확인해주세요.";
          break;
      }

      Alert.alert("회원 가입 실패", errorMessage);
    }

    onSuccess();
  };

  // 뒤로가기 버튼 클릭 시 실행될 함수
  const handleBack = () => {
    onBack();
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={styles.scrollView}>
              {/* 헤더 영역 */}
              <View style={styles.header}>
                <TouchableOpacity
                  onPress={handleBack}
                  style={styles.backButton}
                >
                  <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>회원가입</Text>
              </View>

              

              {/* 폼 영역 */}
              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="catchU@email.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {email && !isValidateEmail(email) && (
                    <Text style={styles.errorText}>
                      올바른 이메일 형식을 입력해주세요.
                    </Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="비밀번호"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                  {password && !isValidatePassword(password) && (
                    <Text style={styles.errorText}>
                      비밀번호는 6자 이상이어야 합니다.
                    </Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="비밀번호 확인"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                  />
                  {confirmPassword &&
                    !isValidateConfirmPassword(password, confirmPassword) && (
                      <Text style={styles.errorText}>
                        비밀번호가 일치하지 않습니다.
                      </Text>
                    )}
                </View>
              </View>

              {/* 버튼 영역 */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.signupButton}
                  onPress={() => handleSignup(email, password)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.signupButtonText}>회원가입</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F3F5",
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 24,
    color: "#212529",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#212529",
    marginRight: 30, // 뒤로가기 버튼 영역만큼 오프셋
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 40,
  },
  logoWrapper: {
    alignItems: "center",
  },
  formContainer: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#DEE2E6",
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  errorText: {
    color: "#FA5252",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  buttonContainer: {
    marginTop: "auto", // 하단에 위치
    marginBottom: 30,
  },
  signupButton: {
    backgroundColor: "#8c1aff",
    borderRadius: 6,
    paddingVertical: 16,
    alignItems: "center",
  },
  signupButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});