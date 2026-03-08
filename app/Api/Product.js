import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "./BASEURL";

export const productList =async(id)=>{
  const token = await AsyncStorage.getItem('AccessToken')
      try {
    const response = await apiClient.get(`/api/product/getAllProductsByCatId/${id}`,{
           headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response.products,"=========================here i am calling")
    return response.products; // return only useful data
  } catch (error) {
    console.error('Home API Error:', {
      url: error?.config?.baseURL + error?.config?.url,
      status: error?.response?.status,
      data: error?.response?.data,
      message: error.message,
    });

    // rethrow so caller can handle it
    throw error;
  }
}
export const productdelieverytime = async(payload)=>{
  const token = await AsyncStorage.getItem('AccessToken')
  try{
    const response = await apiClient.post(`/api/product/getDeliverytime`,
           { ...payload },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(response, "===== cancel order response");
    return response;
  }catch(error){
    return error
    
  }
}
export const VideoApi = async()=>{
    const token = await AsyncStorage.getItem('AccessToken')

    try{
    
    const response = await apiClient.get(`api/product/videos`,{
           headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
      
    )
    console.log(response,"============================================>>>>>")
    return response

  }catch(error){
    console.error('Home API Error:', {
      url: error?.config?.baseURL + error?.config?.url,
      status: error?.response?.status,
      data: error?.response?.data,
      message: error.message,
    });

    // rethrow so caller can handle it
    throw error;
  }

}
export const productreview =async(projectId)=>{
        const token = await AsyncStorage.getItem('AccessToken');

  try{
    
    const response = await apiClient.get(`/api/user/getReviews?productId=${projectId}`,{
           headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
      
    )
    return response

  }catch(error){
    console.error('Home API Error:', {
      url: error?.config?.baseURL + error?.config?.url,
      status: error?.response?.status,
      data: error?.response?.data,
      message: error.message,
    });

    // rethrow so caller can handle it
    throw error;
  }
}
export const OrderCreate = async(data)=>{
  console.log(data)
      const token = await AsyncStorage.getItem('AccessToken');
      try{

  const response = await apiClient.post('/api/order/create',
          data, // ✅ BODY
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      

  })
  console.log(response,"==========================")
  return response
  }catch(error){
   console.error('Home API Error:', {
      url: error?.config?.baseURL + error?.config?.url,
      status: error?.response?.status,
      data: error?.response?.data,
      message: error.message,
    });

    // rethrow so caller can handle it
    throw error;
  }
}

export const getOrder = async()=>{
  const token = await AsyncStorage.getItem('AccessToken')
  try{
  const response = await apiClient.get('/api/order/order-list/orders?page=1&limit=5',{
          headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
  })
  return response
  }catch(error){
   console.error('Home API Error:', {
      url: error?.config?.baseURL + error?.config?.url,
      status: error?.response?.status,
      data: error?.response?.data,
      message: error.message,
    });

    // rethrow so caller can handle it
    throw error;
  }
}
export const submitReview = async (payload) => {
  try {
    const token = await AsyncStorage.getItem('AccessToken');

    if (!token) {
      throw new Error('Access token not found');
    }

    const response = await apiClient.post(
      `/api/user/addReview`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response,"================>>>>")

    return response.data;
  } catch (error) {
    console.log(
      'Submit Review API Error:',
      error?.response?.data || error.message
    );
    throw error;
  }
};


export const cancelOrder = async (order_id) => {
  const token = await AsyncStorage.getItem('AccessToken');

  try {
    const response = await apiClient.post(
      '/api/order/cancel-order',
      { ...order_id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(response, "===== cancel order response");
    return response;

  } catch (error) {

    console.log('Cancel Order API Error:', {
      url: error?.config?.baseURL + error?.config?.url,
      status: error?.response?.status,
      data: error?.response?.data,
      message: error.message,
    });

    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong"
    };
  }
};
export const TracOrder = async (order_id) => {
  const token = await AsyncStorage.getItem('AccessToken');
  console.log(token,"===========================")

  try {
    const response = await apiClient.post(
      '/api/order/track-order',
      { ...order_id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(response, "===== cancel order response");
    return response;

  } catch (error) {

    console.log('Cancel Order API Error:', {
      url: error?.config?.baseURL + error?.config?.url,
      status: error?.response?.status,
      data: error?.response?.data,
      message: error.message,
    });

    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong"
    };
  }
};
export const returnOrder = async(payload)=>{
  const token = await AsyncStorage.getItem('AccessToken');
  console.log(token,"===========================")

  try {
    const response = await apiClient.post(
      '/api/order/order/return',
      { ...payload },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(response, "===== cancel order response");
    return response;

  } catch (error) {

    console.log('Cancel Order API Error:', {
      url: error?.config?.baseURL + error?.config?.url,
      status: error?.response?.status,
      data: error?.response?.data,
      message: error.message,
    });

    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong"
    };
  }
}