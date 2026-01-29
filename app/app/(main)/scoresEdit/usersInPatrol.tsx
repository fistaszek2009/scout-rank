import { FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCallback, useState } from 'react';
import { useFocusEffect, router, useLocalSearchParams } from 'expo-router';
import { getSessionInfo } from '@/utils/session';
import { getEventInfo, getPatrolInfo, getTroopInfo, getUserInfo } from '@/utils/requests';
import UserEditViewItem from '@/comp/UserEditViewItem';
import CustomButton from "@/comp/CustomButton"

export default function UsersInPatrol() {
  const params: any = useLocalSearchParams();

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
        const patrolInfoTmp = await getPatrolInfo(params.patrolId);
        if (!patrolInfoTmp) {
          router.replace('/');
          return;
        }
        setPatrolInfo(patrolInfoTmp);
      }
      a();
    }, [])
  );

  const [userInfo, setUserInfo] = useState<any>();
  const [troopInfo, setTroopInfo] = useState<any>();
  const [patrolInfo, setPatrolInfo] = useState<any>();

  return (
    <SafeAreaView className="flex-1 bg-slate-400 flex-col items-center gap-20 p-5">
      <CustomButton text="Powrót" onPress={router.back} />
      {patrolInfo?.members && <FlatList
        className="px-5"
        data={
          patrolInfo.members
        }
        renderItem={({ item, index }) => {
          return <UserEditViewItem user={item} />
        }}
      /> }
    </SafeAreaView>
  );
}