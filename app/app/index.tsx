import { checkSession, getSessionInfo } from '@/utils/session';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native"

export default function Index() {
    useEffect(() => {
        const a = async () => {
            const sessionInfo = await getSessionInfo();

            if (sessionInfo && await checkSession(sessionInfo)) {
                router.replace('/(main)/dashboard')
                return;
            }
            router.replace('/(entry)/login')
        }
        a();
    })

    return <SafeAreaView className="justify-center items-center h-full bg-slate-400">
        <Text className="text-6xl font-bold text-slate-700">Loading...</Text>
    </SafeAreaView>
}
