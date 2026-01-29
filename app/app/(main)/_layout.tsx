import { router } from 'expo-router'
import { Drawer } from 'expo-router/drawer'
import { useEffect, useMemo, useState } from "react";
import { getSessionInfo } from "@/utils/session";
import { getUserInfo } from "@/utils/requests";

export default function MainLayout() {
  const updateData = async () => {
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
    setLoaded(true);
  }

  useEffect(() => {
    updateData();
  }, []);

  const [userInfo, setUserInfo] = useState<any>();
  const [loaded, setLoaded] = useState(false);
  const isAdmin = useMemo(() => (userInfo && (userInfo.leaderOfTroopId || userInfo.assistantOfTroopId)), [userInfo]);
  
  if (!loaded) {
    return null;
  }

  return <Drawer>
    <Drawer.Screen
      name="dashboard"
      options={{
        drawerLabel: 'Strona Główna',
        title: 'Strona Główna'
      }}
    />
    <Drawer.Screen
      name="scores/individual"
      options={{
        drawerLabel: 'Moje punkty',
        title: 'Moje punkty',
        drawerItemStyle: {display: (isAdmin ? 'none' : 'flex')}
      }}
    />
    <Drawer.Screen
      name="scores/patrol"
      options={{
        drawerLabel: 'Punkty zastępu',
        title: 'Punkty zastępu',
        drawerItemStyle: {display: (isAdmin ? 'none' : 'flex')}
      }}
    />
    <Drawer.Screen
      name="stats"
      options={{
        drawerLabel: 'Statystyki',
        title: 'Statystyki'
      }}
    />
    <Drawer.Screen
      name="admin/taskTemplates"
      options={{
        drawerLabel: 'Schematy zadań',
        title: 'Schematy zadań',
        drawerItemStyle: {display: (isAdmin ? 'flex' : 'none')}
      }}
    />
    <Drawer.Screen
      name="admin/patrols"
      options={{
        drawerLabel: 'Zastępy',
        title: 'Zastępy',
        drawerItemStyle: {display: (isAdmin ? 'flex' : 'none')}
      }}
    />
    <Drawer.Screen
      name="admin/users"
      options={{
        drawerLabel: 'Użytkownicy',
        title: 'Użytkownicy',
        drawerItemStyle: {display: (isAdmin ? 'flex' : 'none')}
      }}
    />
    <Drawer.Screen
      name="account"
      options={{
        drawerLabel: 'Konto',
        title: 'Konto'
      }}
    />
  </Drawer>
}
