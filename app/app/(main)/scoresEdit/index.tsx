import { checkSession, getSessionInfo } from '@/utils/session';
import { useFocusEffect, router } from 'expo-router';
import { useCallback, useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native"
import { getUserInfo } from '@/utils/requests';

export default function Index() {
    useFocusEffect(
        useCallback(() => {
            const a = async () => {
                const sessionInfo = await getSessionInfo();
                if (!sessionInfo) {
                    router.replace('/');
                    return;
                }
                const userInfo: any = await getUserInfo(sessionInfo.userId);
                if (!userInfo) {
                    router.replace('/');
                    return;
                }
                console.log(userInfo);
                if (userInfo.leaderOfTroopId || userInfo.assistantOfTroopId) {
                    router.replace('/(main)/scoresEdit/patrols');
                } else if (userInfo.leaderOfPatrolId) {
                    router.replace({ pathname: '/(main)/scoresEdit/patrol', params: { patrolId: userInfo.leaderOfPatrolId } });
                } else {
                    router.replace('/');
                }
            }
            a();
        }, [])
    );

    return <SafeAreaView className="justify-center items-center h-full bg-slate-400">
        <Text className="text-6xl font-bold text-slate-700">Loading...</Text>
    </SafeAreaView>
}
