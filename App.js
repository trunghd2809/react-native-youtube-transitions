/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Home from './src/components/Home';
import PlayerProvider from './src/context/PlayerProvider';

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <PlayerProvider>
          <Home />
        </PlayerProvider>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lighter,
    flex: 1,
  },
});

export default App;
