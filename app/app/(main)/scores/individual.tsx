import { Text, View, TextInput, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router, useFocusEffect } from "expo-router";
import { useState, useMemo } from "react";
import { getUserInfo, getEventInfo } from "@/utils/requests";
import { getSessionInfo } from "@/utils/session";
import CustomButton from "@/comp/CustomButton"
import GradeBox from "@/comp/GradeBox"

export default function Individual() {
  useFocusEffect(() => {
    const a = async () => {
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
      const eventInfoTmp: any = await getEventInfo(userInfoTmp.eventId);
      if (!eventInfoTmp) {
        router.replace('/');
        return;
      }
      setEventInfo(eventInfoTmp);
      const tasksTmp: any = [];
      eventInfoTmp.tasks.forEach((task: any) => {
        const taskTemplate = eventInfoTmp.taskTemplates.find((template:any) => { return template.id == task.taskTemplateId });
        if (!taskTemplate?.individual || new Date(task.date) > new Date()) {
          return;
        }
        const userScore = userInfoTmp.scores.find((score: any) => { return score.taskId == task.id });
        tasksTmp.push({
          userScoreId: userScore?.id ?? -1,
          taskId: task.id,
          taskTemplateId: taskTemplate.id,
          title: taskTemplate.title,
          score: userScore?.score ?? 0,
          maxPoints: taskTemplate.maxPoints,
          date: task.date
        });
      });
      tasksTmp.sort((x: any, y: any) => { 
        if (new Date(x.date) < new Date(y.date)) {
          return 1;
        } else if (new Date(x.date) > new Date(y.date)) {
          return -1;
        }
        return 0;
      });
      setTasks(tasksTmp);
    }
    a();
  });
  
  const [userInfo, setUserInfo] = useState<any>();
  const [eventInfo, setEventInfo] = useState<any>();
  const [tasks, setTasks] = useState<any>([]);
  
  return (
    <SafeAreaView className="flex-1 bg-slate-400 flex-col items-center gap-20">
      { eventInfo &&
        <FlatList
          className="px-5"
          data={
            tasks
          }
          renderItem={({ item: task }) => {
            return <GradeBox title={task.title} score={task.score} maxPoints={task.maxPoints} date={task.date} optional={task.optional} />
          }}
        />
      }
    </SafeAreaView>
  );
}
