import React, { useState, useRef, useEffect, useContext, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  PanResponder, 
  Animated,
  ActivityIndicator,
  Button,
  Dimensions,
  Alert
} from 'react-native';
import { WebView } from 'react-native-webview';
import { LineChart } from 'react-native-chart-kit';

import { useSettings } from '../context/SettingsContext';
import { ThemeContext } from '../context/ThemeContext';

const MonitoringScreen = ({ onTabPress }) => {
  const { streamUrl, isLoading } = useSettings();
  const { isDarkMode } = useContext(ThemeContext);

  const [liveStats, setLiveStats] = useState(null);
  const [powerStats, setPowerStats] = useState(null); 
  const [historyData, setHistoryData] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(null);
  const [cameraHeight, setCameraHeight] = useState(220);
  const [isWebViewLoading, setIsWebViewLoading] = useState(true);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        setCameraHeight(prevHeight => Math.max(150, prevHeight + gestureState.dy));
      },
    })
  ).current;

  const fetchHistoryData = async () => {
    if (!streamUrl) return;
    try {
        const response = await fetch(`http://${streamUrl}:8000/history`);
        if (!response.ok) throw new Error("Gagal mengambil data riwayat.");
        const data = await response.json();
        setHistoryData(data.history);
    } catch (error) {
        console.error("Fetch History Error:", error);
    } finally {
        setIsHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (!streamUrl) return;
    
    const fetchLiveData = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const response = await fetch(`http://${streamUrl}:8000/detection`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!response.ok) throw new Error("Gagal mengambil data deteksi dari server Pi.");
        const json = await response.json();
        setLiveStats(json.detection);
        if (connectionError) setConnectionError(null);
      } catch (error) {
        setConnectionError("Koneksi ke Raspberry Pi Gagal. Periksa jaringan & alamat.");
      }
    };

    const fetchPowerData = async () => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);
            const response = await fetch(`http://${streamUrl}:8000/sensor`, { signal: controller.signal });
            clearTimeout(timeoutId);
            if (!response.ok) throw new Error("Gagal mengambil data sensor.");
            const data = await response.json();
            
            if (data && data.sensor) {
              setPowerStats(data.sensor); 
            } else {
              setPowerStats(null);
            }
        } catch (error) {
            console.error("Fetch Power Data Error:", error);
            setPowerStats(null);
        }
    };

    fetchLiveData();
    fetchPowerData();
    fetchHistoryData();

    const liveIntervalId = setInterval(fetchLiveData, 5000); 
    const powerIntervalId = setInterval(fetchPowerData, 5000);
    const historyIntervalId = setInterval(fetchHistoryData, 15000); 

    return () => {
      clearInterval(liveIntervalId);
      clearInterval(historyIntervalId);
      clearInterval(powerIntervalId);
    };
  }, [streamUrl, connectionError]);

  const chartData = useMemo(() => {
    const slicedData = historyData.slice(-15);
    if (slicedData.length < 2) return null;

    const labels = slicedData.map(d => new Date(d.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    const datasets = [
        { data: slicedData.map(d => d.good), color: (opacity = 1) => `rgba(40, 167, 69, ${opacity})`, strokeWidth: 3 },
        { data: slicedData.map(d => d.bad), color: (opacity = 1) => `rgba(220, 53, 69, ${opacity})`, strokeWidth: 3 }
    ];
    return { labels, datasets, originalData: slicedData };
  }, [historyData]);

  const onChartPointClick = ({ index }) => {
    if (!chartData || !chartData.originalData) return;
    const dataPoint = chartData.originalData[index];
    if (dataPoint) {
      Alert.alert(
        `Detail Pukul ${new Date(dataPoint.timestamp).toLocaleTimeString('id-ID')}`,
        `Good: ${dataPoint.good}\nBad: ${dataPoint.bad}`
      );
    }
  };
  
  const handleResetHistory = async () => {
    if (!streamUrl) return;
    Alert.alert(
      "Konfirmasi Reset",
      "Anda yakin ingin menghapus semua riwayat data grafik?",
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Ya, Hapus", 
          style: "destructive", 
          onPress: async () => {
            try {
              const response = await fetch(`http://${streamUrl}:8000/reset_history`, { method: 'POST' });
              if (!response.ok) throw new Error("Gagal mereset data di server.");
              Alert.alert("Sukses", "Data riwayat berhasil direset.");
              setIsHistoryLoading(true);
              await fetchHistoryData();
            } catch (error) {
              Alert.alert("Error", `Gagal mereset data: ${error.message}`);
            }
          } 
        }
      ]
    );
  };
  
  useEffect(() => {
    setIsWebViewLoading(true); 
    const timer = setTimeout(() => { setIsWebViewLoading(false); }, 4000);
    return () => clearTimeout(timer);
  }, [streamUrl]);

  const handleWebViewError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    if (!connectionError) setConnectionError(`Gagal memuat video stream (${nativeEvent.description}).`);
  };

  const mainContainerStyle = [styles.mainContainer, isDarkMode && styles.mainContainerDark];
  const headerStyle = [styles.header, isDarkMode && styles.headerDark];
  const headerTextStyle = [styles.headerText, isDarkMode && styles.textDark];
  const sectionTitleStyle = [styles.sectionTitle, isDarkMode && styles.sectionTitleDark];
  const statsContainerStyle = [styles.statsContainer, isDarkMode && styles.statsContainerDark];
  const statValueStyle = [styles.statValue, isDarkMode && styles.statValueDark];
  const statLabelStyle = [styles.statLabel, isDarkMode && styles.statLabelDark];
  const qualityTitleStyle = [styles.qualityTitle, isDarkMode && styles.qualityTitleDark];
  const qualityTextStyle = [styles.qualityText, isDarkMode && styles.qualityTextDark];
  const centeredMessageStyle = [styles.centeredMessage, isDarkMode && styles.mainContainerDark];
  const messageTextStyle = [styles.messageText, isDarkMode && styles.textDark];
  const chartContainerStyle = [styles.chartContainer, isDarkMode && styles.chartContainerDark];
  const chartConfig = {
    backgroundColor: isDarkMode ? "#2C2C2C" : "#FEF9E7",
    backgroundGradientFrom: isDarkMode ? "#1E1E1E" : "#FEF3C7",
    backgroundGradientTo: isDarkMode ? "#2C2C2C" : "#FEF9E7",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(120, 53, 15, ${opacity})`,
    labelColor: (opacity = 1) => isDarkMode ? `rgba(224, 224, 224, ${opacity})` : `rgba(120, 53, 15, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: { r: "5", strokeWidth: "2", stroke: isDarkMode ? "#D4A57F" : "#92400E" }
  };


  if (isLoading) {
    return (
        <View style={centeredMessageStyle}>
            <ActivityIndicator size="large" color={isDarkMode ? "#D4A57F" : "#92400E"}/>
            <Text style={messageTextStyle}>Memuat Konfigurasi...</Text>
        </View>
    );
  }

  if (!streamUrl) {
    return (
      <View style={centeredMessageStyle}>
        <Text style={messageTextStyle}>Alamat stream kamera belum diatur.</Text>
        <Button title="Buka Pengaturan" onPress={() => onTabPress('settings')} color="#92400E"/>
      </View>
    );
  }

  const videoFeedUrl = `http://${streamUrl}:8000/video_feed`;

  return (
    <SafeAreaView style={mainContainerStyle}>
      <View style={headerStyle}>
        <Text style={headerTextStyle}>Monitoring</Text>
      </View>

      {connectionError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{connectionError}</Text>
          <TouchableOpacity onPress={() => onTabPress('settings')} style={styles.errorButton}>
             <Text style={styles.errorButtonText}>Pengaturan</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={styles.cameraSectionContainer}>
           <View style={[styles.cameraView, isDarkMode && styles.cameraViewDark, { height: cameraHeight }]}>
            <WebView
              source={{ uri: videoFeedUrl }}
              style={styles.cameraImage}
              onError={handleWebViewError}
              containerStyle={{backgroundColor: isDarkMode ? '#1E1E1E' : '#FFF'}}
              originWhitelist={['*']}
            />
            {isWebViewLoading && (
              <View style={styles.webviewLoading}>
                <ActivityIndicator size="large" color={isDarkMode ? "#D4A57F" : "#92400E"} />
                <Text style={[styles.loadingText, isDarkMode && styles.textDark]}>Memulai stream...</Text>
              </View>
            )}
            <TouchableOpacity style={styles.cameraSettingsButton} onPress={() => onTabPress('settings')}>
              <Text style={styles.cameraSettingsIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.resizeHandleWrapper} {...panResponder.panHandlers}>
            <View style={[styles.resizeHandle, isDarkMode && styles.resizeHandleDark]} />
          </View>
        </Animated.View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={[styles.actionButton, isDarkMode && styles.actionButtonDark]} onPress={fetchHistoryData}>
             <Text style={[styles.actionButtonText, isDarkMode && styles.textDark]}>🔄 Perbarui Data</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.resetButton]} onPress={handleResetHistory}>
             <Text style={[styles.actionButtonText, {color: 'white'}]}>🗑️ Reset Grafik</Text>
          </TouchableOpacity>
        </View>

        <View style={statsContainerStyle}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={statValueStyle}>{liveStats ? liveStats.total.toLocaleString() : '...'}</Text>
              <Text style={statLabelStyle}>Total Diproses</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={statValueStyle}>{liveStats ? `${liveStats.good_percentage.toFixed(1)}%` : '...'}</Text>
              <Text style={statLabelStyle}>Efisiensi</Text>
            </View>
          </View>
          <Text style={qualityTitleStyle}>Distribusi Kualitas</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarBackground, isDarkMode && styles.progressBarBackgroundDark]}>
              <View style={[styles.progressBarFill, { width: liveStats ? `${liveStats.good_percentage}%` : '0%' }]}/>
            </View>
          </View>
          <Text style={qualityTextStyle}>
            {liveStats ? `${liveStats.good_percentage.toFixed(1)}% (${liveStats.good}) Kualitas Baik`: 'Menunggu data...'}
          </Text>
        </View>

        <Text style={sectionTitleStyle}>Power Monitoring</Text>
        <View style={styles.powerMonitoringContainer}>
          <View style={styles.powerItem}>
            <View style={[styles.powerCircle, isDarkMode && styles.powerCircleDark]}>
              <Text style={[styles.powerValueText, isDarkMode && styles.powerValueDark]}>
                {powerStats && powerStats.voltage !== undefined ? powerStats.voltage.toFixed(1) : '...'}
              </Text>
            </View>
            <Text style={[styles.powerLabel, isDarkMode && styles.statLabelDark]}>Voltage</Text>
          </View>
          <View style={styles.powerItem}>
            <View style={[styles.powerCircle, isDarkMode && styles.powerCircleDark]}>
              <Text style={[styles.powerValueText, isDarkMode && styles.powerValueDark]}>
                {powerStats && powerStats.current !== undefined ? powerStats.current.toFixed(2) : '...'}
              </Text>
            </View>
            <Text style={[styles.powerLabel, isDarkMode && styles.statLabelDark]}>Current</Text>
          </View>
          <View style={styles.powerItem}>
            <View style={[styles.powerCircle, isDarkMode && styles.powerCircleDark]}>
              <Text style={[styles.powerValueText, isDarkMode && styles.powerValueDark]}>
                {powerStats && powerStats.power !== undefined ? powerStats.power.toFixed(1) : '...'}
              </Text>
            </View>
            <Text style={[styles.powerLabel, isDarkMode && styles.statLabelDark]}>Power</Text>
          </View>
        </View>

        <Text style={sectionTitleStyle}>Grafik Hasil Deteksi</Text>
        <View style={chartContainerStyle}>
          {isHistoryLoading ? (
            <ActivityIndicator size="large" color={isDarkMode ? "#D4A57F" : "#92400E"} />
          ) : !chartData ? (
             <Text style={messageTextStyle}>Kumpulkan data (minimal 2 titik) untuk menampilkan grafik.</Text>
          ) : (
              <LineChart
                data={{
                    labels: chartData.labels,
                    datasets: chartData.datasets,
                    legend: ["Good", "Bad"]
                }}
                width={Dimensions.get("window").width - 50}
                height={230}
                chartConfig={chartConfig}
                bezier
                style={{ marginVertical: 8, borderRadius: 16 }}
                onDataPointClick={onChartPointClick}
              />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles tidak berubah dan tetap sama seperti sebelumnya
const styles = StyleSheet.create({
  chartContainer: {
    marginBottom: 32,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 16,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
  },
  chartContainerDark: {
    backgroundColor: '#1E1E1E',
  },
  mainContainer: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { backgroundColor: '#92400E', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  headerText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1, paddingHorizontal: 20 },
  cameraSectionContainer: { marginBottom: 16 },
  cameraView: { backgroundColor: 'white', borderRadius: 24, overflow: 'hidden', borderWidth: 2, borderColor: '#E5E7EB', position: 'relative' },
  cameraImage: { width: '100%', height: '100%' },
  cameraSettingsButton: { position: 'absolute', top: 8, right: 8, padding: 4, zIndex: 10 },
  cameraSettingsIcon: { fontSize: 20, color: '#FFFFFF', textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: {width: -1, height: 1}, textShadowRadius: 5 },
  resizeHandleWrapper: { width: '100%', paddingVertical: 10, alignItems: 'center', justifyContent: 'center' },
  resizeHandle: { width: 60, height: 6, backgroundColor: '#D1D5DB', borderRadius: 3 },
  statsContainer: { backgroundColor: '#FEF3C7', padding: 20, borderRadius: 24, marginBottom: 24 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 32, fontWeight: 'bold', color: '#78350F' },
  statLabel: { fontSize: 14, color: '#A16207', marginTop: 4 },
  qualityTitle: { fontSize: 16, fontWeight: 'bold', color: '#78350F', marginBottom: 12, textAlign: 'center' },
  progressBarContainer: { marginBottom: 8 },
  progressBarBackground: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4 },
  progressBarFill: { height: '100%', backgroundColor: '#92400E', borderRadius: 4 },
  qualityText: { fontSize: 14, color: '#A16207', marginBottom: 4, textAlign: 'center' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#78350F', marginBottom: 16, paddingHorizontal: 5 },
  centeredMessage: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#F3F4F6' },
  messageText: { fontSize: 16, textAlign: 'center', color: '#374151' },
  errorContainer: { backgroundColor: '#EF4444', paddingVertical: 10, paddingHorizontal: 15, marginHorizontal: 20, marginTop: 10, borderRadius: 12, flexDirection: 'row', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2}, shadowOpacity: 0.2, shadowRadius: 4 },
  errorIcon: { fontSize: 20, marginRight: 12 },
  errorText: { flex: 1, color: 'white', fontWeight: '600', fontSize: 14 },
  errorButton: { marginLeft: 10, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8 },
  errorButtonText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  webviewLoading: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: 22 },
  loadingText: { marginTop: 10, color: '#FFF', fontWeight: '600', textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: {width: 0, height: 1}, textShadowRadius: 2 },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'white',
    marginHorizontal: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    alignItems: 'center',
  },
  actionButtonDark: {
    backgroundColor: '#2C2C2C',
  },
  resetButton: {
    backgroundColor: '#c82333',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  powerMonitoringContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
    paddingHorizontal: 5,
  },
  powerItem: { 
    alignItems: 'center', 
    flex: 1 
  },
  powerCircle: {
    width: 90,
    height: 90,
    backgroundColor: 'white',
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#92400E',
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  powerValueText: { 
    fontSize: 20,
    fontWeight: 'bold', 
    color: '#78350F' 
  },
  powerLabel: {
    fontSize: 14,
    color: '#78350F',
    fontWeight: '600',
    textAlign: 'center',
  },
  mainContainerDark: { backgroundColor: '#121212' },
  headerDark: { backgroundColor: '#1E1E1E', borderBottomWidth: 1, borderBottomColor: '#2C2C2C' },
  textDark: { color: '#E0E0E0' },
  cameraViewDark: { backgroundColor: '#1E1E1E', borderColor: '#2C2C2C' },
  resizeHandleDark: { backgroundColor: '#4A4A4A' },
  sectionTitleDark: { color: '#D4A57F' },
  statsContainerDark: { backgroundColor: '#1E1E1E' },
  statValueDark: { color: '#D4A57F' },
  statLabelDark: { color: '#A0A0A0' },
  qualityTitleDark: { color: '#D4A57F' },
  qualityTextDark: { color: '#A0A0A0' },
  progressBarBackgroundDark: { backgroundColor: '#4A4A4A'},
  powerCircleDark: {
    backgroundColor: '#2C2C2C',
    borderColor: '#D4A57F',
  },
  powerValueDark: { 
    color: '#D4A57F' 
  },
});

export default MonitoringScreen;