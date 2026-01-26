import { Tabs } from 'expo-router/tabs'
import Ionicons from '@expo/vector-icons/Ionicons';

export default function StatsLayout() {
  return (
    <Tabs>
        <Tabs.Screen
        name="index"
        options={{
            title: 'Wewnątrz zastępu',
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
                return <Ionicons name="person" size={size} color={color} />;
            }
        }}
        />
        <Tabs.Screen
        name="global"
        options={{
            title: 'Globalny',
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
                return <Ionicons name="globe-outline" size={size} color={color} />;
            }
        }}
        />
        <Tabs.Screen
        name="patrols"
        options={{
            title: 'Zastępów',
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
                return <Ionicons name="people" size={size} color={color} />;
            }
        }}
        />
    </Tabs>
  )
}