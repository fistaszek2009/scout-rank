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
      <View className="flex mt-5 items-center gap-4">
        <Text className="text-4xl font-bold text-slate-800">Konto</Text>
        <View>
            <TextInput placeholder="nowe_haslo" onChangeText={setNewPassword} value={newPassword} />
            <CustomButton text="Zmień hasło" onPress={() => { changePassword(userInfo.id, newPassword); setNewPassword("") }} />
        </View>
        <View>
            <CustomButton text="Wyloguj" onPress={() => { clearSessionInfo(); router.replace("/") }} />
        </View>
      </View>
    </SafeAreaView>
  );
}
