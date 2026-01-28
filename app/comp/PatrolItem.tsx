import { Text, TouchableOpacity } from "react-native";

export default function PatrolItem(props: { patrol: any, onLongPress?: Function }) {
  return (
    <TouchableOpacity activeOpacity={props.onLongPress ? 0.7 : 1} onLongPress={props.onLongPress ? (e) => props.onLongPress!(e) : () => {}} className={"bg-slate-600 w-96 px-5 py-5 mt-5 flex-row justify-center"} >
        <Text className="text-slate-200">{props.patrol.name}</Text>
    </TouchableOpacity>
  )
}