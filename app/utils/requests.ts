import { getSessionInfo } from "./session";

export async function getUserInfo(userId: number): Promise<JSON | undefined> {
  const sessionInfo = await getSessionInfo();

  if (!sessionInfo) {
    return undefined;
  }

  const req = await fetch(process.env.EXPO_PUBLIC_API_URL + "/api/v1/info/user/" + userId.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: sessionInfo.userId,
      sessionInfo: sessionInfo.sessionSecret
    }),
  });

  if (!req.ok) {
    return undefined;
  }

  return await req.json();
}

export async function getEventInfo(eventId: number): Promise<JSON | undefined> {
  const sessionInfo = await getSessionInfo();

  if (!sessionInfo) {
    return undefined;
  }

  const req = await fetch(process.env.EXPO_PUBLIC_API_URL + "/api/v1/info/event/" + eventId.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: sessionInfo.userId,
      sessionInfo: sessionInfo.sessionSecret
    }),
  });

  if (!req.ok) {
    return undefined;
  }

  return await req.json();
}

export async function getAllUsersInfo(): Promise<JSON | undefined> {
  const sessionInfo = await getSessionInfo();

  if (!sessionInfo) {
    return undefined;
  }

  const req = await fetch(process.env.EXPO_PUBLIC_API_URL + "/api/v1/info/allUsers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: sessionInfo.userId,
      sessionInfo: sessionInfo.sessionSecret
    }),
  });

  if (!req.ok) {
    return undefined;
  }

  return await req.json();
}

export async function getPatrolInfo(patrolId: number): Promise<JSON | undefined> {
  const sessionInfo = await getSessionInfo();

  if (!sessionInfo) {
    return undefined;
  }

  const req = await fetch(process.env.EXPO_PUBLIC_API_URL + "/api/v1/info/patrol/" + patrolId.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: sessionInfo.userId,
      sessionInfo: sessionInfo.sessionSecret
    }),
  });

  if (!req.ok) {
    return undefined;
  }

  return await req.json();
}

export async function getTroopInfo(troopId: number): Promise<JSON | undefined> {
  const sessionInfo = await getSessionInfo();

  if (!sessionInfo) {
    return undefined;
  }

  const req = await fetch(process.env.EXPO_PUBLIC_API_URL + "/api/v1/info/troop/" + troopId.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: sessionInfo.userId,
      sessionInfo: sessionInfo.sessionSecret
    }),
  });

  if (!req.ok) {
    return undefined;
  }

  return await req.json();
}

export async function getGlobalStats(): Promise<Array<JSON> | undefined> {
  const sessionInfo = await getSessionInfo();

  if (!sessionInfo) {
    return undefined;
  }

  const req = await fetch(process.env.EXPO_PUBLIC_API_URL + "/api/v1/stats/global", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: sessionInfo.userId,
      sessionInfo: sessionInfo.sessionSecret
    }),
  });

  if (!req.ok) {
    return undefined;
  }

  return await req.json();
}

export async function getPatrolsStats(): Promise<Array<JSON> | undefined> {
  const sessionInfo = await getSessionInfo();

  if (!sessionInfo) {
    return undefined;
  }

  const req = await fetch(process.env.EXPO_PUBLIC_API_URL + "/api/v1/stats/patrols", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: sessionInfo.userId,
      sessionInfo: sessionInfo.sessionSecret
    }),
  });

  if (!req.ok) {
    return undefined;
  }

  return await req.json();
}

export async function getInPatrolStats(patrolId: number): Promise<Array<JSON> | undefined> {
  const sessionInfo = await getSessionInfo();

  if (!sessionInfo) {
    return undefined;
  }

  const req = await fetch(process.env.EXPO_PUBLIC_API_URL + "/api/v1/stats/inPatrol/" + patrolId.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: sessionInfo.userId,
      sessionInfo: sessionInfo.sessionSecret
    }),
  });

  if (!req.ok) {
    return undefined;
  }

  return await req.json();
}

export async function deleteTaskTemplate(taskTemplateId: number): Promise<string | undefined> {
  const sessionInfo = await getSessionInfo();

  if (!sessionInfo) {
    return undefined;
  }

  const req = await fetch(process.env.EXPO_PUBLIC_API_URL + "/api/v1/admin/deleteTaskTemplate/" + taskTemplateId.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: sessionInfo.userId,
      sessionInfo: sessionInfo.sessionSecret
    }),
  });

  if (!req.ok) {
    return undefined;
  }

  return await req.text();
}

export async function deletePatrol(patrolId: number): Promise<string | undefined> {
  const sessionInfo = await getSessionInfo();

  if (!sessionInfo) {
    return undefined;
  }

  const req = await fetch(process.env.EXPO_PUBLIC_API_URL + "/api/v1/admin/deletePatrol/" + patrolId.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: sessionInfo.userId,
      sessionInfo: sessionInfo.sessionSecret
    }),
  });

  if (!req.ok) {
    return undefined;
  }

  return await req.text();
}

export async function deleteUser(userId: number): Promise<string | undefined> {
  const sessionInfo = await getSessionInfo();

  if (!sessionInfo) {
    return undefined;
  }

  const req = await fetch(process.env.EXPO_PUBLIC_API_URL + "/api/v1/admin/deleteUser/" + userId.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: sessionInfo.userId,
      sessionInfo: sessionInfo.sessionSecret
    }),
  });

  if (!req.ok) {
    return undefined;
  }

  return await req.text();
}

export async function changePassword(userId: number, newPassword: string): Promise<string | undefined> {
  const sessionInfo = await getSessionInfo();

  if (!sessionInfo) {
    return undefined;
  }

  const req = await fetch(process.env.EXPO_PUBLIC_API_URL + "/api/v1/account/resetPassword", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      newPassword: newPassword,
      targetId: userId,
      userId: sessionInfo.userId,
      sessionInfo: sessionInfo.sessionSecret
    }),
  });

  if (!req.ok) {
    return undefined;
  }

  return await req.text();
}