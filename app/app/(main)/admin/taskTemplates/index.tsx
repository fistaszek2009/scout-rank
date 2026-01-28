import { Text, View, FlatList, Modal, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import { getUserInfo, getEventInfo, deleteTaskTemplate } from "@/utils/requests";
import { getSessionInfo } from "@/utils/session";
import CustomButton from "@/comp/CustomButton"
import TaskTemplateItem from "@/comp/TaskTemplateItem";

export default function TaskTemplates() {
  const updateData = async () => {
    const sessionInfo = await getSessionInfo();
    if (!sessionInfo) {
      router.replace('/');
      return;
    }
    const userInfoTmp: any = await getUserInfo(sessionInfo.userId)
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

  const deleteTaskTemplateProc = async () => {
    await deleteTaskTemplate(toDeleteIdx);
    updateData();
  }

  const [userInfo, setUserInfo] = useState<any>();
  const [eventInfo, setEventInfo] = useState<any>();
  const [modalVisible, setModalVisible] = useState(false);
  const [toDeleteIdx, setToDeleteIdx] = useState(-1);

  return (
    <SafeAreaView className="flex-1 bg-slate-400 flex-col items-center gap-5">
      <CustomButton text="Dodaj schemat zadania" className="w-96 items-center mt-5 py-5 px-10 bg-slate-600 rounded-2xl" textClassName="text-2xl text-slate-200" onPress={() => router.push('/(main)/admin/taskTemplates/addTaskTemplate')} />
      <FlatList data={eventInfo?.taskTemplates} renderItem={({ item }) => {
        return <TaskTemplateItem onLongPress={() => { setToDeleteIdx(item.id); setModalVisible(true) }} taskTemplate={item} />
      }}/>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View className="flex-1 justify-center items-center">
          <View className="bg-slate-600 flex gap-3 p-5 rounded-3xl">
            <Text className="text-slate-200 text-3xl">Czy jesteś pewny?</Text>
            <TouchableOpacity
              className="bg-slate-700 rounded-3xl p-3"
              onPress={() => { deleteTaskTemplateProc(); setModalVisible(!modalVisible) }}>
              <Text className="text-slate-200 text-2xl text-center">Usuń</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-slate-700 rounded-3xl p-3"
              onPress={() => setModalVisible(!modalVisible)}>
              <Text className="text-slate-200 text-2xl text-center">Anuluj</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
