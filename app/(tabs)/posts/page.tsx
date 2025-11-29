import { PostDto} from "@/types/post";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions ,StyleSheet, View , Text, FlatList} from "react-native";

export default function Posts() {

  const [posts, setPosts] = useState<PostDto[]>([]);

useEffect(()=> {
  const fetchPosts = async () => {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts"
    );
    console.log(response);

    const data = await response.json();
    
    console.log(data);

    setPosts(data);
  };
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
            <Text style={styles.postId}>{item.id}번 게시글 </Text>
            <Link
              href={{
                pathname: `/posts/[id]/post`,
                params: {
                  userId: item.userId,
                  id: item.id,
                  title: item.title,
                  body: item.body,
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