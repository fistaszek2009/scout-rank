import { Text, View, TextInput } from "react-native";
import { useState } from "react";
import CustomButton from "@/comp/CustomButton";
import { changePatrolScore } from "@/utils/requests";

export default function PatrolScoreEditItem(props: { patrol: any, score: any, update?: Function }) {
  const [newScore, setNewScore] = useState("");

  return (
    <View className="flex flex-row gap-5">
      <View className={"bg-slate-600 w-96 px-5 py-5 mt-5 flex-row justify-center gap-5"}>
        <Text className="text-slate-200">{props.score.title}</Text>
        <Text className="text-slate-200">{props.score.score}/{props.score.maxPoints}</Text>
        <Text className="text-slate-200">{props.score.date.split('T')[0].replaceAll('-','.')}</Text>
      </View>
      <View className={"bg-slate-600 w-96 px-5 py-5 mt-5 flex-row justify-center"}>
        <TextInput
          placeholder={"0-"+props.score.maxPoints}
          keyboardType="numeric"
          inputMode="numeric"
          onChangeText={setNewScore}
          value={newScore}
        />
        <CustomButton text="Zmień" onPress={() => { changePatrolScore(props.patrol.id, props.score.id, parseInt(newScore)); setNewScore(""); props.update && props.update(); }} />
      </View>
    </View>
  )
}