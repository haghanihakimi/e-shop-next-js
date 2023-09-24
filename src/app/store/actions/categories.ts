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
            try {
                await http.get('/api/list-categories').then(response => {
                    switch (response.status) {
                        case 200:
                            dispatch(setCategories(response.data));
                            break;
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
                });
            } catch (error) {
                return Promise.resolve(error);
            }
        }
    }

    async function getCategoryProducts(categoryId: any) {

        try {
            await http.get('/api/category-products', {
                params: {
                    categoryId: categoryId,
                }
            }).then(response => {
                switch (response.status) {
                    case 200:
                        dispatch(setCategoryProducts(response.data));
                        break;
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
            });
        } catch (error) {
            return Promise.resolve(error);
        }
    }

    return {
        getCategories,
        getCategoryProducts,
    }
}