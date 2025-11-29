import { db } from "@/firebase/config";
import { PostWithContentDto } from "@/types/post";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Dimensions, Pressable } from "react-native";
export default function Post() {
    const router =useRouter();
    // useLocalSearchParams 동적 라우팅을 위한 파라미터를 가져오는 함수
    // 파라미터값을 문자열로 취급
    const {postId, }= useLocalSearchParams();

    const [post, setPost] = useState<PostWithContentDto | null>(null);

    const fetchPost = async () => {
        try{
          const postsQuery = query(
            collection(db, "post"), // post 테이블을 조회
            where("postId","==", Number(postId)) 
        ); 
    
          // getDocs : firestore에서 데이터를 가져오는 함수
          const postsSnapshot = await getDocs(postsQuery);
    
          const post = postsSnapshot.docs[0].data();
          console.log(post);
          // post as PostWithContentDto : 타입 캐스팅
          setPost(post as PostWithContentDto);
        }catch(error){
          console.log(error);
        }
      };

    return(
        <View style={styles.postContainer}>
            <View style={styles.postInner}>
                <View style={styles.postHeader}>
                    <View style={styles.postHedaerLeft}>
                        {/* 왼쪽 화살표 아이콘 */}
                        <Pressable onPress={()=> router.back()}>
                            <Ionicons name="chevron-back" size={24} color="black" />
                        </Pressable>
                    </View>
                    <View style={styles.postHedaerRight}>
                        <Pressable onPress={()=> console.log("notifications-outline")}>
                            <Ionicons name="notifications-outline" size={24} color="black" />
                        </Pressable>
                        <Pressable onPress={()=> console.log("upload")}>
                            <Ionicons name="cloud-upload-outline" size={24} color="black" />
                        </Pressable>
                        <Pressable onPress={()=> console.log("dots-vertical")}>
                            <Ionicons name="ellipsis-vertical" size={24} color="black" />
                        </Pressable>
                    </View>
                </View>
                <View style={styles.postContentContainer}>
                    <View style={styles.contentHedaer}>
                        <View style={styles.profileImage}></View>
                            <Pressable onPress={()=>console.log("MyPage")}>
                                <Ionicons name="person-circle-outline" size={30} color="black" />
                            </Pressable>
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileNickname}>닉네임</Text>
                            <Text style={styles.profileDate}>2025년 11월 30일</Text>
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
            </View>
            <View style={styles.postReplyContainer}>
                <View style={styles.postReplyInner}>
                    <View>
                        <Text style={{fontWeight: "bold"}}>댓글0</Text>
                    </View>
                    <View style={styles.postReplyContent}>
                        <Text>아직 댓글이 없어요.</Text>
                        <Text>가장 먼저 댓글을 남겨보세요.</Text>
                    </View>
                </View>
            </View>
            <View style={styles.postReplyInputContainer}>
                <View style={styles.postReplyInputInner}>
                    <Text style={{fontWeight: "bold"}}>댓글 입력창</Text>
                </View>
            </View>
        </View>
    );
}

const WIDTH = Dimensions.get("window").width

const styles = StyleSheet.create({
    postContainer:{
        flex: 1,
        alignItems: "center",
        margin: 60,
        gap:5,
    },
    postInner:{
        width: WIDTH,
        backgroundColor: "#fff",
        flex: 0.6,
    },
    postHeader:{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth:1,
        borderBottomColor: "#ccc",
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    postHedaerLeft:{},
    postHedaerRight:{
        flexDirection: "row",
        gap:10,
    },
    postContentContainer:{
        padding: 10,
        flexGrow:1,
    },
    contentHedaer:{
        flexDirection:"row",
        alignItems:"center",
        paddingVertical:5,
        gap:10,
    },
    profileImage:{    
    },
    profileInfo:{

    },
    profileNickname:{
        fontWeight: "bold",
    },
    profileDate:{
        fontSize:13,
        color:"#666",
    },
    postTitle:{
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        paddingVertical: 8,
    },
    contentBody:{
        flexGrow:1,
    },
    contentTitleWrap:{},
        postBodyContainer:{
            marginTop: 5,
        },
    contentBodyWrap:{
        flex:1,
    },
    postBody:{
        flex:1,
        fontSize:16,
    },
    postReplyContainer:{
        width: WIDTH,
        backgroundColor: "#fff",
        flex: 0.3,
    },
    postReplyInner:{
        padding: 10,
        flex:1,
        justifyContent:"center",
        alignItems:"center",
    },
    postReplyContent:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",

    },
    postReplyInputContainer:{
        width: WIDTH,
        backgroundColor: "#fff",
        flex: 0.1,
    },
    postReplyInputInner:{
        padding:10,
    },
});