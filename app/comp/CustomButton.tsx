import { Platform, TouchableOpacity, Text, View } from "react-native";

export default function Button(props: { className?: string, textClassName?: string, text?: string, onPress?: Function, disabled?: boolean }) {

  return (
    <TouchableOpacity
      onPress={props.onPress ? (e) => props.onPress!(e) : () => {}}
      disabled={props.disabled ?? false}
      className={props.className ?? ""}
    >
      <Text className={props.textClassName ?? ""}>
        {props.text}
      </Text>
    </TouchableOpacity>
  )
}