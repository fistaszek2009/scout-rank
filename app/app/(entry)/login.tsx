import { Text, View, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { useState } from "react";

type ValidationError = {
  eventId?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  api?: string;
};

const validateEventId = (id: string): string | undefined => {
  if (!id) return "ID wydarzenia jest wymagane";
  const idNum = Number(id);
  if (isNaN(idNum)) return "ID musi być liczbą";
  if (!Number.isInteger(idNum)) return "ID musi być całkowitą liczbą";
  if (idNum < 0) return "ID musi być nieujemne";
  return undefined;
};

const validateName = (name: string): string | undefined => {
  if (!name) return "To pole jest wymagane";
  if (name.length > 50) return "Maksymalnie 50 znaków";
  if (!/^[\p{L}-]+$/u.test(name)) {
    return "Niedozwolone spacje, cyfry lub znaki specjalne";
  }
  return undefined;
};

const validatePassword = (password: string): string | undefined => {
  if (!password) return "Hasło jest wymagane";
  if (password.length < 8) return "Minimum 8 znaków";
  if (password.length > 300) return "Maksymalnie 300 znaków";
  return undefined;
};

export default function Login() {
  const [eventId, setEventId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationError>({});

  const handleFieldChange = (
    value: string,
    field: "eventId" | "firstName" | "lastName" | "password"
  ) => {
    const fieldSetters: Record<string, (v: string) => void> = {
      eventId: setEventId,
      firstName: setFirstName,
      lastName: setLastName,
      password: setPassword,
    };

    fieldSetters[field](value);

    // Walidacja onChange
    const newErrors = { ...errors };
    delete newErrors[field];

    if (field === "eventId") {
      const error = validateEventId(value);
      if (error) newErrors.eventId = error;
    } else if (field === "firstName") {
      const error = validateName(value);
      if (error) newErrors.firstName = error;
    } else if (field === "lastName") {
      const error = validateName(value);
      if (error) newErrors.lastName = error;
    } else if (field === "password") {
      const error = validatePassword(value);
      if (error) newErrors.password = error;
    }

    setErrors(newErrors);
  };

  const handleLogin = async () => {
    if (isSubmitting) return;

    // Walidacja wszystkich pól
    const newErrors: ValidationError = {};
    
    const eventIdError = validateEventId(eventId);
    if (eventIdError) newErrors.eventId = eventIdError;
    
    const firstNameError = validateName(firstName);
    if (firstNameError) newErrors.firstName = firstNameError;
    
    const lastNameError = validateName(lastName);
    if (lastNameError) newErrors.lastName = lastNameError;
    
    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const url = process.env.EXPO_PUBLIC_API_SERVER_URL
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: parseInt(eventId),
          firstName,
          lastName,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = typeof data === "string" ? data : data.message || "Błąd logowania";
        setErrors({ api: errorMessage });
        return;
      }

      router.replace("/(main)/individual");
    } catch (error) {
      setErrors({ api: "Błąd sieci. Sprawdź połączenie." });
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-400">
      <View className="flex-1 justify-center items-center px-5">
        <View className="w-full max-w-lg gap-10">
          <Text className="text-4xl font-bold">
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
                value={eventId}
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
                value={firstName}
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
                value={lastName}
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
                value={password}
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
              className="bg-slate-700 px-4 py-2 rounded text-white"
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
