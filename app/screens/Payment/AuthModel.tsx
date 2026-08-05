import React, {
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { loginApi } from '../../Api/User';
import { navigate } from '../../Api/AuthEvents';

const AuthModal = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useImperativeHandle(ref, () => ({
    open: () => setVisible(true),
    close: () => setVisible(false),
  }));

  const closeModal = () => {
    setVisible(false);
    setError('');
  };

  const handleContinue = async () => {
    if (loading) return;
    setError('');

    const trimmedMobile = mobile.trim();

    if (!trimmedMobile) {
      setError('Please enter your mobile number');
      return;
    }
    if (!/^\d{10}$/.test(trimmedMobile.replace('+91', ''))) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      setLoading(true);

      const res = await loginApi({ mobile: trimmedMobile, role: 'USER' });
      const body = res?.data;

      if (body?.error) {
        setError(body.message || 'Login failed');
        return;
      }

      if (res?.otpRequired) {
        closeModal();
        navigate('VerifyOtp', {
          type: 'login',
          sessionToken: res.data.sessionToken,
          mobile: res.data.mobile,
        });
        return;
      }

      setError('Something went wrong, please try again');
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const goToSignup = () => {
    closeModal();
    navigate('SignUp');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={closeModal}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Login</Text>
            <TouchableOpacity onPress={closeModal}>
              <Feather name="x" size={22} />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Enter your mobile number. We'll send an OTP to confirm it's you.
          </Text>

          <View style={styles.inputBox}>
            <Feather name="phone" size={18} />
            <TextInput
              placeholder="Enter Mobile Number"
              style={styles.input}
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.loginBtn, loading && { opacity: 0.7 }]}
            onPress={handleContinue}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginText}>Continue</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={goToSignup}>
            <Text style={styles.signupText}>
              Don't have an account?{' '}
              <Text style={styles.signupLink}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
});

export default AuthModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    marginVertical: 15,
    fontSize: 14,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    marginLeft: 8,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  loginBtn: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  signupText: {
    textAlign: 'center',
    marginTop: 15,
  },
  signupLink: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});