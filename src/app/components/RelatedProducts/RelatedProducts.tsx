import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { useProducts } from '@/app/store/actions/products';
import ProductPrice from '@/app/partials/ProductPrice';
import ProductRating from '@/app/partials/ProductRating';
import ProductImage from "@/app/partials/ProductImage";
import ProductTitle from "@/app/partials/ProductTitle";

interface Props {
    categories: any,
}

const RelatedProducts: React.FC<Props> = ({ categories }) => {
    const relatedProducts = useSelector((state: RootState) => state.relatedProducts);
    const { getRelatedProducts } = useProducts();

    useEffect(() => {
        const loadRelatedProducts = async () => {
            await getRelatedProducts(categories);
        }

        loadRelatedProducts();
    }, [])

    return (
        <div className="w-full relative flex flex-col gap-4 border-t border-slate-200 p-2 dark:border-slate-800">
            <h2 className='w-full text-lg font-bold text-slate-800 dark:text-light-gray select-none'>
                Related Products
            </h2>
            <div className='w-full grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-4'>
                {
                    relatedProducts.relatedProducts && relatedProducts.relatedProducts.length > 0
                        ?
                        relatedProducts.relatedProducts.map((categories: any, i: any) => {
                            return categories.ProductCategory.map((product: any, j: any) => {
                                const price = product.product.price !== null ? parseFloat(product.product.price) : parseFloat(JSON.parse(product.product.attributes).price[0]);
                                return <div className='object-cover rounded aspect-square shadow-md sm:hover:shadow-lg transition duration-20 scale-1 sm:hover:scale-105 rounded flex flex-col gap-2 p-2 justify-between items-start bg-white border border-slate-300 dark:border-slate-700 dark:bg-slate-800' key={j}>
                                    <ProductImage category={categories.name} thumbnail={product.product.thumbnail} productId={product.product.id} productTitle={product.product.title} productDiscount={product.product.discount} />
                                    <h2 className="w-full block p-0 m-0 text-left flex flex-col gap-1 pt-2">
                                        <ProductRating rating={product.product.rating} />
                                        <ProductTitle category={categories.name} productId={product.product.id} productTitle={product.product.title} />
                                    </h2>
                                    <ProductPrice category={categories.name} productId={product.product.id} productTitle={product.product.title} productDiscount={product.product.discount} productPrice={price} attributes={product.product.attributes} />
                                </div>
                            })
                        })
                        : ''
                }
            </div>
        </div>
    );
}

export default RelatedProducts;