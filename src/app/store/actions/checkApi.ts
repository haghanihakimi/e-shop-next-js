import axios from 'axios'
import { useDispatch } from 'react-redux';
import { setCourier, setUploadthing } from '../reducers/checkApi';

export function useCheckApis() {
    const dispatch = useDispatch();
    const http = axios.create({
        baseURL: `http://localhost:3000`, //development
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            // "Content-Type": "multipart/form-data",
            Accept: "application/json",
        },
        // withCredentials: true,
    });

    async function checkUploadthingApi() {
        http.interceptors.response.use(function (response) {
            dispatch(setUploadthing(response.data));
            return response.data;
        }, function (error) {
            switch (error.response.status) {
                case 401:
                    break;
                case 404:
                    break;
                case 405:
                    break;
                case 500:
                    break;
                default:
                    break;
            }
            return Promise.resolve(error);
        });

        const response = await http.get('/api/check-uploadthing-key');
    }

    return {
        checkUploadthingApi,
    }
}