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