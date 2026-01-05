import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      className="bg-yellow-600"
    >
      <Text className="font-bold text-3xl text-red-900 text-center">Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
