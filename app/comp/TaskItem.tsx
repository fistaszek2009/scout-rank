import { Text, TouchableOpacity } from "react-native";

export default function TaskItem(props: { task: any, onLongPress?: Function }) {
  return (
    <TouchableOpacity activeOpacity={props.onLongPress ? 0.7 : 1} onLongPress={props.onLongPress ? (e) => props.onLongPress!(e) : () => {}} className={"bg-slate-600 w-96 px-5 py-5 mt-5 flex-row"} style={{justifyContent: "space-between"}}>
        <Text className="text-slate-200">{props.task.id}</Text>
        <Text className="text-slate-200">{props.task.title}</Text>
        <Text className="text-slate-200">{props.task.date.split('T')[0].replaceAll('-','.')}</Text>
        <Text className="text-slate-200">?/{props.task.maxPoints}</Text>
    </TouchableOpacity>
  )
}