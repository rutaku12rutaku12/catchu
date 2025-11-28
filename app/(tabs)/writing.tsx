import { useEffect, useState } from "react";
import { Dimensions ,StyleSheet, View , Text, FlatList} from "react-native";

export default function HomeScreen() {

  const [posts, setPosts] = useState<{id: number; title: string}[]> ([]);

//     useEffect(() => {
//       setPosts([
//         {id:1, title:"게시글1"},
//         {id:2, title:"게시글2"},
//         {id:3, title:"게시글3"},
//         {id:4, title:"게시글4"},
//         {id:5, title:"게시글5"},
//         {id:6, title:"게시글6"},
//         {id:7, title:"게시글7"},
//         {id:8, title:"게시글8"},
//         {id:9, title:"게시글9"},
//         {id:10, title:"게시글10"},
//   ]);
// },[]);

useEffect(()=> {
  const fetchPosts = async () => {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts"
    );
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
      keyExtractor={post => post.id.toString()}
      contentContainerStyle={styles.listWrap}
      renderItem={({item}) => (
        <View style={styles.postItem}>
          <Text style={styles.postId}>{item.id}번 게시글</Text>
          <Text style={styles.postTitle}>{item.title}</Text>
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