

import axios from 'axios';
import { buildPurpose } from '@/constants';

const createRequestInterceptor = () => config => ({
  ...config,
  ...(buildPurpose === 'dev' ? {} : { withCredentials: true }),
});
const requestInterceptor = createRequestInterceptor();
axios.interceptors.request.use(requestInterceptor);
