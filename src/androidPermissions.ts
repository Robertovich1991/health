import { Platform, PermissionsAndroid, Alert } from 'react-native';


export const handleAndroidPermissions = async (cb?: () => void) => {
  if (Platform.OS === 'android') {
    const permissions = Platform.Version >= 31
      ? [
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]
      : [
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
      ];
      const granted = await PermissionsAndroid.requestMultiple(permissions);

    try {
      console.log("dkfmkd",granted);
      
      if (!Object.values(granted).includes(PermissionsAndroid.RESULTS.GRANTED)) {
        Alert.alert("Please, allow the permissions to use the app");
        cb && cb()
      }
    } catch (error) {
      console.error('Permission request error:', error);
    }
  }
};