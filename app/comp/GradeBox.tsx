import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GradeBox(props: { title: string, score: number, maxPoints: number, date: string, optional: boolean, onPress?: Function }) {
  return (
    <TouchableOpacity onPress={props.onPress ? (e) => props.onPress!(e) : () => {}} className="bg-slate-600 w-96 px-5 py-5 mt-5 rounded-3xl flex-row gap-10 items-center">
      <View className="flex-col content-center flex-1">
        <Text className="text-slate-200 text-2xl">{props.title}</Text>
        <View className="flex-row gap-3">
          <Text className="text-slate-200">{props.date.split('T')[0].replaceAll('-','.')}</Text>
          {props.optional &&  <Text className="text-slate-200">(dodatkowe)</Text>}
        </View>
      </View>
      <Text className="text-slate-200 text-3xl">{props.score.toString()} / {props.maxPoints.toString()}</Text>
    </TouchableOpacity>
  )
}