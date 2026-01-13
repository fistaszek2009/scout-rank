import { Text, View, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { useState } from "react";
import { useFormValidation } from "../useFormValidation";
import DateTimePicker from "@react-native-community/datetimepicker";
import { validateName } from "../validators";

export const validateDate = (name: string): string | undefined => {
  if (!name) return "To pole jest wymagane";
  if (name.length > 100) return "Maksymalnie 100 znaków";
  return undefined;
};

export default function RegisterEvent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [datePickerMode, setDatePickerMode] = useState<"start" | "end" | null>(null);

  const { values, errors, handleFieldChange, validateAll, setApiError } =
    useFormValidation(
      { eventName: "", troopName: "" },
      { eventName: validateName, troopName: validateName }
    );

  const handleDateChange = (date: Date | undefined) => {
    if (!date) return;

    if (datePickerMode === "start") {
      setStartDate(date);
    } else if (datePickerMode === "end") {
      setEndDate(date);
    }
    setDatePickerMode(null);
  };

  const handleContinue = async () => {
    if (isSubmitting) return;

    if (!validateAll()) {
      return;
    }

    if (startDate >= endDate) {
      setApiError("Data początkowa musi być przed datą końcową");
      return;
    }

    // TODO: pass all data
    router.replace("/(entry)/register/user")
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-400">
      <View className="flex-1 justify-center items-center px-5">
        <View className="w-full max-w-lg gap-6">
          <Text className="text-4xl font-bold text-slate-700">
            Dane wydarzenia
          </Text>

          <View className="gap-3">
            <View className={`overflow-hidden ${errors.api ? "h-auto" : "h-0"}`}>
              <View className="bg-red-200 border border-red-400 rounded p-3 mb-3">
                <Text className="text-red-800 text-sm">{errors.api}</Text>
              </View>
            </View>

            <View>
              <Text className="mb-1 text-sm text-slate-700">Nazwa wydarzenia</Text>
              <TextInput
                value={values.eventName}
                onChangeText={(text) => handleFieldChange(text, "eventName")}
                placeholder="Scout Camp 2025"
                maxLength={100}
                className={`bg-white p-3 rounded border-2 ${
                  errors.eventName ? "border-red-500" : "border-white"
                }`}
              />
              <View className="h-5">
                {errors.eventName && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.eventName}
                  </Text>
                )}
              </View>
            </View>

            <View>
              <Text className="mb-1 text-sm text-slate-700">Nazwa drużyny</Text>
              <TextInput
                value={values.troopName}
                onChangeText={(text) => handleFieldChange(text, "troopName")}
                placeholder="Drużyna Orłów"
                maxLength={100}
                className={`bg-white p-3 rounded border-2 ${
                  errors.troopName ? "border-red-500" : "border-white"
                }`}
              />
              <View className="h-5">
                {errors.troopName && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.troopName}
                  </Text>
                )}
              </View>
            </View>

            <View>
              <Text className="mb-1 text-sm text-slate-700">Data rozpoczęcia</Text>
              <Pressable
                onPress={() => setDatePickerMode("start")}
                className="bg-white p-3 rounded border-2 border-white"
              >
                <Text className="text-slate-700">
                  {startDate.toLocaleDateString("pl-PL")}
                </Text>
              </Pressable>
              {datePickerMode === "start" && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="default"
                  onChange={(event, date) => handleDateChange(date)}
                />
              )}
            </View>

            <View>
              <Text className="mb-1 text-sm text-slate-700">Data zakończenia</Text>
              <Pressable
                onPress={() => setDatePickerMode("end")}
                className="bg-white p-3 rounded border-2 border-white"
              >
                <Text className="text-slate-700">
                  {endDate.toLocaleDateString("pl-PL")}
                </Text>
              </Pressable>
              {datePickerMode === "end" && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display="default"
                  onChange={(event, date) => handleDateChange(date)}
                />
              )}
            </View>
          </View>

          <View className="flex-row justify-center gap-4">
            <Link
              href="/(entry)/register/key"
              className="text-slate-700 px-4 py-2 rounded underline"
            >
              Wstecz
            </Link>

            <Pressable
              onPress={handleContinue}
              disabled={isSubmitting}
              className="bg-slate-700 px-4 py-2 rounded"
            >
              <Text className="text-white font-semibold">
                {isSubmitting ? "Sprawdzanie..." : "Dalej"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

