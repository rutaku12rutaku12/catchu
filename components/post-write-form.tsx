import { auth, db, storage } from "@/firebase/config";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useRouter } from "expo-router";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useEffect, useRef, useState } from "react";
import { 
    Animated, Keyboard, KeyboardAvoidingView,
    Platform, StatusBar, StyleSheet, View, Text, TouchableOpacity, 
    TextInput, ScrollView, Alert, Image, ActivityIndicator
} from "react-native";


const useKeyboardOffsetHook = () => {
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const keyboardOffset = useRef(new Animated.Value(0)).current;

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
    const [error, setError] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            setTitle("");
            setContent("");
            setSelectedImage(null);
        }, [])
    );

    const { keyboardHeight, keyboardVisible, keyboardOffset} =
        useKeyboardOffsetHook();

    // 이미지 권한 요청
    const requestPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.');
            return false;
        }
        return true;
    };

    // 이미지 선택
    const onImageSelect = useCallback(async () => {
        const hasPermission = await requestPermission();
        if (!hasPermission) return;

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                setSelectedImage(result.assets[0].uri);
            }
        } catch (error) {
            console.log("이미지 선택 오류:", error);
            Alert.alert("이미지를 선택할 수 없습니다.");
        }
    }, []);

    // 이미지 제거
    const removeImage = useCallback(() => {
        setSelectedImage(null);
    }, []);

    // Firebase Storage에 이미지 업로드
    const uploadImageToFirebase = async (uri: string): Promise<string> => {
        const response = await fetch(uri);
        const blob = await response.blob();
        
        // 고유한 파일명 생성
        const filename = `posts/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
        const storageRef = ref(storage, filename);
        
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        
        return downloadURL;
    };

    const handleClose = () => {
        if(title || content || selectedImage){
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
        router.navigate("/(tabs)/posts/page");
    };

    const validateForm = useCallback(() => {
        if(title.trim().length === 0){
            Alert.alert("제목을 입력해주세요.");
            return false;
        }
        if(content.trim().length === 0){
            Alert.alert("내용을 입력해주세요.");
            return false;
        }
        return true;
    }, [title, content]);

    const onSubmit = useCallback(async () => {
        if (!validateForm()) return;
        
        setUploading(true);
        
        try {
            let imageUrl = null;
            
            // 이미지가 선택되었으면 업로드
            if (selectedImage) {
                imageUrl = await uploadImageToFirebase(selectedImage);
            }
            
            // 현재 로그인한 사용자 정보 가져오기
            const currentUser = auth.currentUser;
            // Firestore에 게시물 저장
            await addDoc(collection(db, "post"), {
                title: title,
                content: content,
                imageUrl: imageUrl,
                createDate: Timestamp.now(),
                userId: currentUser?.uid || null,           
                userEmail: currentUser?.email || "익명",    
            });
                
            setTitle("");
            setContent("");
            setSelectedImage(null);
            setError(null);
            setUploading(false);
            
            Alert.alert("게시물이 등록되었습니다.");
            router.navigate("/(tabs)/posts/page");
        } catch(error) {
            console.log("오류 발생: ", error);
            Alert.alert("게시물 등록에 실패했습니다.");
            setError("오류 발생");
            setUploading(false);
        }
    }, [title, content, selectedImage, validateForm]);

    return(
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.statusBar}></View>

            {/* 네비게이션 헤더 */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleClose}>
                    <Ionicons name="close" size={28} color="black" />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.completeButton} 
                    onPress={onSubmit}
                    disabled={uploading}
                >
                    {uploading ? (
                        <ActivityIndicator size="small" color="black" />
                    ) : (
                        <Text style={styles.completeButtonText}>완료</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* 구분선 */}
            <View style={styles.divider} />

            {/* 제목 입력 */}
            <TextInput
                style={styles.titleInput}
                placeholder="제목을 입력하세요."
                placeholderTextColor="#999"
                value={title}
                onChangeText={setTitle}
                editable={!uploading}
            />

            {/* 내용 입력 (스크롤뷰 사용) */}
            <ScrollView style={styles.contentContainer} keyboardShouldPersistTaps="handled">
                <TextInput
                    style={styles.contentInput}
                    placeholder="이야기를 나눠보세요."
                    placeholderTextColor="#999"
                    multiline
                    value={content}
                    onChangeText={setContent}
                    textAlignVertical="top"
                    editable={!uploading}
                />
                
                {/* 선택된 이미지 미리보기 */}
                {selectedImage && (
                    <View style={styles.imagePreviewContainer}>
                        <Image 
                            source={{ uri: selectedImage }} 
                            style={styles.imagePreview}
                        />
                        <TouchableOpacity 
                            style={styles.removeImageButton}
                            onPress={removeImage}
                        >
                            <Ionicons name="close-circle" size={28} color="white" />
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            {/* 하단 툴바 */}
            <Animated.View 
                style={[
                    styles.toolbar,
                    {
                        transform: [{ translateY: keyboardOffset }],
                    },
                ]}
            >
                <TouchableOpacity 
                    style={styles.toolbarButton} 
                    onPress={onImageSelect}
                    disabled={uploading}
                >
                    <Ionicons name="image-outline" size={24} color={uploading ? "#ccc" : "black"} />
                    <Text style={[styles.toolbarText, uploading && { color: "#ccc" }]}>
                        사진
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: "#fff",
    },
    statusBar:{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight: 10,
        paddingBottom: 5,
    },
    time: {
        color: "black",
        fontWeight: "bold",
    },
    statusIcons:{
        flexDirection: "row",
        alignItems: "center",
    },
    networkText:{
        color: "black",
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
        color: "black",
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
        color:"black",
        fontSize:16,
    },
    divider:{
        height: 1,
        backgroundColor: "#ddd",
    },
    titleInput:{
        color: "black",
        fontSize: 18,
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    contentContainer:{
        flex:1,
    },
    contentInput:{
        color: "black",
        fontSize: 16,
        padding: 15,
        minHeight: 200,
    },
    imagePreviewContainer: {
        position: "relative",
        marginHorizontal: 15,
        marginBottom: 15,
    },
    imagePreview: {
        width: "100%",
        height: 300,
        borderRadius: 10,
        backgroundColor: "#f0f0f0",
    },
    removeImageButton: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "rgba(0,0,0,0.5)",
        borderRadius: 14,
    },
    toolbar:{
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        backgroundColor: "#fff",
    },
    toolbarButton:{
        alignItems:"center",
        justifyContent:"center",
    },
    toolbarText:{
        color:"black",
        marginTop: 5,
        fontSize: 12,
    },
});