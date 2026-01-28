import { Text, TouchableOpacity } from "react-native";

export default function TaskTemplateItem(props: { taskTemplate: any, onLongPress?: Function }) {
  return (
    <TouchableOpacity activeOpacity={props.onLongPress ? 0.7 : 1} onLongPress={props.onLongPress ? (e) => props.onLongPress!(e) : () => {}} className={"bg-slate-600 w-96 px-5 py-5 mt-5 flex-row"} style={{justifyContent: "space-between"}}>
        <Text className="text-slate-200">{props.taskTemplate.title}</Text>
        <Text className="text-slate-200">?/{props.taskTemplate.maxPoints}</Text>
    </TouchableOpacity>
  )
}