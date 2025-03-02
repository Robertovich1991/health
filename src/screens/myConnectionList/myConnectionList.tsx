
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  NativeModules,
  NativeEventEmitter,
  PermissionsAndroid,
  Platform,
  Button,
  Alert,
  Linking,
} from 'react-native';
import BleManager, {
} from 'react-native-ble-manager';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

declare module 'react-native-ble-manager' {
  interface Peripheral {
    connected?: boolean;
    connecting?: boolean;
  }
}

export const MyConnectionList = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<any[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<any>(null);
  const [heartRate, setHeartRate] = useState(null);
  const handleStopScan = () => {
    setIsScanning(false);
  };
  useEffect(() => {
    try {
      BleManager.start({showAlert: false}).then(() => {
       });
    } catch (error) {
      console.error('unexpected error starting BleManager.', error);
      return;
    }
    const listeners = [
      bleManagerEmitter.addListener(
        'BleManagerDiscoverPeripheral',
        handleDiscoverPeripheral,
      ),
      bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan),
    ];
    return () => {
      for (const listener of listeners) {
        listener.remove();
      }
    };
  }, []);
  const requestBluetoothPermissions = async () => {
    try {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
      if (
        result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === 'never_ask_again' ||
        result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === 'never_ask_again' ||
        result[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === 'never_ask_again'
      ) {
        Alert.alert(
          'Permission Denied',
          'You have permanently denied permissions. Please enable them in Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
      } else if (
        result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] === 'denied' ||
        result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN] === 'denied' ||
        result[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === 'denied'
      ) {
        Alert.alert('Permissions Required', 'Bluetooth and Location permissions are necessary for BLE scanning.');
      } else {
        console.log('All permissions granted:', result);
      }
    } catch (error) {
      console.log('Permission error:', error);
    }
  };
  
  useEffect(() => {
 
    
       requestBluetoothPermissions();
  
  }, []);

  const startScan = () => {
    if (!isScanning) {
      setIsScanning(true);
      BleManager.scan([], 5, true).then(() => {
        console.log('Scanning...');
      }).catch((er)=>{
console.log(er,"Er");

      });
    }
  };

     const handleDiscoverPeripheral = (peripheral:any) => {
      console.log('Discovered:', peripheral);
        setDevices((prev) => [...prev, peripheral]);
    };

    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
 

  const connectToDevice = (device:any) => {
    BleManager.connect(device.id).then(() => {
      console.log('Connected to', device.id);
      setConnectedDevice(device);
      retrieveServices(device.id);
    });
  };

  const retrieveServices = (deviceId:string) => {
    BleManager.retrieveServices(deviceId).then((peripheralInfo) => {
      const heartRateService = '180D';
      const heartRateCharacteristic = '2A37';
      BleManager.startNotification(deviceId, heartRateService, heartRateCharacteristic).then(() => {
        console.log('Listening for heart rate...');
      });
    });
  };

  useEffect(() => {
    const handleUpdateValue = ({ value, peripheral, characteristic, service }:any) => {
      if (characteristic === '2A37') {
        setHeartRate(value[1]);
      }
    };

    bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValue);
    return () => {
      // bleManagerEmitter.removeListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValue);
    };
  }, []);
  return (
    <View>
      <Button title={isScanning ? 'Scanning...' : 'Start Scan'} onPress={startScan} disabled={isScanning} />
      {devices.map((device, index) => (
        <Button key={index} title={`Connect to ${device.name}`} onPress={() => connectToDevice(device)} />
      ))}
      {connectedDevice && <Text>Connected to {connectedDevice.name}</Text>}
      {heartRate && <Text>Heart Rate: {heartRate} BPM</Text>}
    </View>
  );
};
