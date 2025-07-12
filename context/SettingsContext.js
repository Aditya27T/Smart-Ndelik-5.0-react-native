import React, { createContext, useState, useEffect, useContext } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Paho from 'paho-mqtt';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [streamUrl, setStreamUrl] = useState(null);
  const [isYoloEnabled, setIsYoloEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [mqttStatus, setMqttStatus] = useState('Initializing...');

  useEffect(() => {
    const loadSettingsFromStorage = async () => {
      try {
        const savedUrl = await AsyncStorage.getItem('stream_url');
        if (savedUrl !== null) {
          setStreamUrl(savedUrl);
          console.log('Pengaturan dimuat dari penyimpanan:', savedUrl);
        }
      } catch (e) {
        console.error('Gagal memuat pengaturan dari penyimpanan.', e);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettingsFromStorage();
    const brokerHost = 'broker.emqx.io';
    const brokerPort = 8083; 
    const clientId = `smart-ndelik-app-${Math.random().toString(16).substr(2, 8)}`;
    const topic = 'pest_monitoring/devicea/my-unique-device-01/config';

    const client = new Paho.Client(brokerHost, brokerPort, clientId);

    client.onConnectionLost = (responseObject) => {
      if (responseObject.errorCode !== 0) {
        setMqttStatus('Disconnected');
        console.log('Koneksi MQTT terputus:', responseObject.errorMessage);
      }
    };

    client.onMessageArrived = (message) => {
      try {
        const data = JSON.parse(message.payloadString);
        const receivedIp = data.ip_address;
        
        if (receivedIp) {
          console.log('Menerima IP dari MQTT:', receivedIp);
          saveStreamUrl(receivedIp);
        }
      } catch (error) {
        console.error('Gagal mem-parsing pesan MQTT:', error);
      }
    };

    function onConnectSuccess() {
      console.log('Terhubung ke Broker MQTT!');
      setMqttStatus('Searching...');
      client.subscribe(topic, { qos: 1 });
    }

    function onConnectFailure(err) {
      console.log('Gagal terhubung ke MQTT:', err);
      setMqttStatus('Failed');
    }

    setMqttStatus('Connecting...');
    client.connect({ 
      onSuccess: onConnectSuccess, 
      onFailure: onConnectFailure,
      cleanSession: true
    });

    return () => {
      if (client.isConnected()) {
        client.disconnect();
        console.log('Koneksi MQTT diputuskan.');
      }
    };
  }, []);

  const saveStreamUrl = (url) => {
    setStreamUrl(prevUrl => {
      if (url && url !== prevUrl) {
        AsyncStorage.setItem('stream_url', url).catch(e => console.error('Gagal menyimpan URL stream.', e));
        return url;
      }
      return prevUrl;
    });
  };

  const toggleYolo = async (newValue) => {
    if (!streamUrl) {
      Alert.alert("Gagal", "Alamat perangkat belum ditemukan.");
      return;
    }
    const state = newValue ? 'on' : 'off';
    const endpoint = `http://${streamUrl}:8000/toggle_yolo/${state}`;
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        setIsYoloEnabled(newValue); 
        Alert.alert("Sukses", data.message);
      } else {
        Alert.alert("Error", data.error || "Gagal mengubah status deteksi.");
      }
    } catch (error) {
      Alert.alert("Koneksi Gagal", "Tidak dapat terhubung ke perangkat Raspberry Pi.");
    }
  };

  const value = {
    streamUrl,
    saveStreamUrl,
    isLoading,
    isYoloEnabled, 
    toggleYolo,    
    mqttStatus,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  return useContext(SettingsContext);
};