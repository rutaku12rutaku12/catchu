import { Dimensions ,StyleSheet, View , Text, FlatList} from "react-native";

export default function HomeScreen() {

  const posts : {id: number; title: string}[] = [
    {id:1, title:"게시글1"},
    {id:2, title:"게시글2"},
    {id:3, title:"게시글3"},
    {id:4, title:"게시글4"},
    {id:5, title:"게시글5"},
    {id:6, title:"게시글6"},
    {id:7, title:"게시글7"},
    {id:8, title:"게시글8"},
    {id:9, title:"게시글9"},
    {id:10, title:"게시글10"},
  ];

  return (<>
    <View style={styles.postsContainer}>
      <FlatList
      data={posts}
      keyExtractor={post => post.id.toString()}
      contentContainerStyle={styles.listWrap}
      renderItem={({item}) => (
        <Text style={styles.postItem}>{item.title}</Text>
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