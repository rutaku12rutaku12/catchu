import { PostWithContentDto } from "@/types/post";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";

export default function Post() {
    const {userId, id, title, body }= useLocalSearchParams();

    const [post, setPost] = useState<PostWithContentDto | null>(null);

    useEffect(()=>{
        setPost({
            userId: Number(userId),
            id:Number(id),
            title:title as string, // title as string : 타입 스크립트에서 타입을 강제로 변경
            body: body as string,
        });
    }, []);
    return(
        <View style={styles.postContainer}>
            <View style={styles.postInner}>
                <View style={styles.postHedaer}>
                <Text style={styles.postTitle}>제목: {title}</Text>
                    <Text style={styles.postTitleContent}>{post?.title}</Text>
                </View>
                <View style={styles.postBodyContainer}>
                    <Text style={styles.postBody}>내용: {post?.body}</Text>
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
    },
    postInner:{
        width: WIDTH-15,
        padding: 16,
        borderRadius: 10,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset:{
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    postHedaer:{
        borderBottomWidth:1,
        borderBottomColor: "#ccc",
        paddingVertical: 10,
    },
    postTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
    postTitleContent:{
        fontSize: 16,
        color: "#333",
    },
    postBodyContainer:{
        marginTop: 5,
    },
    postBody:{
        fontSize: 16,
        marginTop: 5,
    },
});