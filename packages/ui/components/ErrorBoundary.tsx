import React, { ReactNode } from "react";
import { Text, View } from "react-native";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.log(error);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <View>
          <Text>Error</Text>
        </View>
      );
    }
    return this.props.children;
  }
}
