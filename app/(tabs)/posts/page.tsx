import { PostDto} from "@/types/post";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions ,StyleSheet, View , Text, FlatList} from "react-native";
import { collection, onSnapshot, orderBy, query, Timestamp } from "firebase/firestore";
import { db } from "@/firebase/config";

export default function Posts() {

  const [posts, setPosts] = useState<PostDto[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try{
      const postsQuery = query(
        collection(db, "post"),
        orderBy("createDate","desc")
      ); 

      await onSnapshot(postsQuery, (snapShot) => {
        const postsData = snapShot.docs.map((doc) => {
          const { createDate, title, content } = doc.data();
          
          return {
            id: doc.id,
            createDate: createDate as Timestamp,
            title: title,
            content: content,
          };
        });
        
        setPosts(postsData);
      });
    }catch(error){
      console.log("오류 발생: " + error);
      setError("오류 발생");
    }
  };

  useEffect(()=> {
    fetchPosts();
  }, []);

  if (!posts){
    return (
      <View style={styles.postsContainer}>
        <Text style={styles.loadingText}>로딩중···</Text>
      </View>
    );
  }

  return (
    <View style={styles.postsContainer}>
      <FlatList
        data={posts}
        keyExtractor={(post) => post.id.toString()}
        contentContainerStyle={styles.listWrap}
        renderItem={({item}) => (
          <View style={styles.postItem}>
            <Link
              href={{
                pathname: "/(tabs)/posts/[id]/post",
                params: {
                  id: item.id,
                },
              }}
            >
              <Text style={styles.postTitle}>{item.title}</Text>
            </Link>
          </View>
        )}
      />
    </View>
  );
}

const WIDTH = Dimensions.get("window").width;

const styles = StyleSheet.create({
  postsContainer:{
    flex :1,
    alignItems:"center",
  },
  loadingText:{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize:20,
    fontWeight:"bold",
  },
  listWrap:{
    width: WIDTH-16,
    paddingTop:70,
    paddingBottom: 16,
    paddingHorizontal: 6,
  },
  postId:{
    fontSize:16,
    fontWeight:"bold",
  },
  postTitle:{
    fontSize:16,
    marginTop:5,
  },
  postItem:{
    flexDirection:"row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding:16,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset:{
      width:0,
      height:2,
    },
    shadowOpacity:0.25,
    shadowRadius:3.84,
    elevation:5,
    height: 100,
  },
});