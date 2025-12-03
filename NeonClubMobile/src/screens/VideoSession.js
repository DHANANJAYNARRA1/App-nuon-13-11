import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

const { width, height } = Dimensions.get('window');

const VideoSession = ({ route, navigation }) => {
  const { mentor, sessionDetails } = route.params || {};
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isRecording, setIsRecording] = useState(true);
  const [sessionTime, setSessionTime] = useState(0);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    // Auto-hide controls after 3 seconds
    const controlsTimer = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(controlsTimer);
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndSession = () => {
    Alert.alert(
      'End Session',
      'Are you sure you want to end this session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Session',
          style: 'destructive',
          onPress: () => navigation.navigate('SessionFeedback', { mentor, sessionDetails })
        },
      ]
    );
  };

  const toggleMic = () => setIsMicOn(!isMicOn);
  const toggleCamera = () => setIsCameraOn(!isCameraOn);

  const sessionData = sessionDetails || {
    topic: 'Career Guidance Session',
    date: 'Nov 18, 2024',
    time: '2:00 PM - 2:45 PM',
  };

  const mentorData = mentor || {
    name: 'Dr. Sunita Verma',
    specialization: 'Critical Care',
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Main Video Area */}
      <View style={styles.videoContainer}>
        {/* Mentor's Video Feed */}
        <View style={styles.mainVideo}>
          <View style={styles.videoPlaceholder}>
            <View style={styles.participantAvatar}>
              <Text style={styles.participantInitial}>
                {mentorData.name?.charAt(0) || 'M'}
              </Text>
            </View>
            <Text style={styles.participantName}>{mentorData.name}</Text>
            <Text style={styles.participantRole}>Mentor</Text>
          </View>

          {/* Recording Indicator */}
          {isRecording && (
            <View style={styles.recordingIndicator}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingText}>Recording</Text>
            </View>
          )}

          {/* Session Timer */}
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{formatTime(sessionTime)}</Text>
          </View>
        </View>

        {/* Participant's Video Feed (Self) */}
        <View style={styles.selfVideo}>
          <View style={styles.selfVideoPlaceholder}>
            <Text style={styles.selfVideoText}>You</Text>
            {!isCameraOn && (
              <View style={styles.cameraOffOverlay}>
                <Icon name="camera-off" size={20} color="#9CA3AF" />
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Controls Overlay */}
      {showControls && (
        <View style={styles.controlsOverlay}>
          <View style={styles.controlsContainer}>
            {/* Top Controls */}
            <View style={styles.topControls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => setShowControls(false)}
              >
                <Icon name="minimize-2" size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* Bottom Controls */}
            <View style={styles.bottomControls}>
              <TouchableOpacity
                style={[styles.controlButton, !isMicOn && styles.controlButtonActive]}
                onPress={toggleMic}
              >
                <Icon
                  name={isMicOn ? "mic" : "mic-off"}
                  size={20}
                  color="white"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.controlButton, !isCameraOn && styles.controlButtonActive]}
                onPress={toggleCamera}
              >
                <Icon
                  name={isCameraOn ? "camera" : "camera-off"}
                  size={20}
                  color="white"
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.controlButton}>
                <Icon name="message-square" size={20} color="white" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.controlButton}>
                <Icon name="more-vertical" size={20} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.controlButton, styles.endCallButton]}
                onPress={handleEndSession}
              >
                <Icon name="phone-off" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Tap to show controls */}
      {!showControls && (
        <TouchableOpacity
          style={styles.tapOverlay}
          onPress={() => setShowControls(true)}
        >
          <View style={styles.tapIndicator}>
            <Icon name="maximize-2" size={16} color="rgba(255,255,255,0.7)" />
          </View>
        </TouchableOpacity>
      )}

      {/* Session Info Bar */}
      <View style={styles.infoBar}>
        <View style={styles.infoLeft}>
          <Text style={styles.sessionTopic}>{sessionData.topic}</Text>
          <Text style={styles.sessionTime}>{sessionData.time}</Text>
        </View>
        <View style={styles.infoRight}>
          <View style={styles.participantsCount}>
            <Icon name="users" size={14} color="#6B7280" />
            <Text style={styles.participantsText}>2</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  mainVideo: {
    flex: 1,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    alignItems: 'center',
  },
  participantAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  participantInitial: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  participantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  participantRole: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  selfVideo: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 12,
    backgroundColor: '#374151',
    overflow: 'hidden',
  },
  selfVideoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  selfVideoText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  cameraOffOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingIndicator: {
    position: 'absolute',
    top: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    marginRight: 6,
  },
  recordingText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  timerContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  timerText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  controlsContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  topControls: {
    alignItems: 'flex-end',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: '#EF4444',
  },
  endCallButton: {
    backgroundColor: '#EF4444',
  },
  tapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tapIndicator: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderRadius: 24,
  },
  infoBar: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLeft: {
    flex: 1,
  },
  sessionTopic: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  sessionTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  infoRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantsCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  participantsText: {
    fontSize: 12,
    color: '#374151',
    marginLeft: 4,
    fontWeight: '500',
  },
});

export default VideoSession;