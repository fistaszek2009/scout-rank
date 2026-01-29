import { FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCallback, useState } from 'react';
import { useFocusEffect, router } from 'expo-router';
import { getSessionInfo } from '@/utils/session';
import { getEventInfo, getTroopInfo, getUserInfo } from '@/utils/requests';
import PatrolEditViewItem from '@/comp/PatrolEditViewItem';

export default function Patrols() {
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
        const troopInfoTmp = await getTroopInfo(eventInfoTmp.troopId);
        if (!troopInfoTmp) {
          router.replace('/');
          return;
        }
        setTroopInfo(troopInfoTmp);
      }
      a();
    }, [])
  );

  const [userInfo, setUserInfo] = useState<any>();
  const [troopInfo, setTroopInfo] = useState<any>();

  return (
    <SafeAreaView className="flex-1 bg-slate-400 flex-col items-center gap-20 p-5">
      {troopInfo?.patrols && <FlatList
        className="px-5"
        data={
          troopInfo.patrols
        }
        renderItem={({ item, index }) => {
          return <PatrolEditViewItem patrol={item} />
        }}
      /> }
    </SafeAreaView>
  );
}