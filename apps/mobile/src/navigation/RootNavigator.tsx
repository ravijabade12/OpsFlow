import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { JobDetailsScreen } from "../screens/JobDetails/JobDetailsScreen";
import { JobsScreen } from "../screens/Jobs/JobsScreen";
import { colors } from "../theme/colors";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Jobs"
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.accent,
          headerTitleStyle: { color: colors.text, fontWeight: "700" },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="Jobs"
          component={JobsScreen}
          options={{ title: "OpsFlow" }}
        />
        <Stack.Screen
          name="JobDetails"
          component={JobDetailsScreen}
          options={{ title: "Job details" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
