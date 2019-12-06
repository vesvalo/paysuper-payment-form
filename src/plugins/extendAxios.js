import axios from 'axios';

export const buildPurpose = process.env.VUE_APP_BUILD_PURPOSE;

export default function extendAxios() {
  const createSetAuthInterceptor = () => config => ({
    ...config,
    withCredentials: true,
  });
  const setAuthCb = createSetAuthInterceptor();
  axios.interceptors.request.use(setAuthCb);
}
