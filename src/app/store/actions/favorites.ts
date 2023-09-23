import axios from 'axios'
import { fillFavorites, updateFavoritesList } from '../reducers/favorites';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '../store';
import { toast } from 'react-toastify';

export function useFavorites() {
    const dispatch = useDispatch();
    const favorites = useSelector((state: RootState) => state.favorites);
    const router = useRouter();
    const http = axios.create({
        baseURL: `http://localhost:3000`, //development
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            // "Content-Type": "multipart/form-data",
            Accept: "application/json",
        },
        // withCredentials: true,
    });

    async function getFavorites() {
        if (favorites.favorites && favorites.favorites.length <= 0) {
            http.interceptors.response.use(function (response) {
                // Any status code that lie within the range of 2xx cause this function to trigger
                dispatch(fillFavorites(response.data));
                return response.data;
            }, function (error) {
                // Any status codes that falls outside the range of 2xx cause this function to trigger
                switch (error.response.status) {
                    case 401:
                        router.push(`/error/401?&code=401`, { scroll: false });
                        break;
                    case 405:
                        router.push(`/error/405?&code=405`, { scroll: false });
                        break;
                    case 500:
                        alert("OOPS! Sorry, something went wrong with fetching favorite items.");
                        break;
                    default:
                        break;
                }
                return Promise.resolve(error);
            });

            const response = await http.get('/api/favorites/fetch/favorites');
        }
    }

    async function updateFavorites(Ids: any = {productId: 0,brandId: 0}) {
        http.interceptors.response.use(function (response) {
            dispatch(updateFavoritesList({product: response.data, productId: Ids.productId}));
            return response.data;
        }, function (error) {
            switch (error.response.status) {
                case 401:
                    router.push(`/error/401?&code=401`, { scroll: false });
                    break;
                case 405:
                    router.push(`/error/405?&code=405`, { scroll: false });
                    break;
                case 429:
                    toast.error("Oops! Slow down a bit. You've sent too many requests! Please wait a minute and try again.");
                    break;
                case 500:
                    toast.error("OOPS! Sorry, something went wrong with fetching favorite items.");
                    break;
                default:
                    break;
            }
            return Promise.resolve(error);
        });

        const response = await http.post('/api/favorites/update/favorites', Ids);
    }

    return {
        getFavorites,
        updateFavorites,
    }
}