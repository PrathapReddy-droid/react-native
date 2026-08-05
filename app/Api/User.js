import { Alert } from 'react-native';
import apiClient from '../Api/BASEURL';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loginApi = async (data) => {
  try {
    console.log(data, "==========================>>>>")
    const response = await apiClient.post('/api/user/login', data);
    console.log(response, "==========================>>>>")


    return response;
  } catch (error) {
    // ✅ TAKE STRING MESSAGE ONLY
    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Something went wrong';

    Alert.alert('Error', errorMessage, [{ text: 'OK' }]);
    throw error

  }
};
export const registerApi = async (data) => {
  console.log(data, "==========================>>>>")
  try {
    const response = await apiClient.post('/api/user/register', data);
    return response;
  } catch (error) {
    console.log('Register API Error:', error.response?.data || error.message);
    throw error; // IMPORTANT: rethrow
  }
};
export const AddressApi = async () => {
  const token = await AsyncStorage.getItem('AccessToken')
  console.log(token)
  try {
    const response = await apiClient.get('/api/user/user-details', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log(response)
    return response;
  } catch (error) {
    console.log('Register API Error:', error.response?.data || error.message);
    throw error; // IMPORTANT: rethrow
  }
}
export const FcmToken = async (data) => {
  try {

    const response = await apiClient.post('/api/user/updateFCM-token', {
      ...data,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response
    console.log(response)
  } catch (error) {
    console.log('Register API Error:', error.response?.data || error.message);
    throw error; // IMPORTANT: rethrow
  }

}
export const VerifyEmailApi = async (data) => {
  try {
    const response = await apiClient.post('/api/user/verifyEmail', {
      ...data,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(response)
    return response;
  } catch (error) {
    console.log('Register API Error:', error.response?.data || error.message);
    throw error; // IMPORTANT: rethrow
  }

}

export const PostAddressApi = async (data) => {
  try {
    const token = await AsyncStorage.getItem('AccessToken');

    const response = await apiClient.post(
      '/api/address/add',
      data, // ✅ BODY
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response;
  } catch (error) {
    console.log('addd API Error:', error.response?.data || error.message);
    throw error;
  }
};


export const getUserDetails = async () => {
  try {
    const token = await AsyncStorage.getItem('AccessToken');

    const response = await apiClient.get(
      '/api/user/user-details',
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response;
  } catch (error) {
    console.log('addd API Error:', error.response?.data || error.message);
    throw error;
  }
}
// src/api/authApi.ts





export const verifyLoginOtpApi = async (data) => {
  console.log(data)
  // data = { otp, sessionToken }
  try {
    const response = await apiClient.post('/api/user/verify-login-otp', data);
    return response;
  } catch (error) {
    console.log('verifyLoginOtpApi Error:', error.response?.data || error.message);
    throw error;
  }
};

export const forgotPasswordApi = async (data) => {
  // data = { email }
  try {
    console.log(data)
    // adjust path to match your actual route for forgotPasswordController
    const response = await apiClient.post('/api/user/forgot-password', data);
    console.log(response, "=========>>>>>>>>>>>")
    return response;
  } catch (error) {
    console.log('forgotPasswordApi Error:', error.response?.data || error.message);
    throw error;
  }
};

export const verifyForgotPasswordOtpApi = async (data) => {
  // data = { email, otp }
  try {
    // adjust path to match your actual route for verifyForgotPasswordOtp
    const response = await apiClient.post('/api/user/verify-forgot-password-otp', data);
    console.log(response)
    return response;
  } catch (error) {
    console.log('verifyForgotPasswordOtpApi Error:', error.response?.data || error.message);
    throw error;
  }
};