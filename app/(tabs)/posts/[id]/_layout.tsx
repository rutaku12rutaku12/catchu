import { Stack, useLocalSearchParams } from "expo-router";

export default function PostLayout() {
    const {id}= useLocalSearchParams();

    return<Stack screenOptions={{title: `${id}번 게시글` }} />;
}