import { Text, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCallback, useState } from 'react';
import { useFocusEffect, router } from 'expo-router';
import { getSessionInfo } from '@/utils/session';
import { getInPatrolStats, getUserInfo, getTroopInfo, getEventInfo } from '@/utils/requests';
import RankingItem from "@/comp/RankingItem"

export default function Index() {
  useFocusEffect(
    useCallback(() => {
      const a = async () => {
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

        const troopInfoTmp: any = await getTroopInfo(eventInfoTmp.troopId);
        if (!troopInfoTmp) {
          router.replace('/');
          return;
        }

        setPatrols(troopInfoTmp.patrols)

        const patrolId = patrol ?? userInfoTmp.patrolId ?? troopInfoTmp.patrols[0].id;

        const inPatrolStatsTmp = await getInPatrolStats(patrolId);
        if (!inPatrolStatsTmp) {
          router.replace('/');
          return;
        }
        setInPatrolStats(inPatrolStatsTmp.sort((a: any, b: any) => {
          return b.totalScore - a.totalScore;
        }));
        setLoaded(true);
      }
      a();
    }, [])
  );

  const [loaded, setLoaded] = useState(false);
  const [patrol, setPatrol] = useState<any>();
  const [patrols, setPatrols] = useState<any>([]);
  const [userInfo, setUserInfo] = useState<any>();
  const [inPatrolStats, setInPatrolStats] = useState<any>([]);


  return (
    <SafeAreaView className="flex-1 bg-slate-400 flex-col items-center gap-20 p-5">
      {
        loaded && inPatrolStats.length == 0 &&
        <Text className="text-3xl">Narazie nic tu nie ma</Text>
      }
      <FlatList
        className="px-5"
        data={
          inPatrolStats
        }
        renderItem={({ item, index }) => {
          return <RankingItem rank={index+1} name={item.firstName} score={item.totalScore} highlighted={item.id === userInfo.id} />
        }}
      />
    </SafeAreaView>
  );
}