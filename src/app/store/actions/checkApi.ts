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
        try {
            await http.get('/api/check-uploadthing-key')
                .then(response => {
                    dispatch(setUploadthing(response.data));
                });
        } catch (error: any) {
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
        }
    }

    async function checkFastCourierApi() {
        try {
            await http.get('/api/check-fast-courier-key')
                .then(response => {
                    dispatch(setCourier(response.data));
                });
        } catch (error: any) {
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
        }
    }

    return {
        checkUploadthingApi,
        checkFastCourierApi
    }
}