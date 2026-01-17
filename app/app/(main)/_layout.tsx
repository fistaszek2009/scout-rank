import { Drawer } from 'expo-router/drawer'

export default function MainLayout() {
  return <Drawer>
    <Drawer.Screen
      name="individual"
      options={{
        drawerLabel: 'Strona Główna',
        title: 'Strona Główna',
      }}
    />
  </Drawer>
}
