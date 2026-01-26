import { Drawer } from 'expo-router/drawer'

export default function MainLayout() {
  return <Drawer>
    <Drawer.Screen
      name="dashboard"
      options={{
        drawerLabel: 'Strona Główna',
        title: 'Strona Główna'
      }}
    />
    <Drawer.Screen
      name="scores/individual"
      options={{
        drawerLabel: 'Moje punkty',
        title: 'Moje punkty'
      }}
    />
    <Drawer.Screen
      name="scores/patrol"
      options={{
        drawerLabel: 'Punkty zastępu',
        title: 'Punkty zastępu'
      }}
    />
    <Drawer.Screen
      name="stats"
      options={{
        drawerLabel: 'Statystyki',
        title: 'Statystyki'
      }}
    />
  </Drawer>
}
