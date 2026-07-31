import apiClient from "./BASEURL";


export const HomeBanner = async () => {
  try {
    const response = await apiClient.get('/api/homeSlides', {
      skipAuthModal: true,
    });
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
    const response = await apiClient.get('/api/category', {
      skipAuthModal: true,
    });
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
    const response = await apiClient.get('/api/bannerV1', {
      skipAuthModal: true,
    });
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

export const abs2Databanner = async () => {
  try {
    const response = await apiClient.get('/api/bannerList2', {
      skipAuthModal: true,
    });
    return response.data;
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