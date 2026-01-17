import { Text, View, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useFormValidation } from "@/utils/useFormValidation";
import { validateName } from "@/utils/validators";
import DateInput from "@/comp/DateInput";
import CustomButton from "@/comp/CustomButton"

export const validateDate = (name: string): string | undefined => {
  if (!name) return "To pole jest wymagane";
  if (name.length > 100) return "Maksymalnie 100 znaków";
  return undefined;
};

export default function RegisterEvent() {
  const params = useLocalSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [datePickerMode, setDatePickerMode] = useState<"start" | "end" | null>(null);

  const { values, errors, handleFieldChange, validateAll, setApiError } =
    useFormValidation(
      { eventName: "", troopName: "" },
      { eventName: validateName, troopName: validateName }
    );

  const handleContinue = async () => {
    if (isSubmitting) return;

    if (!validateAll()) {
      return;
    }

    if (startDate > endDate) {
      setApiError("Data początkowa nie może być po dacie końcowej");
      return;
    }

    // TODO: pass all data
    router.push({ 
      pathname: "/(entry)/register/user",
      params: {
        secretCode: params.secretCode,
        eventName: values.eventName,
        troopName: values.troopName,
        startDate: startDate.toDateString(),
        endDate: endDate.toDateString()
      }
    });
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
              <DateInput value={startDate} onChange={setStartDate} />
            </View>

            <View>
              <Text className="mb-1 text-sm text-slate-700">Data zakończenia</Text>
              <DateInput value={endDate} onChange={setEndDate} />
            </View>
          </View>

          <View className="flex-row justify-center gap-4">
            <CustomButton
              onPress={() => { router.back() }}
              className="px-4 py-2 rounded"
              textClassName="text-slate-700 underline"
              text="Wstecz"
            />

            <CustomButton
              onPress={handleContinue}
              disabled={isSubmitting}
              className="bg-slate-700 px-4 py-2 rounded"
              textClassName="text-white font-semibold"
              text={isSubmitting ? "Sprawdzanie..." : "Dalej"}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

