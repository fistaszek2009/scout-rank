import { Text, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCallback, useState } from 'react';
import { useFocusEffect, router } from 'expo-router';
import { getSessionInfo } from '@/utils/session';
import { getGlobalStats } from '@/utils/requests';
import RankingItem from "@/comp/RankingItem"

export default function Global() {
  useFocusEffect(
    useCallback(() => {
      const a = async () => {
        const sessionInfoTmp = await getSessionInfo();
        if (!sessionInfoTmp) {
          router.replace('/');
          return;
        }
        setSessionInfo(sessionInfoTmp)
        const globalStatsTmp = await getGlobalStats();
        if (!globalStatsTmp) {
          router.replace('/');
          return;
        }
        setGlobalStats(globalStatsTmp.sort((a: any, b: any) => {
          return b.totalScore - a.totalScore;
        }));
        setLoaded(true);
      }
      a();
    }, [])
  );

  const [loaded, setLoaded] = useState(false);
  const [globalStats, setGlobalStats] = useState<any>([]);
  const [sessionInfo, setSessionInfo] = useState<any>();


  return (
    <SafeAreaView className="flex-1 bg-slate-400 flex-col items-center gap-20 p-5">
      {
        loaded && globalStats.length == 0 &&
        <Text className="text-3xl">Narazie nic tu nie ma</Text>
      }
      <FlatList
        className="px-5"
        data={
          globalStats
        }
        renderItem={({ item, index }) => {
          return <RankingItem rank={index+1} name={item.firstName + " | " + item.patrolName} score={item.totalScore} highlighted={item.id === sessionInfo.userId} />
        }}
      />
    </SafeAreaView>
  );
}