import { Text, TouchableOpacity } from "react-native";

export default function RankingItem(props: { name: string, score: number, onPress?: Function, rank: number, highlighted?: boolean }) {
  return (
    <TouchableOpacity activeOpacity={props.onPress ? 0.7 : 1} onPress={props.onPress ? (e) => props.onPress!(e) : () => {}} className={(props.highlighted ? "bg-slate-700" : "bg-slate-600") + " w-96 px-5 py-5 mt-5 flex-row"} style={{justifyContent: "space-between"}}>
        <Text className="text-slate-200">{props.rank}</Text>
        <Text className="text-slate-200">{props.name}</Text>
        <Text className="text-slate-200">{props.score}</Text>
    </TouchableOpacity>
  )
}