import axios from 'axios'

import { fillProductsList, fillSingleProduct, fillOutStock } from '../reducers/products';
import { deleteCartItem } from '../reducers/cart';
import { setRelatedProducts } from '../reducers/relatedProducts';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '../store';

export function useProducts() {
    const dispatch = useDispatch();
    const router = useRouter();
    const http = axios.create({
        baseURL: `http://localhost:3000`, //development
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
        },
        // withCredentials: true,
    });

    async function getProducts(page: number) {
        http.interceptors.response.use(function (response) {
            // Any status code that lie within the range of 2xx cause this function to trigger
            dispatch(fillProductsList(response.data));
            return response.data;
        }, function (error) {
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            switch (error.response.status) {
                case 401:
                    router.push(`/error/401?message=${error.response.data}&code=401`, { scroll: false });
                    break;
                case 404:
                    router.push(`/error/404?message=${error.response.data}&code=404`, { scroll: false });
                    break;
                case 405:
                    router.push(`/error/405?message=${error.response.data}&code=405`, { scroll: false });
                    break;
                case 500:
                    alert("OOPS! Sorry, something went wrong with loading this product.");
                    break;
                default:
                    break;
            }
            return Promise.resolve(error);
        })
        const response = await http.get('/api/products/allproducts', {
            params: {
                page: page || 50,
            }
        });
    }

    async function getSingleProduct(id: number) {
        http.interceptors.response.use(function (response) {
            // Any status code that lie within the range of 2xx cause this function to trigger
            dispatch(fillSingleProduct(response.data));
            return response.data;
        }, function (error) {
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            switch (error.response.status) {
                case 401:
                    router.push(`/error/401?message=${error.response.data}&code=401`, { scroll: false });
                    break;
                case 404:
                    router.push(`/error/404?message=${error.response.data}&code=404`, { scroll: false });
                    break;
                case 405:
                    router.push(`/error/405?message=${error.response.data}&code=405`, { scroll: false });
                    break;
                case 500:
                    alert("OOPS! Sorry, something went wrong with loading this product.");
                    break;
                default:
                    break;
            }
            return Promise.resolve(error);
        })
        const response = await http.get('/api/products/singleproduct', {
            params: {
                product: id || 1,
            }
        })
    }

    async function getRelatedProducts(categories: Array<any>) {
        http.interceptors.response.use(function (response) {
            // Any status code that lie within the range of 2xx cause this function to trigger
            dispatch(setRelatedProducts(response.data));
            return response.data;
        }, function (error) {
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            switch (error.response.status) {
                case 401:
                    router.push(`/error/401?message=${error.response.data}&code=401`, { scroll: false });
                    break;
                case 404:
                    router.push(`/error/404?message=${error.response.data}&code=404`, { scroll: false });
                    break;
                case 405:
                    router.push(`/error/405?message=${error.response.data}&code=405`, { scroll: false });
                    break;
                case 500:
                    alert("OOPS! Sorry, something went wrong with loading this product.");
                    break;
                default:
                    break;
            }
            return Promise.resolve(error);
        })
        const response = await http.get('/api/products/relatedproducts', {
            params: {
                categories: JSON.stringify(categories),
            },
        });
    }

    async function getProductStocks(products: Array<any>) {
        const storedCart = localStorage.getItem('cart');
        const cart = storedCart ? JSON.parse(storedCart) : [];

        http.interceptors.response.use(function (response) {
            // Any status code that lie within the range of 2xx cause this function to trigger
            dispatch(fillOutStock(response.data));
            if (response.data !== null || response.data.length > 0) {
                cart.forEach((item: any) => {
                    response.data.forEach((responseItem: any) => {
                        if (item.id === responseItem.id) {
                            dispatch(deleteCartItem(responseItem.id));
                        }
                    });
                });
            }
            return response.data;
        }, function (error) {
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            switch (error.response.status) {
                case 401:
                    router.push(`/error/401?message=${error.response.data}&code=401`, { scroll: false });
                    break;
                case 404:
                    router.push(`/error/404?message=${error.response.data}&code=404`, { scroll: false });
                    break;
                case 405:
                    router.push(`/error/405?message=${error.response.data}&code=405`, { scroll: false });
                    break;
                case 500:
                    alert("OOPS! Sorry, something went wrong with loading this product.");
                    break;
                default:
                    break;
            }
            return Promise.resolve(error);
        })

        const response = await http.get('/api/products/check-stock', {
            params: {
                products: JSON.stringify(products),
            },
        });
    }


    return {
        getProducts,
        getSingleProduct,
        getRelatedProducts,
        getProductStocks,
    }
}