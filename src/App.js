/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Platform,
} from 'react-native';
import {
  setCustomView,
  setCustomTextInput,
  setCustomText,
  setCustomImage,
  setCustomTouchableOpacity,
} from 'react-native-global-props';
import AppNavigator from './AppNavigator';
import {Provider} from 'react-redux';
import store from './Redux/store';

const FONT = Platform.OS === 'ios' ? 'Gotham' : 'Gotham';
const customTextInputProps = {
  style: {
    fontFamily: FONT,
  },
};

const customTextProps = {
  style: {
    fontFamily: FONT,
  },
};
console.disableYellowBox = true
setCustomTextInput(customTextInputProps);
setCustomText(customTextProps);
function App() {
  return (
    <Provider store={store}>
      <StatusBar hidden />
      <AppNavigator />
    </Provider>
  );
}

export default App;
