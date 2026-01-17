import { Text, View, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { useState, useEffect } from "react";
import { getUserInfo } from "@/utils/requests";
import { getSessionInfo } from "@/utils/session";
import CustomButton from "@/comp/CustomButton"

export default function Individual() {
  useEffect(() => {
    const a = async () => {
      const sessionInfo = await getSessionInfo();
      if (!sessionInfo) {
        router.replace('/');
        return;
      }
      setUserInfo(await getUserInfo(sessionInfo.userId));
    }
    a();
  }, []);

  const [userInfo, setUserInfo] = useState<any>();

  return (
    <SafeAreaView className="flex-1 bg-slate-400 flex-col items-center gap-20">
      <View>
      {userInfo && <Text className="text-4xl font-bold text-slate-700">Witaj {userInfo.firstName}!</Text>}
      </View>
      <View className="flex-1 flex-col items-center gap-6">
        <CustomButton text="Moje punkty" className="py-5 px-10 bg-slate-600 rounded-2xl" textClassName="text-2xl text-slate-200"/>
        <CustomButton text="Statystyki" className="py-5 px-10 bg-slate-600 rounded-2xl" textClassName="text-2xl text-slate-200"/>
      </View>
    </SafeAreaView>
  );
}
