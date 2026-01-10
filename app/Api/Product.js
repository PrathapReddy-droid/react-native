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
    console.log(response)
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