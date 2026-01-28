import { Text, View, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import { getUserInfo, getEventInfo } from "@/utils/requests";
import { getSessionInfo } from "@/utils/session";
import CustomButton from "@/comp/CustomButton"
import { useFormValidation } from "@/utils/useFormValidation";
import { Checkbox } from 'expo-checkbox';

export default function AddTaskTemplate() {
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
  const [isOptional, setIsOptional] = useState(false);
  const [isIndividual, setIsIndividual] = useState(true);
  const { values, errors, handleFieldChange, validateAll, setApiError } = useFormValidation(
    {
      title: "",
      description: "",
      maxPoints: "",
    },
    {
      title: () => undefined,
      description: () => undefined,
      maxPoints: () => undefined,
    }
  );

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const register_url = process.env.EXPO_PUBLIC_API_URL + "/api/v1/admin/createTaskTemplate";
      const register_response = await fetch(register_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          maxPoints: parseInt(values.maxPoints),
          isOptional: isOptional,
          isIndividual: isIndividual,
          userId: sessionInfo.userId,
          sessionSecret: sessionInfo.sessionSecret
        }),
      });

      if (!register_response.ok) {
        const data = await register_response.text();
        const errorMessage = typeof data === "string" ? data : "Wystąpił błąd przy próbie utworzenia schematu zadania";
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
            Dodaj schemat zadania
        </Text>
        <View className="gap-3">
          <View className={`overflow-hidden ${errors.api ? "h-auto" : "h-0"}`}>
            <View className="bg-red-200 border border-red-400 rounded p-3 mb-3">
              <Text className="text-red-800 text-sm">{errors.api}</Text>
            </View>
          </View>

          <View>
            <Text className="mb-1 text-sm text-slate-700">Tytuł zadania</Text>
            <TextInput
              value={values.title}
              onChangeText={(text) => handleFieldChange(text, "title")}
              placeholder="Porządek"
              autoCapitalize="words"
              className={`bg-white p-3 rounded border-2 ${errors.title ? " border-red-500" : "border-white"}`}
            />
            <View className="h-5">
              {errors.title && (
                <Text className="text-red-500 text-xs mt-1">{errors.title}</Text>
              )}
            </View>
          </View>

          <View>
            <Text className="mb-1 text-sm text-slate-700">Opis</Text>
            <TextInput
              multiline
              numberOfLines={4}
              value={values.description}
              onChangeText={(text) => handleFieldChange(text, "description")}
              placeholder="Stan porządku w namiotach."
              autoCapitalize="sentences"
              className={`bg-white p-3 rounded border-2 ${errors.description ? " border-red-500" : "border-white"}`}
            />
            <View className="h-5">
                {errors.description && (
                  <Text className="text-red-500 text-xs mt-1">{errors.description}</Text>
                )}
            </View>
          </View>

          <View>
            <Text className="mb-1 text-sm text-slate-700">Maksymalna ilość punktów</Text>
            <TextInput
              value={values.maxPoints}
              onChangeText={(text) => handleFieldChange(text, "maxPoints")}
              placeholder="10"
              keyboardType="numeric"
              inputMode="numeric"
              className={`bg-white p-3 rounded border-2 ${errors.maxPoints ? " border-red-500" : "border-white"}`}
            />
            <View className="h-5">
              {errors.maxPoints && (
                <Text className="text-red-500 text-xs mt-1">{errors.maxPoints}</Text>
              )}
            </View>
          </View>

          <View>
            <Text className="mb-1 text-sm text-slate-700">Opcjonalne:</Text>
            <Checkbox value={isOptional} onValueChange={setIsOptional} />
          </View>

          <View>
            <Text className="mb-1 text-sm text-slate-700">Indywidualne:</Text>
            <Checkbox value={isIndividual} onValueChange={setIsIndividual} />
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
