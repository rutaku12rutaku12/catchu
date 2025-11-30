import { db, auth } from "@/firebase/config";
import { PostWithContentDto } from "@/types/post";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { 
    doc, 
    getDoc, 
    collection, 
    addDoc, 
    query, 
    where, 
    onSnapshot,
    Timestamp 
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { 
    StyleSheet, 
    View, 
    Text, 
    Dimensions, 
    Pressable,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Alert
} from "react-native";

interface CommentDto {
    id: string;
    postId: string;
    content: string;
    userEmail: string;
    userId?: string;
    createDate: any;
}

export default function Post() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const [post, setPost] = useState<PostWithContentDto | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [comments, setComments] = useState<CommentDto[]>([]);
    const [commentText, setCommentText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 날짜 포맷 함수
    const formatDate = (timestamp: any) => {
        if (!timestamp) return "";
        
        try {
            const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            
            return `${year}년 ${month}월 ${day}일 ${hours}:${minutes.toString().padStart(2, '0')}`;
        } catch (error) {
            return "";
        }
    };

    const fetchPost = async () => {
        try {
            const postRef = doc(db, "post", id as string);
            const postsSnap = await getDoc(postRef);

            if (postsSnap.exists()) {
                const postData = postsSnap.data() as PostWithContentDto;
                setPost(postData);
            }
        } catch (error) {
            console.log("오류 발생: " + error);
            setError("오류 발생");
        }
    };

    // 댓글 실시간 가져오기
    useEffect(() => {
        if (!id) return;

        const commentsRef = collection(db, "comments");
        const q = query(
            commentsRef,
            where("postId", "==", id)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const commentsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as CommentDto[];
            
            // 최신순 정렬
            commentsData.sort((a, b) => {
                const aTime = a.createDate?.toMillis ? a.createDate.toMillis() : 0;
                const bTime = b.createDate?.toMillis ? b.createDate.toMillis() : 0;
                return bTime - aTime;
            });
            
            setComments(commentsData);
        });

        return () => unsubscribe();
    }, [id]);

    // 댓글 작성
    const handleSubmitComment = async () => {
        if (!commentText.trim()) {
            Alert.alert("댓글을 입력해주세요.");
            return;
        }

        const currentUser = auth.currentUser;
        if (!currentUser) {
            Alert.alert("로그인이 필요합니다.");
            return;
        }

        setIsSubmitting(true);

        try {
            await addDoc(collection(db, "comments"), {
                postId: id,
                content: commentText.trim(),
                userEmail: currentUser.email || "익명",
                userId: currentUser.uid,
                createDate: Timestamp.now(),
            });

            setCommentText("");
            Alert.alert("댓글이 등록되었습니다.");
        } catch (error) {
            console.log("댓글 등록 오류:", error);
            Alert.alert("댓글 등록에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        fetchPost();
    }, []);

    if (!post) {
        return (
            <View style={styles.postContainer}>
                <Text style={styles.loadingText}>로딩중···</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView 
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.postContainer}>
                <View style={styles.postInner}>
                    <View style={styles.postHeader}>
                        <View style={styles.postHedaerLeft}>
                            <Pressable onPress={() => router.back()}>
                                <Ionicons name="chevron-back" size={24} color="black" />
                            </Pressable>
                        </View>
                    </View>

                    <ScrollView style={{ flex: 1 }}>
                        <View style={styles.postContentContainer}>
                            <View style={styles.contentHedaer}>
                                <View style={styles.profileImage}></View>
                                <Pressable onPress={() => console.log("MyPage")}>
                                    <Ionicons name="person-circle-outline" size={30} color="black" />
                                </Pressable>
                                <View style={styles.profileInfo}>
                                    <Text style={styles.profileNickname}>
                                        {post?.userEmail || "익명"}
                                    </Text>
                                    <Text style={styles.profileDate}>
                                        {formatDate(post?.createDate)}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.contentBody}>
                                <View style={styles.contentTitleWrap}>
                                    <Text style={styles.postTitle}>{post?.title}</Text>
                                </View>
                                <View style={styles.contentBodyWrap}>
                                    <Text style={styles.postBody}>{post?.content}</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>

                <View style={styles.postReplyContainer}>
                    <View style={styles.postReplyInner}>
                        <View>
                            <Text style={{ fontWeight: "bold" }}>댓글 {comments.length}</Text>
                        </View>
                        
                        {comments.length === 0 ? (
                            <View style={styles.postReplyContent}>
                                <Text>아직 댓글이 없어요.</Text>
                                <Text>가장 먼저 댓글을 남겨보세요.</Text>
                            </View>
                        ) : (
                            <ScrollView style={{ flex: 1, marginTop: 10 }}>
                                {comments.map((comment) => (
                                    <View key={comment.id} style={styles.commentItem}>
                                        <View style={styles.commentHeader}>
                                            <Ionicons name="person-circle-outline" size={20} color="black" />
                                            <View style={{ marginLeft: 5 }}>
                                                <Text style={styles.commentUserEmail}>
                                                    {comment.userEmail}
                                                </Text>
                                                <Text style={styles.commentDate}>
                                                    {formatDate(comment.createDate)}
                                                </Text>
                                            </View>
                                        </View>
                                        <Text style={styles.commentContent}>
                                            {comment.content}
                                        </Text>
                                    </View>
                                ))}
                            </ScrollView>
                        )}
                    </View>
                </View>

                <View style={styles.postReplyInputContainer}>
                    <View style={styles.postReplyInputInner}>
                        <TextInput
                            style={styles.commentInput}
                            placeholder="댓글을 입력하세요..."
                            placeholderTextColor="#999"
                            value={commentText}
                            onChangeText={setCommentText}
                            multiline
                            maxLength={500}
                        />
                        <TouchableOpacity 
                            style={[
                                styles.submitButton,
                                (!commentText.trim() || isSubmitting) && styles.submitButtonDisabled
                            ]}
                            onPress={handleSubmitComment}
                            disabled={!commentText.trim() || isSubmitting}
                        >
                            <Text style={styles.submitButtonText}>
                                {isSubmitting ? "등록중..." : "등록"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const WIDTH = Dimensions.get("window").width;

const styles = StyleSheet.create({
    postContainer: {
        flex: 1,
        alignItems: "center",
        margin: 60,
        gap: 5,
    },
    loadingText: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: 20,
        fontWeight: "bold",
    },
    postInner: {
        width: WIDTH,
        backgroundColor: "#fff",
        flex: 0.6,
    },
    postHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    postHedaerLeft: {},
    postHedaerRight: {
        flexDirection: "row",
        gap: 10,
    },
    postContentContainer: {
        padding: 10,
    },
    contentHedaer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 5,
        gap: 10,
    },
    profileImage: {},
    profileInfo: {},
    profileNickname: {
        fontWeight: "bold",
    },
    profileDate: {
        fontSize: 13,
        color: "#666",
    },
    postTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        paddingVertical: 8,
    },
    contentBody: {},
    contentTitleWrap: {},
    postBodyContainer: {
        marginTop: 5,
    },
    contentFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
    },
    contentFooterItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    contentBodyWrap: {},
    postBody: {
        fontSize: 16,
    },
    postReplyContainer: {
        width: WIDTH,
        backgroundColor: "#fff",
        flex: 0.3,
    },
    postReplyInner: {
        padding: 10,
        flex: 1,
    },
    postReplyContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    commentItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    commentHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },
    commentUserEmail: {
        fontWeight: "600",
        fontSize: 12,
    },
    commentDate: {
        fontSize: 10,
        color: "#999",
    },
    commentContent: {
        fontSize: 14,
        marginLeft: 25,
    },
    postReplyInputContainer: {
        width: WIDTH,
        backgroundColor: "#fff",
        flex: 0.1,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
    },
    postReplyInputInner: {
        padding: 10,
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 10,
    },
    commentInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        fontSize: 14,
        maxHeight: 80,
    },
    submitButton: {
        backgroundColor: "#8c1aff",
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    submitButtonDisabled: {
        backgroundColor: "#ccc",
    },
    submitButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },
});