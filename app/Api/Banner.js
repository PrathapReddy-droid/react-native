import apiClient from "./BASEURL";


export const HomeBanner = async () => {
  try {
    const response = await apiClient.get('/api/homeSlides');
    return response.data; // return only useful data
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
};


export const brandbanner = async () => {
  try {
    const response = await apiClient.get('/api/category');
    return response.data; // return only useful data
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
};

export const absDatabanner = async () => {
  try {
    const response = await apiClient.get('/api/bannerV1');
    return response.data; // return only useful data
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
};

export const abs2Databanner = async()=>{
  try {
  const response = await apiClient.get('/api/bannerList2')
  return response.data
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