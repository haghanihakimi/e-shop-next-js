import axios from 'axios'
import { setCategories, setCategoryProducts } from '../reducers/categories';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '../store';

export function useCategories() {
    const dispatch = useDispatch();
    const categories = useSelector((state: RootState) => state.categories);
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

    async function getCategories() {
        if (categories.categories && categories.categories.length <= 0) {
            http.interceptors.response.use(function (response) {
                dispatch(setCategories(response.data));
                return response.data;
            }, function (error) {
                switch (error.response.status) {
                    case 401:
                        router.push(`/error/401?&code=401`, { scroll: false });
                        break;
                    case 405:
                        router.push(`/error/405?&code=405`, { scroll: false });
                        break;
                    case 500:
                        alert("OOPS! Sorry, something went wrong with fetching list of categories.");
                        break;
                    default:
                        break;
                }
                return Promise.resolve(error);
            });

            const response = await http.get('/api/list-categories');
        }
    }

    async function getCategoryProducts(categoryId: any) {
        http.interceptors.response.use(function (response) {
            dispatch(setCategoryProducts(response.data));
            return response.data;
        }, function (error) {
            switch (error.response.status) {
                case 401:
                    router.push(`/error/401?&code=401`, { scroll: false });
                    break;
                case 405:
                    router.push(`/error/405?&code=405`, { scroll: false });
                    break;
                case 500:
                    alert("OOPS! Sorry, something went wrong with fetching list of category products.");
                    break;
                default:
                    break;
            }
            return Promise.resolve(error);
        });

        const response = await http.get('/api/category-products', {
            params: {
                categoryId: categoryId,
            }
        });
    }

    return {
        getCategories,
        getCategoryProducts,
    }
}