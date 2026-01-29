import { Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

export default function PatrolEditViewItem(props: { patrol: any }) {
  return (
    <View className="flex flex-row gap-5">
      <TouchableOpacity onPress={() => router.push({pathname: '/(main)/scoresEdit/patrol', params: { patrolId: props.patrol.id }})} className={"bg-slate-600 w-96 px-5 py-5 mt-5 flex-row justify-center"}>
        <Text className="text-slate-200">{props.patrol.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push({pathname: '/(main)/scoresEdit/usersInPatrol', params: { patrolId: props.patrol.id }})} className={"bg-slate-600 w-96 px-5 py-5 mt-5 flex-row justify-center"}>
        <Text className="text-slate-200 text-center">Użytkownicy w zastępie</Text>
      </TouchableOpacity>
    </View>
  )
}