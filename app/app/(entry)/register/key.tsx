import { Link } from 'expo-router'
import { Text, View, TextInput } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterKey() {
  return (
    <SafeAreaView>
      <View className="bg-green-600">
        <TextInput
          editable
          maxLength={50}
          placeholder="Klucz dostępu"
        />
      </View>
      <Link href='/(entry)/login'>Zaloguj się</Link>
      <Link href='/(entry)/register/event'>Dalej</Link>
      
    </SafeAreaView>
  );
}

