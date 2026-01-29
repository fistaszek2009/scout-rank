import { Text, View, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import { changePassword, getUserInfo } from "@/utils/requests";
import { clearSessionInfo, getSessionInfo } from "@/utils/session";
import CustomButton from "@/comp/CustomButton"

export default function Account() {
  useFocusEffect(
    useCallback(() => {
      const a = async () => {
        const sessionInfo = await getSessionInfo();
        if (!sessionInfo) {
          router.replace('/');
          return;
        }
        const userInfoTmp: any = await getUserInfo(sessionInfo.userId)
        if (!userInfoTmp) {
          router.replace('/');
          return;
        }
        setUserInfo(userInfoTmp);
      }
      a();
    }, [])
  );

  const [userInfo, setUserInfo] = useState<any>();
  const [newPassword, setNewPassword] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-slate-400 flex-col items-center gap-20">
      <View className="flex mt-5 items-center gap-6">
        <Text className="text-4xl font-bold text-slate-800">Konto</Text>
        <View className="items-center gap-3">
            <Text className="text-xl font-bold text-slate-800 w-full">Zmiana hasła</Text>
            <TextInput placeholder="Nowe hasło" className="bg-white p-3 rounded border-2 border-white" onChangeText={setNewPassword} value={newPassword} />
            <CustomButton text="Zmień hasło" className="bg-slate-700 px-4 py-2 rounded " textClassName="text-white text-center" onPress={() => { changePassword(userInfo.id, newPassword); setNewPassword("") }} />
        </View>
        
        <View className="items-center gap-3 w-full">
            <Text className="text-xl font-bold text-slate-800 w-full">Wylogowanie</Text>
            <CustomButton text="Wyloguj" className="bg-slate-700 px-4 py-2 rounded" textClassName="text-white" onPress={() => { clearSessionInfo(); router.replace("/") }} />
        </View>
      </View>
    </SafeAreaView>
  );
}
