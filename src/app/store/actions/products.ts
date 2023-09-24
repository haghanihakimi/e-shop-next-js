import axios from 'axios'
import { fillProductsList, fillSingleProduct, fillOutStock } from '../reducers/products';
import { deleteCartItem } from '../reducers/cart';
import { setRelatedProducts } from '../reducers/relatedProducts';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '../store';
import { getCookie } from 'cookies-next';

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
        try {
            await http.get('/api/products/allproducts', {
                params: {
                    page: page || 50,
                }
            }).then(response => {
                switch (response.status) {
                    case 200:
                        dispatch(fillProductsList(response.data));
                        break;
                    case 401:
                        router.push(`/error/401?message=${response.data}&code=401`, { scroll: false });
                        break;
                    case 404:
                        router.push(`/error/404?message=${response.data}&code=404`, { scroll: false });
                        break;
                    case 405:
                        router.push(`/error/405?message=${response.data}&code=405`, { scroll: false });
                        break;
                    case 500:
                        alert("OOPS! Sorry, something went wrong with loading this product.");
                        break;
                    default:
                        break;
                }
            });
        } catch (error) {
            return Promise.resolve(error);
        }
    }

    async function getSingleProduct(id: number) {
        try {
            await http.get('/api/products/singleproduct', {
                params: {
                    product: id || 1,
                }
            })
                .then(response => {
                    switch (response.status) {
                        case 200:
                            dispatch(fillSingleProduct(response.data));
                            break;
                        case 401:
                            router.push(`/error/401?message=${response.data}&code=401`, { scroll: false });
                            break;
                        case 404:
                            router.push(`/error/404?message=${response.data}&code=404`, { scroll: false });
                            break;
                        case 405:
                            router.push(`/error/405?message=${response.data}&code=405`, { scroll: false });
                            break;
                        case 500:
                            alert("OOPS! Sorry, something went wrong with loading this product.");
                            break;
                        default:
                            break;
                    }
                });
        } catch (error) {
            return Promise.resolve(error);
        }
    }

    async function getRelatedProducts(categories: Array<any>) {
        try {
            await http.get('/api/products/relatedproducts', {
                params: {
                    categories: JSON.stringify(categories),
                },
            }).then(response => {
                switch (response.status) {
                    case 200:
                        dispatch(setRelatedProducts(response.data));
                        break;
                    case 401:
                        router.push(`/error/401?message=${response.data}&code=401`, { scroll: false });
                        break;
                    case 404:
                        router.push(`/error/404?message=${response.data}&code=404`, { scroll: false });
                        break;
                    case 405:
                        router.push(`/error/405?message=${response.data}&code=405`, { scroll: false });
                        break;
                    case 500:
                        alert("OOPS! Sorry, something went wrong with loading this product.");
                        break;
                    default:
                        break;
                }
            });
        } catch (error) {
            return Promise.resolve(error);
        }
    }

    async function getProductStocks(products: Array<any>) {
        const storedCart = getCookie('cart');
        const cart = storedCart ? JSON.parse(storedCart) : [];

        try {
            await http.get('/api/products/check-stock', {
                params: {
                    products: JSON.stringify(products),
                },
            }).then(response => {
                switch (response.status) {
                    case 200:
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
                        break;
                    case 401:
                        router.push(`/error/401?message=${response.data}&code=401`, { scroll: false });
                        break;
                    case 404:
                        router.push(`/error/404?message=${response.data}&code=404`, { scroll: false });
                        break;
                    case 405:
                        router.push(`/error/405?message=${response.data}&code=405`, { scroll: false });
                        break;
                    case 500:
                        alert("OOPS! Sorry, something went wrong with loading this product.");
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
        getProducts,
        getSingleProduct,
        getRelatedProducts,
        getProductStocks,
    }
}