import axios from 'axios';

const ApiManager = axios.create({
    baseURL: 'https://some-domain.com/api/',
    responseType:'json',
    withCredentials: true,
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'}
  });