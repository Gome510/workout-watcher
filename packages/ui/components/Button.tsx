import { View, Button } from "react-native";
import React from "react";

export const NormalButton = () => {
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
