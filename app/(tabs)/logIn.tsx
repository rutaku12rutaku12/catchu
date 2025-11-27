import { useState } from "react";
import { TextInput } from "react-native";
import { View , Text} from "react-native";

export default function HomeScreen() {

    const [ email, setEmail] = useState("");
    const [ password, setPassword] = useState("");

    
  return (<>
    <View style={{flex:1, justifyContent:"center",alignItems:"center"}}>
      <Text>Home</Text>
    </View>
  </>);
}