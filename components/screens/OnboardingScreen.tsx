import CreateAccountForm from "@/components/forms/CreateAccountForm";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnboardingScreen() {
    const [showCreateAccount, setShowCreateAccount] = useState(false);

    // 시작하기 버튼 클릭 시 실행함수
    const handleCreateAccount = () => {
        setShowCreateAccount(true);
    };

    // 로그인 클릭시 실행함수
    const handleLogin = () => {
        console.log("로그인");
    };

    if( showCreateAccount ) {
        return (
            <CreateAccountForm
                onBack={() => setShowCreateAccount(false)}
                onSuccess={() => setShowCreateAccount(false)}
            />
        );
    }

    return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>캐치유를 Play해 보세요!</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
          <Text style={styles.buttonText}>시작하기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={handleLogin}>
          <Text style={styles.buttonText}>로그인</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    width: '80%',
  },
  button: {
    backgroundColor: '#8c1aff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: '#8c1aff',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});