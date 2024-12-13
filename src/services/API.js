import axios from 'axios';
import { store } from '../redux/store';

class API {
  static baseURL = process.env.REACT_APP_API_BASE_URL;

  static async getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    const state = store.getState();
    const token = state.auth.token;
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }

  static async get(endpoint, params = {}) {
    const url = new URL(`${this.baseURL}${endpoint}`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    const headers = await this.getHeaders();

    const response = await axios.get(url.toString(), {
        headers: headers
    });

    return response.data;
  }

  static async post(endpoint, data) {
    const headers = await this.getHeaders();
    const response = await axios.post(`${this.baseURL}${endpoint}`, data, {
        headers: headers,
    });
    return response.data;

  }

  static async put(endpoint, data) {
    const headers = await this.getHeaders();
    const response = await axios.put(`${this.baseURL}${endpoint}`, data, {
        headers: headers,
    });
    return response.data;

  }

  static async delete(endpoint) {
    const headers = await this.getHeaders();
    const response = await axios.delete(`${this.baseURL}${endpoint}`, {
        headers: headers,
    });
    return response.data;
  }
}


export default API;
