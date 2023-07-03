import axios from 'axios'

import { fillProductsList, fillSingleProduct } from '../reducers/products';
import { useDispatch } from 'react-redux';

export function useProducts() {
    const dispatch = useDispatch();

    async function getProducts(page: number) {
        await axios.get('/api/products/allproducts', {
            params: {
                page: page || 50,
            }
        })
            .then(response => {
                if (response.status !== 200) {
                    alert("Unable to fetch products.");
                    return;
                }
                dispatch(fillProductsList(response.data));
            });
    }

    async function getSingleProduct(id: number) {
        await axios.get('/api/products/singleproduct', {
            params: {
                product: id || 1,
            }
        })
            .then(response => {
                if (response.status !== 200) {
                    alert("Unable to fetch product.");
                    return;
                }
                dispatch(fillSingleProduct(response.data));
            });
    }


    return {
        getProducts,
        getSingleProduct,
    }
}