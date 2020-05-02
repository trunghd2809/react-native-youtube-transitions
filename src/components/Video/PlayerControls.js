import React, {useContext} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import PlayerContext from '../../context/PlayerContext';
const {width} = Dimensions.get('window');
export const PLACEHOLDER_WIDTH = width / 3;

const PlayerControls = props => {
  const {title, onPress} = props;
  const {playVideo} = useContext(PlayerContext);
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.placeholder} />
        <Text style={styles.title} numerOfLine={3}>
          {title}
        </Text>
        <Icon size={24} color={'gray'} name="play" />
        <TouchableWithoutFeedback onPress={() => playVideo(null)}>
          <Icon size={24} color={'gray'} name="x" />
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    flexWrap: 'wrap',
    paddingLeft: 8,
  },
  placeholder: {
    width: PLACEHOLDER_WIDTH,
  },
  icon: {
    fontSize: 24,
    color: 'gray',
    padding: 8,
  },
});
export default PlayerControls;
