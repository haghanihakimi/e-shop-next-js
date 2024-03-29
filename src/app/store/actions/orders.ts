import axios from 'axios'
import { fillOutStock } from '../reducers/products';
import { setOrders, setAllOrders } from '../reducers/orders';
import { deleteCartItem, emptyCart } from '../reducers/cart';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { getCookie } from 'cookies-next';

export function useOrders() {
    const dispatch = useDispatch();
    const orders = useSelector((state: RootState) => state.orders);
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

    async function placeOrder(order: any) {
        const storedCart = getCookie('cart');
        const cart = storedCart ? JSON.parse(storedCart) : [];

        try {
            await http.post('/api/orders/placeorder', order)
                .then(response => {
                    if (response.data.stockError) {
                        dispatch(fillOutStock(response.data.stock));
                        if (response.data.stock && response.data.stock.length > 0) {
                            for (let i = 0; i < cart.length; i++) {
                                for (let j = 0; j < response.data.stock.length; j++) {
                                    if (cart[i].id === response.data.stock[j].id) {
                                        dispatch(deleteCartItem(response.data.stock[j].id));
                                        break;
                                    }
                                }
                            }
                        }
                        return;
                    }
                    if (response.data.complete) {
                        router.push(`/order/complete/${response.data.order.id}`);
                    }
                });
        } catch (error: any) {
            switch (error.response.status) {
                case 401:
                    toast.error(error.response.data);
                    break;
                case 404:
                    toast.error(error.response.data);
                    break;
                case 405:
                    toast.error(error.response.data);
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

    async function successfulPayment(orderId: any) {
        if (orders.orders && Object.keys(orders.orders).length <= 0) {
            try {
                await http.get('/api/orders/successful-payment', {
                    params: {
                        orderId: orderId
                    }
                }).then(response => {
                    dispatch(setOrders(response.data.data));
                    console.log(response.data.data);
                });
            } catch (error: any) {
                switch (error.response.status) {
                    case 401:
                        router.push(`/error/401?message=${error.response.data.data}&code=401`, { scroll: false });
                        break;
                    case 404:
                        router.push(`/error/404?message=${error.response.data.data}&code=404`, { scroll: false });
                        break;
                    case 405:
                        router.push(`/error/405?message=${error.response.data.data}&code=405`, { scroll: false });
                        break;
                    case 500:
                        toast.error("OOPS! Sorry, something went wrong with loading your order.");
                        break;
                    default:
                        break;
                }
                return Promise.resolve(error);
            }
        }
    }

    async function allUserOrders() {
        if (orders.allOrders && orders.allOrders.length <= 0) {
            try {
                await http.get('/api/orders/all-orders')
                    .then(response => {
                        dispatch(setAllOrders(response.data));
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
                    toast.error("OOPS! Sorry, something went wrong with loading your order.");
                    break;
                default:
                    break;
            }
                return Promise.resolve(error);
            }
        }
    }

    return {
        placeOrder,
        successfulPayment,
        allUserOrders,
    }
}