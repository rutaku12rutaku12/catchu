import { PostDto} from "@/types/post";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions ,StyleSheet, View , Text, FlatList} from "react-native";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase/config";

export default function Posts() {

  const [posts, setPosts] = useState<PostDto[] | null>(null);

  const fetchPosts = async () => {
    try{
      const postsQuery = query(
        collection(db, "post"), // post 테이블을 조회
        orderBy("postId","desc")
    ); 

      // getDocs : firestore에서 데이터를 가져오는 함수
      const postsSnapshot = await getDocs(postsQuery);

      const postsData = postsSnapshot.docs.map((doc) => {
        const {postId,createDate,title,content} = doc.data();
        return{
          id: doc.id, // 파이어베이스 문서 ID
          postId: postId,
          createDate : createDate,
          title: title,
          content:content,
        }
      })
      setPosts(postsData);
    }catch(error){
      console.log(error);
    }
  };

useEffect(()=> {
  fetchPosts();
}, []);

  return (<>
    <View style={styles.postsContainer}>
      <FlatList
        data={posts}
        keyExtractor={(post) => post.id.toString()}
        contentContainerStyle={styles.listWrap}
        renderItem={({item}) => (
          <View style={styles.postItem}>
            <Text style={styles.postId}>{item.postId}번 게시글 </Text>
            <Link
              href={{
                pathname: `/posts/[id]/post`,
                params: {
                  postId: item.postId,
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
  </>);
}

const WIDTH = Dimensions.get("window").width;

const styles = StyleSheet.create({
  postsContainer:{
    flex :1,
    alignItems:"center",
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
    marginTop:5,},
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