import { Text, View, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router, useFocusEffect } from "expo-router";
import { useState, useMemo, useCallback } from "react";
import { getUserInfo, getEventInfo } from "@/utils/requests";
import { getSessionInfo } from "@/utils/session";
import CustomButton from "@/comp/CustomButton"

export default function Dashboard() {
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
        const eventInfoTmp: any = await getEventInfo(userInfoTmp.eventId);
        if (!eventInfoTmp) {
          router.replace('/');
          return;
        }
        setEventInfo(eventInfoTmp);
        setUserPoints(userInfoTmp.scores.reduce((acc: number, score: any) => {return acc + score.score}, 0));
        setMaxPoints(eventInfoTmp.tasks.reduce((acc: number, task: any) => {
          const taskTemplate = eventInfoTmp.taskTemplates.find((taskTemplate: any) => {return taskTemplate.id == task.taskTemplateId});
          return acc + (!taskTemplate.individual || taskTemplate.optional || new Date(task.date) > new Date() ? 0 : taskTemplate.maxPoints);
        }, 0));
      }
      a();
    }, [])
  );

  const [userInfo, setUserInfo] = useState<any>();
  const [eventInfo, setEventInfo] = useState<any>();
  const [userPoints, setUserPoints] = useState<number>(0);
  const [maxPoints, setMaxPoints] = useState<number>(0);
  const percentagePoints = useMemo(() => {
    if (maxPoints == 0) {
      return 100;
    }
    return Math.round((userPoints/maxPoints)*100);
  }, [userPoints, maxPoints]);

  return (
    <SafeAreaView className="flex-1 bg-slate-400 flex-col items-center gap-20">
      <View className="mt-5 flex items-center gap-4">
        {userInfo && <Text className="text-6xl font-bold text-slate-800">Witaj {userInfo.firstName}!</Text>}
        {eventInfo && 
          <View className="flex items-center gap-1">
            <Text className="text-xl font-bold text-slate-700">Wydarzenie: {eventInfo.name}</Text>
            <Text className="text-xl font-bold text-slate-700">{eventInfo.startDate.split('T')[0].replaceAll('-', '.')} - {eventInfo.endDate.split('T')[0].replaceAll('-', '.')}</Text>
          </View>
        }
      </View>
      <View className="bg-slate-700 rounded-3xl p-10 gap-5 items-center min-w-64">
        <Text className="text-7xl text-slate-200">{userPoints}/{maxPoints}</Text>
        <Text className="text-5xl text-slate-200">{percentagePoints}%</Text>
      </View>
      <View className="flex-1 flex-col items-center gap-6">
        <CustomButton text="Moje punkty" className="w-96 items-center py-5 px-10 bg-slate-600 rounded-2xl" textClassName="text-2xl text-slate-200" onPress={() => router.push('/(main)/scores/individual')} />
        <CustomButton text="Punkty mojego zastępu" className="w-96 items-center py-5 px-10 bg-slate-600 rounded-2xl" textClassName="text-2xl text-slate-200" onPress={() => router.push('/(main)/scores/patrol')} />
        <CustomButton text="Statystyki" className="w-96 items-center py-5 px-10 bg-slate-600 rounded-2xl" textClassName="text-2xl text-slate-200" onPress={() => router.push('/(main)/stats')} />
      </View>
    </SafeAreaView>
  );
}
