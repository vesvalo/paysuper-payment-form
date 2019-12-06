import axios from 'axios';

const createSetAuthInterceptor = () => config => ({
  ...config,
  withCredentials: true,
});
const setAuthCb = createSetAuthInterceptor();
axios.interceptors.request.use(setAuthCb);
