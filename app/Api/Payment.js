import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "./BASEURL";

export const creatPayment = async (paymentId) => {
  try {
    const token = await AsyncStorage.getItem("AccessToken");
    console.log("Token:", token);

    const response = await apiClient.post(
      "/api/payment/create",
      { paymentId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("RAW AXIOS RESPONSE:", response);
    console.log("RESPONSE DATA:", response.data);

    return response;

  } catch (error) {
    console.log("Create Payment API Error:");
    console.log("Status:", error?.response?.status);
    console.log("Data:", error?.response?.data);
    console.log("Message:", error.message);

    throw error;
  }
};
