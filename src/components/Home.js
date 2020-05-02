import React from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import Videos from './Videos';
import VideoThumbnail from './Video/VideoThumbnail';

const Home = () => {
  return (
    <ScrollView style={styles.container}>
      {Videos.map(v => {
        return <VideoThumbnail key={v.id} video={v} />;
      })}
    </ScrollView>
  );
};

export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
