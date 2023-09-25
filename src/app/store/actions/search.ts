import axios from 'axios'
import { useDispatch } from 'react-redux';
import { fillSearchResults } from '../reducers/search';
import { toast } from 'react-toastify';

export function useSearch() {
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

    async function searchProducts(data: any) {
        try {
            const response = await http.get('/api/search', {
                params: {
                    search: data,
                }
            });
            dispatch(fillSearchResults(response.data));

        } catch (error: any) {
            switch (error.response.status) {
                case 401:
                    toast.error(error.response.data);
                    break;
                case 409:
                    toast.error(error.response.data);
                    break;
                case 405:
                    toast.error("Internal server error!");
                    break;
                case 500:
                    toast.error(error.response.data);
                    break;
                default:
                    break;
            }
            return Promise.resolve(error);
        }


    }

    return {
        searchProducts,
    }
}