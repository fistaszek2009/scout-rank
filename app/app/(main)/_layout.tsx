import { Drawer } from 'expo-router/drawer'

export default function MainLayout() {
  return <Drawer>
    <Drawer.Screen
      name="dashboard"
      options={{
        drawerLabel: 'Strona Główna',
        title: 'Strona Główna',
      }}
    />
    <Drawer.Screen
      name="scores/individual"
      options={{
        drawerLabel: 'Moje punkty',
        title: 'Moje punkty',
      }}
    />
  </Drawer>
}
