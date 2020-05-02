import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const IconWrapper = props => {
  const {label, name} = props;
  return (
    <View style={styles.container}>
      <Icon size={24} color={'gray'} name={name} />
      <Text style={styles.label}>{label}</Text>
  </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    color: 'gray',
  },
  label: {
    color: 'gray',
    textAlign: 'center',
    marginTop: 8,
  },
});
export default IconWrapper;
