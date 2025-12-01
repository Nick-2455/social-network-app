import { View, Text, StyleSheet } from 'react-native';

export default ProfilePlaceholder = (props) => {
  const letra = props.name[0].toUpperCase();
  const codigoLetra = parseInt(letra.charCodeAt(0), 10);
  
  const colores = {
    65: "#15008f", 66: "#00478f", 67: "#8f000e",
    68: "#8f6b00", 69: "#0a8f00", 70: "#8f5f00",
    71: "#8f2400", 72: "#5f008f", 73: "#8f0081",
    74: "#01025c", 75: "#5c2401", 76: "#475c01", 
    77: "#015c2e", 78: "#5c0147", 79: "#5c4b01",
    80: "#21015c", 81: "#5c0128", 82: "#01425c", 
    83: "#54015c", 84: "#57015c", 85: "#195c01",
    86: "#5c0101", 87: "#01125c", 88: "#015c39",
    89: "#5c2501", 90: "#010a5c",
  };

  return(
    <View style={[props.style, styles.profilePlaceHolder,
    {backgroundColor: colores[codigoLetra], width: props.size, height: props.size,}]}>
      <Text style={{ color: "#fff", margin: 'auto', fontSize: props.size / 2 }}>{letra}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  profilePlaceHolder: {
    borderRadius: 50,
    shadowColor: '#000',
    shadowRadius: 35,
    shadowOpacity: 0.4,
    borderColor: '#222',
    borderWidth: 1
  }
});