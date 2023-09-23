import axios from 'axios'
import { setBrands, setBrandProducts } from '../reducers/brands';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '../store';

export function useBrands() {
    const dispatch = useDispatch();
    const brands = useSelector((state: RootState) => state.brands);
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

    async function getBrands() {
        if (brands.brands && brands.brands.length <= 0) {
            http.interceptors.response.use(function (response) {
                dispatch(setBrands(response.data));
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
                        alert("OOPS! Sorry, something went wrong with fetching list of brands.");
                        break;
                    default:
                        break;
                }
                return Promise.resolve(error);
            });

            const response = await http.get('/api/list-brands');
        }
    }

    async function getBrandProducts(brandId: any) {
            http.interceptors.response.use(function (response) {
                dispatch(setBrandProducts(response.data));
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
                        alert("OOPS! Sorry, something went wrong with fetching brands and products.");
                        break;
                    default:
                        break;
                }
                return Promise.resolve(error);
            });

            const response = await http.get('/api/brand-products', {
                params: {
                    brandId: brandId,
                }
            });
    }

    return {
        getBrands,
        getBrandProducts,
    }
}