import { Platform, TouchableOpacity, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";

export default function DateInput(props: { value: Date, onChange: Function }) {
  const [show, setShow] = useState(false);

  const onDateChange = (event: Event, newDate: Date) => {
    setShow(false);
    if (newDate) {
      props.onChange(newDate);
    }
  };

  if (Platform.OS === "web") {
    return (
      <input
        type="date"
        value={props.value.toISOString().split("T")[0]}
        onChange={(e) => props.onChange(new Date(e.target.value))}
      />
    );
  }

  return (
    <View>
      <TouchableOpacity onPress={() => setShow(true)}>
        <Text>{props.value.toDateString()}</Text>
      </TouchableOpacity>
      
      {show && (
        <DateTimePicker
          value={props.value}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
        />
      )}
    </View>
  );
}