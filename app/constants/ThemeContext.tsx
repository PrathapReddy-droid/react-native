import React, { useState } from "react";
import { 
  NavigationContainer, 
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';
import { COLORS } from "./theme";
import { navigationRef } from '../Api/NavigateService'; // ✅ ADD THIS

const lightTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    background: COLORS.background,
    card: COLORS.card,
    text: COLORS.text,
    border: COLORS.borderColor,
    input: COLORS.input,
    title: COLORS.title,
  },
};

const darkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    background: COLORS.darkBackground,
    card: COLORS.darkCard,
    text: COLORS.darkText,
    border: COLORS.darkBorder,
    input: COLORS.darkInput,
    title: COLORS.darkTitle,
  },
};

export const ThemeContext = React.createContext({
  setDarkTheme: () => {},
  setLightTheme: () => {},
});

export const ThemeContextProvider = ({ children }) => {

  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const authContext = React.useMemo(() => ({
    setDarkTheme: () => setIsDarkTheme(true),
    setLightTheme: () => setIsDarkTheme(false),
  }), []);

  const theme = isDarkTheme ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={authContext}>
      {/* ✅ SINGLE NavigationContainer IN ENTIRE APP */}
      <NavigationContainer ref={navigationRef} theme={theme}>
        {children}
      </NavigationContainer>
    </ThemeContext.Provider>
  );
};
