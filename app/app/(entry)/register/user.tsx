import { Text, View, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useFormValidation } from "@/utils/useFormValidation";
import { validateName, validatePassword } from "@/utils/validators";
import CustomButton from "@/comp/CustomButton"
import { clearSessionInfo, setSessionInfo } from "@/utils/session";

export default function RegisterUser() {
  const params = useLocalSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { values, errors, handleFieldChange, validateAll, setApiError } =
  useFormValidation(
    { firstName: "", lastName: "", password: "", confirmPassword: "" },
      { firstName: validateName, lastName: validateName, password: validatePassword, confirmPassword: validatePassword }
    );

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!validateAll()) {
      return;
    }

    if (values.password !== values.confirmPassword) {
      setApiError("Hasła nie są identyczne!")
      return;
    }

    setIsSubmitting(true);

    try {
      const register_url = process.env.EXPO_PUBLIC_API_URL + "/api/v1/register";
      const register_response = await fetch(register_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secretCode: params.secretCode,
          eventName: params.eventName,
          troopName: params.troopName,
          eventStartDate: params.startDate,
          eventEndDate: params.endDate,
          firstName: values.firstName,
          lastName: values.lastName,
          password: values.password,
          confirmPassword: values.confirmPassword
        }),
      });

      if (!register_response.ok) {
        const data = await register_response.text();
        const errorMessage = typeof data === "string" ? data : "Wystąpił błąd przy próbie rejestracji";
        setApiError(errorMessage);
        return;
      }

      const register_json = await register_response.json();

      const login_url = process.env.EXPO_PUBLIC_API_URL + "/api/v1/login";
      const login_response = await fetch(login_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: register_json.eventId,
          firstName: values.firstName,
          lastName: values.lastName,
          password: values.password,
          confirmPassword: values.confirmPassword
        }),
      });

      if (!login_response.ok) {
        const data = await login_response.text();
        const errorMessage = typeof data === "string" ? data : "Wystąpił błąd przy próbie rejestracji";
        setApiError(errorMessage);
        return;
      }

      const login_json = await login_response.json();

      await setSessionInfo({
        userId: login_json.userId,
        sessionSecret: login_json.session
      });

      router.replace("/");
    } catch (error) {
      setApiError("Błąd sieci. Sprawdź połączenie.");
      console.error("Register key error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <SafeAreaView className="flex-1 bg-slate-400">
      <View className="flex-1 justify-center items-center px-5">
        <View className="w-full max-w-lg gap-6">
          <Text className="text-4xl font-bold text-slate-700">
            Dane drużynowego
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
                maxLength={100}
                className={`bg-white p-3 rounded border-2 ${
                  errors.firstName ? "border-red-500" : "border-white"
                }`}
              />
              <View className="h-5">
                {errors.firstName && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.firstName}
                  </Text>
                )}
              </View>
            </View>

            <View>
              <Text className="mb-1 text-sm text-slate-700">Nazwisko</Text>
              <TextInput
                value={values.lastName}
                onChangeText={(text) => handleFieldChange(text, "lastName")}
                placeholder="Kowalski"
                maxLength={100}
                className={`bg-white p-3 rounded border-2 ${
                  errors.lastName ? "border-red-500" : "border-white"
                }`}
              />
              <View className="h-5">
                {errors.lastName && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.lastName}
                  </Text>
                )}
              </View>
            </View>

            <View>
              <Text className="mb-1 text-sm text-slate-700">Hasło</Text>
              <TextInput
                value={values.password}
                onChangeText={(text) => handleFieldChange(text, "password")}
                placeholder="••••••••"
                secureTextEntry
                autoCapitalize="none"
                textContentType="password"
                className={`bg-white p-3 rounded border-2 ${errors.password ? " border-red-500" : "border-white"}`}              
              />
              <View className="h-5">
                {errors.password && (
                  <Text className="text-red-500 text-xs mt-1">{errors.password}</Text>
                )}
              </View>
            </View>
          </View>

          <View>
            <Text className="mb-1 text-sm text-slate-700">Powtórz hasło</Text>
            <TextInput
              value={values.confirmPassword}
              onChangeText={(text) => handleFieldChange(text, "confirmPassword")}
              placeholder="••••••••"
              secureTextEntry
              autoCapitalize="none"
              textContentType="password"
              className={`bg-white p-3 rounded border-2 ${errors.confirmPassword ? " border-red-500" : "border-white"}`}              
            />
            <View className="h-5">
              {errors.confirmPassword && (
                <Text className="text-red-500 text-xs mt-1">{errors.confirmPassword}</Text>
              )}
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
              onPress={handleSubmit}
              disabled={isSubmitting}
              className="bg-slate-700 px-4 py-2 rounded"
              textClassName="text-white font-semibold"
              text={isSubmitting ? "Rejestrowanie..." : "Zarejestruj się"}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
