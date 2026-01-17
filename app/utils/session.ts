import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

type SessionInfo = {
  userId: number,
  sessionSecret: string
}

async function setSessionInfo(sessionInfo: SessionInfo) {
  if (Platform.OS === 'web') {
    if (await AsyncStorage.getItem('sessionInfo')) {
      await clearSessionInfo();
    }
    await AsyncStorage.setItem('sessionInfo', JSON.stringify(sessionInfo));
  } else {
    if (await SecureStore.getItemAsync('sessionInfo')) {
      await clearSessionInfo();
    }
    await SecureStore.setItemAsync('sessionInfo', JSON.stringify(sessionInfo));
  }
}

async function getSessionInfo() : Promise<SessionInfo | undefined> {
  let dataStr;
  if (Platform.OS === 'web') {
    dataStr = await AsyncStorage.getItem('sessionInfo');
  } else {
    dataStr = await SecureStore.getItemAsync('sessionInfo');
  }
  if (!dataStr) {
    return undefined;
  }
  
  const data = JSON.parse(dataStr);
  
  const sessionInfo: SessionInfo = {
    userId: data.userId,
    sessionSecret: data.sessionSecret
  }
  
  if (!await checkSession(sessionInfo)) {
    await clearSessionInfo();
    return undefined;
  }
  
  return sessionInfo;
}

async function clearSessionInfo() {
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem('sessionInfo');
  } else {
    await SecureStore.deleteItemAsync('sessionInfo');
  }
}

async function checkSession(sessionInfo: SessionInfo) : Promise<boolean> {
  const login_url = process.env.EXPO_PUBLIC_API_URL + "/api/v1/verifySession";
  const login_response = await fetch(login_url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sessionInfo),
  });
  
  if (!login_response.ok) {
    return false;
  }

  return true;
}

export { setSessionInfo, checkSession, getSessionInfo, clearSessionInfo }