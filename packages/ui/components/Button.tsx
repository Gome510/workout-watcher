import { View, Button } from "react-native";
import React from "react";

const NormalButton = () => {
  return (
    <View>
      <Button
        title="Button"
        onPress={() => console.log("press")}
        testID="button"
      />
    </View>
  );
};

export default NormalButton;
