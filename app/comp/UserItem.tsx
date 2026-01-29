import { Text, TouchableOpacity } from "react-native";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function UserItem(props: { user: any, onLongPress?: Function }) {
  return (
    <TouchableOpacity activeOpacity={props.onLongPress ? 0.7 : 1} onLongPress={props.onLongPress ? (e) => props.onLongPress!(e) : () => {}} className={"bg-slate-600 w-96 px-5 py-5 mt-5 flex-row"} style={{justifyContent: "space-between"}}>
        {props.user.leaderOfTroopId && <FontAwesome6 name="crown" size={24} color="gold" />}
        {props.user.assistantOfTroopId && <FontAwesome6 name="crown" size={24} color="green" />}
        <Text className="text-slate-200">{props.user.firstName}</Text>
        <Text className="text-slate-200">{props.user.lastName}</Text>
        <Text className="text-slate-200">
            {props.user.patrolName}
            {props.user.leaderOfPatrolId && <FontAwesome6 name="crown" size={24} color="brown" />}
        </Text>
    </TouchableOpacity>
  )
}