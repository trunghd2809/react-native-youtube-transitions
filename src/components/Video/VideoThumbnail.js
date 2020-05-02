/* eslint-disable prettier/prettier */
import React, { useContext } from 'react';
import {TouchableWithoutFeedback, View, StyleSheet, Image, Text} from 'react-native';
import PlayerContext from '../../context/PlayerContext';

const VideoThumbnail = props => {
  const {video} = props;
  const {thumbnail, avatar, views, published, username, title} = video || {};
  const {playVideo} = useContext(PlayerContext);
  const _handleOnPress = () => {
    playVideo(video);
  };
  return (
    <TouchableWithoutFeedback onPress={_handleOnPress}>
      <View style={styles.container}>
        <Image source={thumbnail} style={styles.thumbnail} />
        <View style={styles.description}>
          <Image source={avatar} style={styles.avatar} />
          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>
              {`${username} • ${views} views • ${published.fromNow()}`}
            </Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  thumbnail: {
    height: 200,
    width: '100%',
  },
  description: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 20,
  },
  content: {
    flexDirection: 'column',
    flexGrow: 1,
    width: 0,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
  },
  subtitle: {
    color: 'gray',
  },
});
export default VideoThumbnail;
