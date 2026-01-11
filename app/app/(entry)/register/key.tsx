import { Text, View, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { useState } from "react";
import { useFormValidation } from "../useFormValidation";
import { validateSecretCode } from "../validators";

export default function RegisterKey() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { values, errors, handleFieldChange, validateAll, setApiError } =
    useFormValidation(
      { secretCode: "" },
      { secretCode: validateSecretCode }
    );

  const handleRegisterKey = async () => {
    if (isSubmitting) return;

    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const url = process.env.EXPO_PUBLIC_API_VERIFY_SECRETCODE;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secretCode: values.secretCode,
        }),
      });

      if (!response.ok) {
        const data = await response.text();
        console.log(data);
        const errorMessage = typeof data === "string" ? data : "Błąd weryfikacji kodu";
        setApiError(errorMessage);
        return;
      }

      const data = await response.json();
      router.replace("/(main)/individual");
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
            Zarejestruj się!
          </Text>
          <View className="gap-3">
            <View className={`overflow-hidden ${errors.api ? "h-auto" : "h-0"}`}>
              <View className="bg-red-200 border border-red-400 rounded p-3 mb-3">
                <Text className="text-red-800 text-sm">{errors.api}</Text>
              </View>
            </View>

            <View>
              <Text className="mb-1 text-sm text-slate-700">Kod dostępu do rejestracji (dostępny u właściciela serwera):</Text>
              <TextInput
                value={values.secretCode}
                onChangeText={(text) => handleFieldChange(text, "secretCode")}
                placeholder="••••••••"
                secureTextEntry
                autoCapitalize="none"
                textContentType="password"
                className={`bg-white p-3 rounded border-2 ${errors.secretCode ? " border-red-500" : "border-white"}`}              
              />
              <View className="h-5">
                {errors.secretCode && (
                  <Text className="text-red-500 text-xs mt-1">{errors.secretCode}</Text>
                )}
              </View>
            </View>
          </View>

          <View className="flex-row justify-center gap-4">
            <Link
              href="/(entry)/login"
              className="text-slate-700 px-4 py-2 rounded underline"
            >
              Zaloguj się
            </Link>

            <Pressable
              onPress={handleRegisterKey}
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
