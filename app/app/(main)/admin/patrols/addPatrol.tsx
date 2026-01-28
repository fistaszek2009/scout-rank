import { Text, View, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import { getUserInfo, getEventInfo } from "@/utils/requests";
import { getSessionInfo } from "@/utils/session";
import CustomButton from "@/comp/CustomButton"
import { useFormValidation } from "@/utils/useFormValidation";

export default function AddPatrol() {
  const updateData = async () => {
    const sessionInfoTmp = await getSessionInfo();
    if (!sessionInfoTmp) {
      router.replace('/');
      return;
    }
    setSessionInfo(sessionInfoTmp);
    const userInfoTmp: any = await getUserInfo(sessionInfoTmp.userId)
    if (!userInfoTmp || !(userInfoTmp.leaderOfTroopId || userInfoTmp.assistantOfTroopId)) {
      router.replace('/');
      return;
    }
    setUserInfo(userInfoTmp);
    const eventInfoTmp: any = await getEventInfo(userInfoTmp.eventId);
    if (!eventInfoTmp) {
      router.replace('/');
      return;
    }
    setEventInfo(eventInfoTmp);
  }

  useFocusEffect(
    useCallback(() => {
      updateData();
    }, [])
  );

  const [sessionInfo, setSessionInfo] = useState<any>();
  const [userInfo, setUserInfo] = useState<any>();
  const [eventInfo, setEventInfo] = useState<any>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { values, errors, handleFieldChange, validateAll, setApiError } = useFormValidation(
    {
      name: "",
    },
    {
      title: () => undefined,
    }
  );

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const register_url = process.env.EXPO_PUBLIC_API_URL + "/api/v1/admin/createPatrol";
      const register_response = await fetch(register_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          userId: sessionInfo.userId,
          sessionSecret: sessionInfo.sessionSecret
        }),
      });

      if (!register_response.ok) {
        const data = await register_response.text();
        const errorMessage = typeof data === "string" ? data : "Wystąpił błąd przy próbie utworzenia zastępu";
        setApiError(errorMessage);
        return;
      }

      router.back();
    } catch (error) {
      setApiError("Błąd sieci. Sprawdź połączenie.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-400 flex-col items-center gap-5">
      <View className="w-full max-w-lg gap-4 mt-3">
        <Text className="text-4xl font-bold text-slate-700 text-center">
            Dodaj zastęp
        </Text>
        <View className="gap-3">
          <View className={`overflow-hidden ${errors.api ? "h-auto" : "h-0"}`}>
            <View className="bg-red-200 border border-red-400 rounded p-3 mb-3">
              <Text className="text-red-800 text-sm">{errors.api}</Text>
            </View>
          </View>

          <View>
            <Text className="mb-1 text-sm text-slate-700">Nazwa zastępu</Text>
            <TextInput
              value={values.name}
              onChangeText={(text) => handleFieldChange(text, "name")}
              className={`bg-white p-3 rounded border-2 ${errors.name ? " border-red-500" : "border-white"}`}
            />
            <View className="h-5">
              {errors.name && (
                <Text className="text-red-500 text-xs mt-1">{errors.name}</Text>
              )}
            </View>
          </View>
        </View>

        <View className="flex-row justify-center gap-4">
          <CustomButton
            onPress={() => { router.back() }}
            className="px-4 py-2 rounded"
            textClassName="text-slate-700 underline"
            text="Anuluj"
          />

          <CustomButton
            disabled={isSubmitting}
            onPress={handleSubmit}
            className="bg-slate-700 px-4 py-2 rounded"
            textClassName="text-white font-semibold"
            text={isSubmitting ? "Dodawanie..." : "Dodaj"}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
