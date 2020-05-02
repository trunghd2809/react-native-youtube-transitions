/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import PlayerContext from './PlayerContext';
import {View, StyleSheet, Dimensions} from 'react-native';
import Animated, {Easing} from 'react-native-reanimated';
import VideoModal from '../components/Video/VideoModal';
const HEIGHT = Dimensions.get('window').height;
const {Value, timing} = Animated;

const PlayerProvider = props => {
  const [video, setVideo] = useState(null);
  const anim = new Value(0);
  useEffect(() => {
    timing(anim, {
      toValue: video ? 1 : 0,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    }).start();
  }, [video]);
  const playVideo = v => {
    setVideo(v);
  };
  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [HEIGHT, 0],
  });
  return (
    <PlayerContext.Provider value={{video, playVideo}}>
      <View style={styles.container}>
        <View style={StyleSheet.absoluteFill}>{props.children}</View>
        <Animated.View style={[{}, {transform: [{translateY}]}]}>
          {video && <VideoModal video={video} />}
        </Animated.View>
      </View>
    </PlayerContext.Provider>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default PlayerProvider;
