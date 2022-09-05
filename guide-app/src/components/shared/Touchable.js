import React, { useEffect, useState } from "react";
import { View, TouchableOpacity } from "react-native";

type Props = {
  children: any,
  onPress?: any,
  wrapperStyle?: Object,
};

const Touchable = (props: Props) => {
  const { children, onPress, wrapperStyle } = props;

  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    return setPressed(false);
  }, []);

  return (
    <TouchableOpacity
      {...props}
      activeOpacity={1}
      onPress={() => {
        setPressed(true);
        setTimeout(() => {
          setPressed(false);
          onPress();
        }, 100);
      }}
    >
      <View style={[{ opacity: pressed ? 0.8 : 1 }, wrapperStyle]}>
        {children}
      </View>
    </TouchableOpacity>
  );
};
export default Touchable;
