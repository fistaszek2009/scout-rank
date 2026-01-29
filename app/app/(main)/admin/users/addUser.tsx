import { Text, View, TextInput, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import { getUserInfo, getEventInfo, getTroopInfo } from "@/utils/requests";
import { getSessionInfo } from "@/utils/session";
import CustomButton from "@/comp/CustomButton"
import { useFormValidation } from "@/utils/useFormValidation";
import { Checkbox } from 'expo-checkbox';
import { Picker } from '@react-native-picker/picker';

export default function AddUser() {
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
    if (values.patrolId === "") {
      handleFieldChange(troopInfoTmp.patrols[0].id, "patrolId");
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
  const [isAssistant, setIsAssistant] = useState(false);
  const [isPatrolLeader, setIsPatrolLeader] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const { values, errors, handleFieldChange, validateAll, setApiError } = useFormValidation(
    {
      firstName: "",
      lastName: "",
      patrolId: ""
    },
    {
      firstName: () => undefined,
      lastName: () => undefined,
      patrolId: () => undefined
    }
  );

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const url = process.env.EXPO_PUBLIC_API_URL + "/api/v1/admin/createUser";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          isAssistantOfTroop: isAssistant,
          isLeaderOfPatrol: isPatrolLeader,
          patrolId: parseInt(values.patrolId),
          userId: sessionInfo.userId,
          sessionSecret: sessionInfo.sessionSecret
        }),
      });

      if (!response.ok) {
        const data = await response.text();
        const errorMessage = typeof data === "string" ? data : "Wystąpił błąd przy próbie utworzenia użytkownika";
        setApiError(errorMessage);
        return;
      }

      const data = await response.json();
      setPassword(data.newPassword);

      setModalVisible(true);
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
            Dodaj użytkownika
        </Text>
        <View className="gap-3">
          <View className={`overflow-hidden ${errors.api ? "h-auto" : "h-0"}`}>
            <View className="bg-red-200 border border-red-400 rounded p-3 mb-3">
              <Text className="text-red-800 text-sm">{errors.api}</Text>
            </View>
          </View>

          <View>
            <Text className="mb-1 text-sm text-slate-700">Imię</Text>
            <TextInput
              value={values.firstName}
              onChangeText={(text) => handleFieldChange(text, "firstName")}
              placeholder="Jan"
              autoCapitalize="words"
              className={`bg-white p-3 rounded border-2 ${errors.firstName ? " border-red-500" : "border-white"}`}
            />
            <View className="h-5">
              {errors.firstName && (
                <Text className="text-red-500 text-xs mt-1">{errors.firstName}</Text>
              )}
            </View>
          </View>

          <View>
            <Text className="mb-1 text-sm text-slate-700">Nazwisko</Text>
            <TextInput
              value={values.lastName}
              onChangeText={(text) => handleFieldChange(text, "lastName")}
              placeholder="Kowalski"
              autoCapitalize="words"
              className={`bg-white p-3 rounded border-2 ${errors.lastName ? " border-red-500" : "border-white"}`}
            />
            <View className="h-5">
              {errors.lastName && (
                <Text className="text-red-500 text-xs mt-1">{errors.lastName}</Text>
              )}
            </View>
          </View>

          <View>
            <Text className="mb-1 text-sm text-slate-700">Czy jest przybocznym:</Text>
            <Checkbox value={isAssistant} onValueChange={setIsAssistant} />
          </View>

          { troopInfo && !isAssistant && <Picker onValueChange={(itemValue: string, itemIndex: number) => handleFieldChange(itemValue, "patrolId")} >
              {troopInfo.patrols.map((patrol: any) => {
                return <Picker.Item label={patrol.name} value={patrol.id.toString()} key={patrol.id} />
              })}
          </Picker> }

          { !isAssistant && <View>
            <Text className="mb-1 text-sm text-slate-700">Czy jest liderem zastępu:</Text>
            <Checkbox value={isPatrolLeader} onValueChange={setIsPatrolLeader} />
          </View> }
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View className="flex-1 justify-center items-center">
          <View className="bg-slate-600 flex gap-3 p-5 rounded-3xl">
            <Text className="text-slate-200 text-3xl">Hasło: {password}</Text>
            <CustomButton text="Gotowe" className="bg-slate-700 rounded-3xl p-3" textClassName="text-slate-200 text-2xl text-center" onPress={() => { setPassword(""); setModalVisible(false); router.back(); }}/>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
