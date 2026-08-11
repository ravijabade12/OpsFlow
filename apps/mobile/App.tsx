/**
 * OpsFlow — Field Agent App
 *
 * @format
 */

import { StatusBar, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";

import { RootNavigator } from "./src/navigation/RootNavigator";
import { store } from "./src/store";

function App() {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
        <RootNavigator />
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
