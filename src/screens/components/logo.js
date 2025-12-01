import {View, Text, StyleSheet} from 'react-native';

const Logo = () => {
  return (
    <View>
      <Text style={styles.logoRest}><Text style={ styles.logoF }>{'F'}</Text>{'eli'}</Text>
    </View>);
}

export default Logo;

const styles = StyleSheet.create({
  logoF: {
    color: "#007AFF",
    fontSize: 90,
    fontWeight: "bold"
  },

  logoRest: {
    color: "#007AFF",
    fontSize: 64,
    fontStyle: "italic"
  },
})