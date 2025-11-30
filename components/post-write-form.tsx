import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { 
    Animated, Keyboard, KeyboardAvoidingView,
    Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, 
    Alert} from "react-native";


const useKeyboardOffsetHook = () => {
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const keyboardOffset = useRef(new Animated.Value(0)).current;

    // 키보드가 나타났을 때
    const keyboardDidShowListener = (e: any) => {
        const { height } = e.endCoordinates;
        setKeyboardHeight(height);
        setKeyboardVisible(true);

        Animated.timing(keyboardOffset, {
            toValue: -height,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    // 키보드가 사라졌을 때
    const keyboardDidHideListener = () => {
        setKeyboardHeight(0);
        setKeyboardVisible(false);

        Animated.timing(keyboardOffset, {
            toValue:0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    useEffect(()=>{
        const keyboardShowListener = Keyboard.addListener(
            "keyboardDidShow",
            keyboardDidShowListener
        );
        const keyboardHideListener = Keyboard.addListener(
            "keyboardDidHide",
            keyboardDidHideListener
        );

        return ()=> {
            keyboardShowListener.remove();
            keyboardHideListener.remove();
        };
    }, []);

    return { keyboardHeight, keyboardVisible, keyboardOffset };
};

export default function PostWriteForm(){
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // useFocusEffect : 화면이 포커스 될 때마다 실행
    useFocusEffect(
        useCallback(() => {
            setTitle("");
            setContent("");
        }, [])
    );

    const { keyboardHeight, keyboardVisible, keyboardOffset} =
        useKeyboardOffsetHook();

    const handleClose =() =>{
        if(title || content){
            Alert.alert("작성을 취소하시겠습니까?", "", [
                {
                    text: "확인",
                    onPress: () => router.navigate("/(tabs)/posts/page"),
                },
                {
                    text: "취소",
                    onPress: () => {},
                    style: "cancel",
                },
            ]);
            return;
        }
    };

    return(
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.statusBar}></View>

            {/* 네비게이션 헤더 */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleClose}>
                    <Ionicons name="close" size={28} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.completeButton}>
                    <Text style={styles.completeButtonText}>완료</Text>
                </TouchableOpacity>
            </View>

            {/* 주제 선택 영역 */}
            <TouchableOpacity style={styles.topicSelector}>
                <Text style={styles.topicText}>게시글의 주제를 선택해주세요.</Text>
                <Ionicons name="chevron-forward" size={24} color="white" />
            </TouchableOpacity>

            {/* 구분선 */}
            <View style={styles.divider} />

            {/* 제목 입력 */}
            <TextInput
                style={styles.titleInput}
                placeholder="제목을 입력하세요."
                placeholderTextColor="#999"
                value={title}
                onChangeText={setTitle}
            />

            {/* 내용 입력 (스크롤뷰 사용) */}
            <ScrollView style={styles.contentContainer}>
                <TextInput
                    style={styles.contentInput}
                    placeholder="이야기를 나눠보세요."
                    placeholderTextColor="#999"
                    multiline
                    value={content}
                    onChangeText={setContent}
                    textAlignVertical="top"
                />
            </ScrollView>

            {/* 하단 툴바 */}
            <View style={styles.toolbar}>
                <TouchableOpacity style={styles.toolbarButton}>
                    <Ionicons name="image-outline" size={24} color="white" />
                    <Text style={styles.toolbarText}>사진</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolbarButton}>
                    <Ionicons name="location-outline" size={24} color="white" />
                    <Text style={styles.toolbarText}>장소</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolbarButton}>
                    <Ionicons name="ticket" size={24} color="white" />
                    <Text style={styles.toolbarText}>투표</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.toolbarButton}>
                    <Ionicons name="pricetags-outline" size={24} color="white" />
                    <Text style={styles.toolbarText}>태그</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: "#121212",
    },
    statusBar:{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight: 10,
        paddingBottom: 5,
    },
    time: {
        color: "white",
        fontWeight: "bold",
    },
    statusIcons:{
        flexDirection: "row",
        alignItems: "center",
    },
    networkText:{
        color: "white",
        marginRight: 5,
    },
    header:{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    completeButton:{
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    completeButtonText:{
        color: "white",
        fontSize: 16,
    },
    topicSelector:{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal:15,
        paddingVertical: 15,
    },
    topicText:{
        color:"white",
        fontSize:16,
    },
    divider:{
        height: 1,
        backgroundColor: "#333",
    },
    titleInput:{
        color: "white",
        fontSize: 18,
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#333",
    },
    contentContainer:{
        flex:1,
    },
    contentInput:{
        color: "white",
        fontSize: 16,
        padding: 15,
        height: "100%",
    },
    toolbar:{
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "#333",
    },
    toolbarButton:{
        alignItems:"center",
        justifyContent:"center",
    },
    toolbarText:{
        color:"white",
        marginTop: 5,
        fontSize: 12,
    },
});
