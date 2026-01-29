import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import { getUserInfo, getEventInfo, getTroopInfo } from "@/utils/requests";
import { getSessionInfo } from "@/utils/session";
import CustomButton from "@/comp/CustomButton"
import { useFormValidation } from "@/utils/useFormValidation";
import { Picker } from '@react-native-picker/picker';
import DateInput from "@/comp/DateInput";

export default function AddTask() {
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
    const troopInfoTmp: any = await getTroopInfo(eventInfoTmp.troopId);
    if (!troopInfoTmp) {
      router.replace('/');
      return;
    }
    setTroopInfo(troopInfoTmp);
    if (values.taskTemplateId === "") {
      handleFieldChange(eventInfoTmp.taskTemplates[0].id.toString(), "taskTemplateId");
    }
  }

  useFocusEffect(
    useCallback(() => {
      updateData();
    }, [])
  );

  const [sessionInfo, setSessionInfo] = useState<any>();
  const [userInfo, setUserInfo] = useState<any>();
  const [eventInfo, setEventInfo] = useState<any>();
  const [troopInfo, setTroopInfo] = useState<any>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { values, errors, handleFieldChange, validateAll, setApiError } = useFormValidation(
    {
      taskTemplateId: "",
      date: (new Date()).toString()
    },
    {
      taskTemplateId: () => undefined,
      date: () => undefined
    }
  );

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const url = process.env.EXPO_PUBLIC_API_URL + "/api/v1/admin/createTask";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskTemplateId: parseInt(values.taskTemplateId),
          taskDate: values.date,
          userId: sessionInfo.userId,
          sessionSecret: sessionInfo.sessionSecret
        }),
      });

      if (!response.ok) {
        const data = await response.text();
        const errorMessage = typeof data === "string" ? data : "Wystąpił błąd przy próbie utworzenia zadania";
        setApiError(errorMessage);
        return;
      }

      const data = await response.json();

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
            Dodaj zadanie
        </Text>
        <View className="gap-3">
          <View className={`overflow-hidden ${errors.api ? "h-auto" : "h-0"}`}>
            <View className="bg-red-200 border border-red-400 rounded p-3 mb-3">
              <Text className="text-red-800 text-sm">{errors.api}</Text>
            </View>
          </View>

          {eventInfo && <Picker onValueChange={(itemValue: string, itemIndex: number) => handleFieldChange(itemValue, "taskTemplateId")} >
              {eventInfo.taskTemplates.map((taskTemplate: any) => {
                return <Picker.Item label={taskTemplate.title} value={taskTemplate.id.toString()} key={taskTemplate.id} />
              })}
          </Picker>}
        </View>

        <View>
          <Text className="mb-1 text-sm text-slate-700">Data zakończenia</Text>
          <DateInput value={new Date(values.date)} onChange={(value: string) => handleFieldChange(value.toString(), "date")} />
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
