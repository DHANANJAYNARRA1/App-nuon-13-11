import React, { useState, useContext, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import api, { probeAndFixBase, getCurrentBaseURL, setBaseOverride } from '../services/api';
import { sendOTP as fbSendOTP, verifyOTP as fbVerifyOTP, getIdToken as fbGetIdToken } from '../services/otp';
import { ensureFirebaseInitialized } from '../services/firebaseApp';
import { CONFIG, DEV_BASE_LAN } from '../utils/config';
import FullScreenLoader from '../components/FullScreenLoader';
import { registerPushTokenIfAvailable } from '../utils/notifications';
import { AuthContext } from '../contexts/AuthContext';
import { NEON_COLORS } from '../utils/colors';

const OTPAuthScreen = () => {
  const navigation = useNavigation();
  const { updateUser, setToken } = useContext(AuthContext);
  const [authMethod, setAuthMethod] = useState('phone'); // 'phone' or 'email'
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('input'); // 'input' or 'verify'
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [fbConfirmation, setFbConfirmation] = useState(null);
  const [otpSession, setOtpSession] = useState(null); // idempotent session header for backend
  
  // OTP input refs for auto-focus
  const otpInputRefs = useRef([]);

  useEffect(() => {
    // Auto-focus first OTP input when step changes to verify
    if (step === 'verify' && otpInputRefs.current[0]) {
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  // Dev helper: base is locked; show current base instead of cycling
  const devCycleBase = async () => {
    if (!__DEV__) return;
    const current = getCurrentBaseURL && getCurrentBaseURL();
    Alert.alert('API Base (locked)', current || CONFIG.API_BASE_URL);
  };

  const handleSendOTP = async () => {
    const value = identifier.trim();
    if (!value) {
      Alert.alert('Error', `Please enter your ${authMethod === 'phone' ? 'phone number' : 'email'}`);
      return;
    }
    // Validate inputs
    if (authMethod === 'phone') {
      const digits = value.replace(/\D/g, '');
      if (digits.length !== 10) {
        Alert.alert('Invalid Number', 'Enter a valid 10-digit mobile number');
        return;
      }
    } else {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      if (!emailOk) {
        Alert.alert('Invalid Email', 'Enter a valid email address');
        return;
      }
    }

    try {
  setLoading(true);
  const session = (Math.random().toString(36).slice(2) + Date.now().toString(36));
  setOtpSession(session);
      const digits = value.replace(/\D/g, '');
      const fullPhone = `+91${digits}`;

      // Always use backend API for OTP (send/verify) in all environments
      try { await probeAndFixBase(); } catch {}
      let endpoint = '/otp/send/phone';
      let body = { type: 'phone', identifier: fullPhone, phoneNumber: fullPhone };
      if (authMethod === 'email') {
        endpoint = '/otp/send/email';
        body = { type: 'email', identifier: value.toLowerCase(), email: value.toLowerCase() };
      }
      const resp = await api.post(endpoint, body, { timeout: 5000, headers: { 'x-otp-session': session } });

      // Use the actual OTP from backend response if present
      const backendOTP = resp?.data?.debugOtp;
      if (backendOTP) {
        setOtp(backendOTP);
        Alert.alert('OTP Sent', `Use this OTP to verify: ${backendOTP}`, [
          { text: 'OK' }
        ]);
      } else {
        Alert.alert('OTP Sent', 'OTP sent successfully. Please check your SMS or email.');
      }
      console.log('OTP sent successfully, debugOtp:', backendOTP);
      if (__DEV__) console.log('Using backend OTP, response mode:', resp?.data?.mode, 'debugOtp:', backendOTP);
      setStep('verify');
      setResendTimer(60);
      startResendTimer();
    } catch (error) {
      console.error('Send OTP error:', error?.response?.data || error?.message || error);
      const baseNow = getCurrentBaseURL && getCurrentBaseURL();
      const msg = (error?.response?.data?.message || 'Failed to send OTP') + `\nBase: ${baseNow || 'n/a'}`;
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!/^\d{6}$/.test(otp)) {
      Alert.alert('Invalid OTP', 'Enter the 6 digit code');
      return;
    }
    try {
  setLoading(true);
      const value = identifier.trim();

      let res;

      // Firebase verification for phone authentication
      if (CONFIG.OTP_PROVIDER === 'firebase' && authMethod === 'phone' && fbConfirmation) {
        try {
          await ensureFirebaseInitialized();
          await fbVerifyOTP(fbConfirmation, otp);
          const firebaseIdToken = await fbGetIdToken(true);
          try { await probeAndFixBase(); } catch {}
          res = await api.post('/otp/verify', {
            type: 'phone',
            identifier: `+91${value.replace(/\D/g, '')}`,
            firebaseIdToken,
            provider: 'firebase'
          }, { timeout: 5000, headers: otpSession ? { 'x-otp-session': otpSession } : undefined });
          if (__DEV__) console.log('Verified using Firebase');
        } catch (firebaseError) {
          console.warn('Firebase verification failed:', firebaseError.message);
          Alert.alert('Error', 'Firebase verification failed. Please try again.');
          return;
        }
      } else {
        // Backend verification for email or fallback
        try { await probeAndFixBase(); } catch {}
        const payload = authMethod === 'phone'
          ? { type: 'phone', identifier: `+91${value.replace(/\D/g, '')}`, otp, provider: 'backend' }
          : { type: 'email', identifier: value.toLowerCase(), otp };
        res = await api.post('/otp/verify', payload, { timeout: 5000, headers: otpSession ? { 'x-otp-session': otpSession } : undefined });
        if (__DEV__) console.log('Verified using backend');
      }
  let { token, user, isNewUser } = res?.data || {};
      // Ensure phone number captured flows into profile
      if (authMethod === 'phone') {
        const digits = (identifier || '').replace(/\D/g, '');
        const phone = digits ? `+91${digits}` : null;
        if (phone) {
          user = { ...(user || {}), phoneNumber: user?.phoneNumber || phone };
        }
      }
      if (token) {
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        setToken(token);
        updateUser(user);
        try { await registerPushTokenIfAvailable(); } catch {}
      }
      
      // Check if user profile is complete
      const isProfileComplete = user?.isProfileComplete !== false && 
                               user?.name && 
                               user?.email;
      
      if (isNewUser || !isProfileComplete) {
        // New user or incomplete profile - go to ProfileSetup
        Alert.alert('Success', 'OTP verified successfully');
        const phoneNumber = authMethod === 'phone' ? `+91${identifier.replace(/\D/g, '')}` : null;
        
        navigation.reset({
          index: 0,
          routes: [{
            name: 'ProfileSetup',
            params: {
              user: { ...user, phoneNumber: user?.phoneNumber || phoneNumber },
              token: token,
              isNewUser: isNewUser
            }
          }]
        });
      } else {
        // Existing user with complete profile - go to Main (Dashboard)
        Alert.alert('Welcome Back!', `Welcome back, ${user?.name || 'User'}!`);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }]
        });
      }
    } catch (error) {
      console.error('Verify OTP error:', error?.response?.data || error?.message || error);
      const baseNow = getCurrentBaseURL && getCurrentBaseURL();
      Alert.alert('Error', (error?.response?.data?.message || 'Failed to verify OTP') + `\nBase: ${baseNow || 'n/a'}`);
    } finally {
      setLoading(false);
    }
  };

  const startResendTimer = () => {
    const timer = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOTP = () => {
    setOtp('');
    handleSendOTP();
  };

  const switchAuthMethod = () => {
    setAuthMethod(authMethod === 'phone' ? 'email' : 'phone');
    setIdentifier('');
    setOtp('');
    setStep('input');
    setResendTimer(0);
  };

  return (
    <LinearGradient
      colors={['#9333EA', '#4F46E5', '#2563EB']} // purple-600 via indigo-600 to blue-600
      style={styles.container}
    >
      <FullScreenLoader visible={loading} label={step==='input' ? 'Sending OTP…' : 'Verifying…'} />
      {/* Animated floating circles */}
      <View style={styles.floatingCircle1} />
      <View style={styles.floatingCircle2} />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          {/* Logo with NUON branding */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>⚡</Text>
          </View>
          <Text style={styles.title}>Welcome to NUON</Text>
          <Text style={styles.tagline}>Nurse United, Opportunities Nourished</Text>
        </View>

        <View style={styles.form}>
        {step === 'input' ? (
          <>
            {/* White card container */}
            <View style={styles.authCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Login / Sign Up</Text>
                <Text style={styles.cardSubtitle}>Enter your phone number to continue</Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.phoneInputWrapper}>
                  <Text style={styles.phoneIcon}>📞</Text>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="+91 XXXXX XXXXX"
                    value={identifier}
                    onChangeText={(txt) => {
                      const digits = txt.replace(/\D/g, '').slice(0, 10);
                      setIdentifier(digits);
                    }}
                    keyboardType="number-pad"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                <Text style={styles.helperText}>
                  We'll send you a 6-digit OTP to verify your number
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, identifier.replace(/\D/g, '').length !== 10 && styles.buttonDisabled]}
                onPress={handleSendOTP}
                disabled={loading || identifier.replace(/\D/g, '').length !== 10}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.primaryButtonText}>Send OTP</Text>
                    <Text style={styles.arrowIcon}>→</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Footer text */}
            <Text style={styles.footerText}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </>
        ) : (
          <>
            {/* White card container for OTP */}
            <View style={styles.authCard}>
              <View style={styles.cardHeader}>
                <View style={styles.otpIconContainer}>
                  <Text style={styles.otpIcon}>📞</Text>
                </View>
                <Text style={styles.cardTitle}>Verify OTP</Text>
                <Text style={styles.cardSubtitle}>
                  We've sent a 6-digit code to{'\n'}
                  <Text style={styles.phoneNumberDisplay}>{identifier}</Text>
                </Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.labelCenter}>Enter OTP</Text>
                <View style={styles.otpContainer}>
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => (otpInputRefs.current[index] = ref)}
                      style={[
                        styles.otpInput,
                        otp[index] && styles.otpInputFilled
                      ]}
                      maxLength={1}
                      keyboardType="number-pad"
                      value={otp[index] || ''}
                      onChangeText={(text) => {
                        const newOtp = otp.split('');
                        newOtp[index] = text;
                        const updatedOtp = newOtp.join('');
                        setOtp(updatedOtp);
                        
                        // Auto-focus next input if text entered
                        if (text && index < 5) {
                          otpInputRefs.current[index + 1]?.focus();
                        }
                      }}
                      onKeyPress={({ nativeEvent }) => {
                        // Auto-focus previous input on backspace
                        if (nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
                          otpInputRefs.current[index - 1]?.focus();
                        }
                      }}
                      placeholderTextColor="#D1D5DB"
                    />
                  ))}
                </View>
              </View>

              <View style={styles.resendContainer}>
                {resendTimer > 0 ? (
                  <Text style={styles.timerText}>
                    Resend OTP in {resendTimer}s
                  </Text>
                ) : (
                  <TouchableOpacity onPress={handleResendOTP} disabled={loading}>
                    <Text style={styles.resendText}>
                      Didn't receive? <Text style={styles.resendLink}>Resend OTP</Text>
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, otp.length !== 6 && styles.buttonDisabled]}
                onPress={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>Verify & Continue</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.changeNumberButton}
                onPress={() => {
                  setStep('input');
                  setOtp('');
                  setResendTimer(0);
                }}
              >
                <Text style={styles.changeNumberText}>Change Phone Number</Text>
              </TouchableOpacity>
            </View>

            {/* Footer text */}
            <Text style={styles.footerText}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </>
        )}
      </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingCircle1: {
    position: 'absolute',
    top: '25%',
    left: '25%',
    width: 384,
    height: 384,
    borderRadius: 192,
    backgroundColor: 'rgba(192, 132, 252, 0.2)', // purple-400/20
    opacity: 0.6,
  },
  floatingCircle2: {
    position: 'absolute',
    bottom: '25%',
    right: '25%',
    width: 384,
    height: 384,
    borderRadius: 192,
    backgroundColor: 'rgba(96, 165, 250, 0.2)', // blue-400/20
    opacity: 0.5,
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 48,
    color: '#FFFFFF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#E9D5FF', // purple-100
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 448, // max-w-md
    alignSelf: 'center',
  },
  authCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 10,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827', // gray-900
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280', // gray-600
    textAlign: 'center',
  },
  phoneNumberDisplay: {
    fontWeight: '600',
    color: '#111827', // gray-900
  },
  otpIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EDE9FE', // purple-100 to blue-100 gradient approximation
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  otpIcon: {
    fontSize: 32,
    color: '#9333EA', // purple-600
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151', // gray-700
    marginBottom: 8,
  },
  labelCenter: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB', // gray-200
    height: 56,
    paddingHorizontal: 12,
  },
  phoneIcon: {
    fontSize: 20,
    marginRight: 8,
    color: '#9CA3AF', // gray-400
  },
  phoneInput: {
    flex: 1,
    fontSize: 18,
    color: '#111827',
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280', // gray-500
    marginTop: 8,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  otpInput: {
    width: 40,
    height: 52,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB', // gray-200
    backgroundColor: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: '#111827',
    marginHorizontal: 3,
  },
  otpInputFilled: {
    borderColor: '#9333EA', // purple-600 when filled
    backgroundColor: '#F5F3FF', // purple-50
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9333EA', // purple-600
    borderRadius: 9999, // rounded-full
    height: 56,
    marginTop: 8,
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  arrowIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  resendContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  timerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  resendText: {
    fontSize: 14,
    color: '#6B7280',
  },
  resendLink: {
    color: '#9333EA', // purple-600
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  changeNumberButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  changeNumberText: {
    fontSize: 14,
    color: '#6B7280', // gray-600
  },
  footerText: {
    fontSize: 12,
    color: '#E9D5FF', // purple-100
    textAlign: 'center',
    marginTop: 24,
  },
});

export default OTPAuthScreen;