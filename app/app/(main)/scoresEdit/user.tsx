import { FlatList, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCallback, useState } from 'react';
import { useFocusEffect, router, useLocalSearchParams } from 'expo-router';
import { getSessionInfo } from '@/utils/session';
import { getEventInfo, getPatrolInfo, getTroopInfo, getUserInfo } from '@/utils/requests';
import UserScoreEditItem from '@/comp/UserScoreEditItem';
import CustomButton from "@/comp/CustomButton"

export default function User() {
  const params: any = useLocalSearchParams();

  const updateValues = async () => {
    const sessionInfo = await getSessionInfo();
    if (!sessionInfo) {
      router.replace('/');
      return;
    }
    const userInfoTmp: any = await getUserInfo(sessionInfo.userId);
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
    const troopInfoTmp = await getTroopInfo(eventInfoTmp.troopId);
    if (!troopInfoTmp) {
      router.replace('/');
      return;
    }
    setTroopInfo(troopInfoTmp);
    const targetInfoTmp: any = await getUserInfo(params.userId);
    if (!targetInfoTmp) {
      router.replace('/');
      return;
    }
    setTargetInfo(targetInfoTmp);
    const tmpTaskScores: any = [];
    eventInfoTmp.tasks.forEach((task: any) => {
      const taskTemplate = eventInfoTmp.taskTemplates.find((x: any) => { return x.id === task.taskTemplateId });
      if (!taskTemplate.individual) {
        return;
      }
      const taskScore = targetInfoTmp.scores.find((x: any) => { return x.taskId === task.id });
      tmpTaskScores.push({
        id: task.id,
        taskTemplateId: taskTemplate.id,
        title: taskTemplate.title,
        maxPoints: taskTemplate.maxPoints,
        score: taskScore?.score ?? 0,
        date: task.date
      })
    });
    setTaskScores(tmpTaskScores);
  }

  useFocusEffect(
    useCallback(() => {
      updateValues();
    }, [])
  );

  const [userInfo, setUserInfo] = useState<any>();
  const [troopInfo, setTroopInfo] = useState<any>();
  const [taskScores, setTaskScores] = useState<any>();
  const [targetInfo, setTargetInfo] = useState<any>();

  return (
    <SafeAreaView className="flex-1 bg-slate-400 flex-col items-center gap-20 p-5">
      <CustomButton text="Powrót" onPress={router.back} />
      {targetInfo && <Text className="text-4xl font-bold mt-5">{targetInfo.firstName} {targetInfo.lastName}</Text>}
      {taskScores && <FlatList
        data={
          taskScores
        }
        renderItem={({ item, index }) => {
          return <UserScoreEditItem user={targetInfo} score={item} update={updateValues} />
        }}
      /> }
    </SafeAreaView>
  );
}