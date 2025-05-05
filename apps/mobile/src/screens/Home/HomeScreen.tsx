import {View, Text, Image} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import {HomeRepGraph} from '@workout-watcher/ui';
import {styles} from '../styles';

const HomeScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={['#30293D', '#262135', '#30293D']}
      style={{paddingTop: insets.top, ...styles.container}}>
      <View style={styles.contentContainer}>
        <View style={styles.profileGreetingContainer}>
          <Text style={{...styles.text, ...styles.greeting}}>
            Hi, First Name!
          </Text>
          <Image
            source={require('../../assets/images/pfp.jpg')}
            style={styles.pfp}
          />
        </View>
        <HomeRepGraph style={{marginLeft: -styles.contentContainer.padding}} />
      </View>
    </LinearGradient>
  );
};

export default HomeScreen;
