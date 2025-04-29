import { StyleSheet } from 'react-native';
import { fontFamilies } from '../constants/fonts';

export const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  contentContainer: {
    padding: 32,
  },
  profileGreetingContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontFamily: fontFamilies.MONTSERRAT.regular,
  },
  greeting: {
    fontSize: 32,
    fontFamily: fontFamilies.MONTSERRAT.semiBold,
  },
  pfp: {
    width: 66,
    height: 66,
    borderRadius: 9999,
    borderWidth: 3,
    borderColor: '#FFC9E9',
  },
});
