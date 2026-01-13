import { Text, View, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { useState } from "react";
import { useFormValidation } from "./useFormValidation";
import { validateEventId, validateName, validatePassword } from "./validators";
import { KeyboardAwareScrollView, KeyboardToolbar } from 'react-native-keyboard-controller';

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { values, errors, handleFieldChange, validateAll, setApiError } =
    useFormValidation(
      {
        eventId: "",
        firstName: "",
        lastName: "",
        password: "",
      },
      {
        eventId: validateEventId,
        firstName: validateName,
        lastName: validateName,
        password: validatePassword,
      }
    );

  const handleLogin = async () => {
    if (isSubmitting) return;

    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const url = process.env.EXPO_PUBLIC_API_URL + "/login"
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: parseInt(values.eventId),
          firstName: values.firstName,
          lastName: values.lastName,
          password: values.password,
        }),
      });

      if (!response.ok) {
        const data = await response.text()
        console.log(data)
        const errorMessage = typeof data === "string" ? data : "Błąd logowania";
        setApiError(errorMessage);
        return;
      }
    
      const data = await response.json();

      // TODO: Store session data securely using AsyncStorage or SecureStore
      // import AsyncStorage from '@react-native-async-storage/async-storage';
      // await AsyncStorage.setItem('userId', data.userId.toString());
      // await AsyncStorage.setItem('sessionSecret', data.session);

      router.replace("/(main)/individual");

    } catch (error) {
      setApiError("Błąd sieci. Sprawdź połączenie.");
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-400">
        <View className="flex-1 justify-center items-center px-5">
          
            <View className="w-full max-w-lg gap-4">
              <Text className="text-4xl font-bold text-slate-700">
                Zaloguj się!
              </Text>
              <View className="gap-3">
                <View className={`overflow-hidden ${errors.api ? "h-auto" : "h-0"}`}>
                  <View className="bg-red-200 border border-red-400 rounded p-3 mb-3">
                    <Text className="text-red-800 text-sm">{errors.api}</Text>
                  </View>
                </View>

                <View>
                  <Text className="mb-1 text-sm text-slate-700">ID wydarzenia</Text>
                  <TextInput
                    value={values.eventId}
                    onChangeText={(text) => handleFieldChange(text, "eventId")}
                    placeholder="np. 12345"
                    keyboardType="numeric"
                    inputMode="numeric"
                    className={`bg-white p-3 rounded border-2 ${errors.eventId ? " border-red-500" : "border-white"}`}
                  />
                  <View className="h-5">
                    {errors.eventId && (
                      <Text className="text-red-500 text-xs mt-1">{errors.eventId}</Text>
                    )}
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

              <View className="flex-row justify-center gap-4">
                <Link
                  href="/(entry)/register/key"
                  className="text-slate-700 px-4 py-2 rounded underline"
                >
                  Zarejestruj się
                </Link>

                <Pressable
                  onPress={handleLogin}
                  disabled={isSubmitting}
                  className="bg-slate-700 px-4 py-2 rounded"
                >
                  <Text className="text-white font-semibold">
                    {isSubmitting ? "Logowanie..." : "Zaloguj się"}
                  </Text>
                </Pressable>
              </View>
            </View>
          
          
        </View>
    </SafeAreaView>
  );
}
