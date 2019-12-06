import axios from 'axios';

const createRequestInterceptor = () => config => ({
  ...config,
  withCredentials: true,
});
const requestInterceptor = createRequestInterceptor();
axios.interceptors.request.use(requestInterceptor);
