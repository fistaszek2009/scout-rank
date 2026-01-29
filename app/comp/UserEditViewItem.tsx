import { Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

export default function UserEditViewItem(props: { user: any }) {
  return (
    <View className="flex flex-row gap-5">
      <TouchableOpacity onPress={() => router.push({pathname: '/(main)/scoresEdit/user', params: { userId: props.user.id }})} className={"bg-slate-600 w-96 px-5 py-5 mt-5 flex-row justify-center"}>
        <Text className="text-slate-200">{props.user.firstName}</Text>
      </TouchableOpacity>
    </View>
  )
}