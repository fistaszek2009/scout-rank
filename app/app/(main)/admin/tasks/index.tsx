import { Text, View, FlatList, Modal, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import { getUserInfo, getEventInfo, deleteTask } from "@/utils/requests";
import { getSessionInfo } from "@/utils/session";
import CustomButton from "@/comp/CustomButton"
import TaskItem from "@/comp/TaskItem";

export default function Tasks() {
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
    const tasksTmp = eventInfoTmp.tasks.map((task: any) => {
      const taskTemplate = eventInfoTmp.taskTemplates.find((taskTemplate: any) => { return taskTemplate.id === task.taskTemplateId });
      return {
        id: task.id,
        date: task.date,
        taskTemplateId: taskTemplate.id,
        title: taskTemplate.title,
        description: taskTemplate.description,
        maxPoints: taskTemplate.maxPoints,
        optional: taskTemplate.optional,
        individual: taskTemplate.individual
      }
    });
    setTasks(tasksTmp);
  }

  useFocusEffect(
    useCallback(() => {
      updateData();
    }, [])
  );

  const deleteTaskProc = async () => {
    await deleteTask(toDeleteIdx);
    updateData();
  }

  const [userInfo, setUserInfo] = useState<any>();
  const [eventInfo, setEventInfo] = useState<any>();
  const [modalVisible, setModalVisible] = useState(false);
  const [toDeleteIdx, setToDeleteIdx] = useState(-1);
  const [tasks, setTasks] = useState<any>();

  return (
    <SafeAreaView className="flex-1 bg-slate-400 flex-col items-center gap-5">
      <CustomButton text="Dodaj zadanie" className="w-96 items-center mt-5 py-5 px-10 bg-slate-600 rounded-2xl" textClassName="text-2xl text-slate-200" onPress={() => router.push('/(main)/admin/tasks/addTask')} />
      <FlatList data={tasks} renderItem={({ item }) => {
        return <TaskItem onLongPress={() => { setToDeleteIdx(item.id); setModalVisible(true) }} task={item} />
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
              onPress={() => { deleteTaskProc(); setModalVisible(!modalVisible) }}>
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
