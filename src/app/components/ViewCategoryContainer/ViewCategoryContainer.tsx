"use client";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";
import { useParams } from 'next/navigation';
import Navigation from "@/app/partials/Navigation";
import React, { useEffect } from "react";
import { RootState } from "@/app/store/store";
import { getTheme } from "@/app/store/reducers/theme";
import { useCategories } from "@/app/store/actions/categories";
import Breadcrumbs from "@/app/partials/Breadcrumb";
import ProductRating from "@/app/partials/ProductRating";
import ProductImage from "@/app/partials/ProductImage";
import ProductTitle from "@/app/partials/ProductTitle";
import ProductPrice from "@/app/partials/ProductPrice";
import Footer from "@/app/partials/Footer";
import Loading from "@/app/partials/Loading";


const ViewCategoryContainer = () => {
    const theme = useSelector((state: RootState) => state.theme);
    const dispatch = useDispatch();
    const params = useParams();
    const categories = useSelector((state: RootState) => state.categories);
    const { getCategoryProducts } = useCategories();
    const [loadingProducts, setLoadingProducts] = React.useState<boolean>(false);

    useEffect(() => {
        dispatch(getTheme());

        setLoadingProducts(true);
        getCategoryProducts(params?.id).then(() => {
            setLoadingProducts(false);
        });
    }, [params?.name, params?.id])

    return (
        <main className="w-full relative h-auto pb-12">
            <Head>
                <title>eShop - {params?.name}</title>
                <meta property="og:eShop-Cart" content="eShop - Cart" key="eShop-Cart" />
            </Head>
            <Navigation />

            {/* Brands Grids */}
            <div className="w-full max-w-6xl relative mx-auto p-4">
                <Breadcrumbs paths={[
                    { path: 'home', link: '/' },
                    { path: 'categories', link: '/brands' },
                    { path: params?.name, link: '/' }
                ]} />
                <h2 className="capitalize text-xl text-slate-700 font-bold py-8 p-0 dark:text-gray-300">
                    {
                        categories.categoryProducts.ProductCategory && categories.categoryProducts.ProductCategory.length > 0 ?
                            categories.categoryProducts?.name
                            : ''
                    }
                </h2>
                {
                    !loadingProducts ?
                        <div className={`w-full select-none relative grid ${categories.categoryProducts.ProductCategory && categories.categoryProducts.ProductCategory.length > 0 ? 'grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-1 md:gap-4`}>
                            {
                                categories.categoryProducts.ProductCategory && categories.categoryProducts.ProductCategory.length > 0 ?
                                    categories.categoryProducts.ProductCategory && categories.categoryProducts.ProductCategory.map((product: any, i: any) => {
                                        const price = product?.product?.price !== null ? parseFloat(product?.product?.price) : parseFloat(JSON.parse(product?.product?.attributes).price[0]);
                                        return <div key={i} className="object-cover rounded aspect-square shadow-md sm:hover:shadow-lg transition duration-20 scale-1 sm:hover:scale-105 rounded flex flex-col gap-2 p-2 justify-between items-start bg-white border border-slate-300 dark:border-slate-700 dark:bg-slate-800">
                                            <ProductImage category={product?.product?.categories[0].category.name} thumbnail={product?.product?.thumbnail} productId={product?.product?.id} productTitle={product?.product?.title} productDiscount={product?.product?.discount} />
                                            <h2 className="w-full block p-0 m-0 text-left flex flex-col gap-1 pt-2">
                                                <ProductRating rating={product?.product?.rating} />
                                                <ProductTitle category={product?.product?.categories[0].category.name} productId={product?.product?.id} productTitle={product?.product?.title} />
                                            </h2>

                                            <ProductPrice category={product?.product?.categories[0].category.name} productId={product?.product?.id} productTitle={product?.product?.title} productDiscount={product?.product?.discount} productPrice={price} attributes={product?.product?.attributes} />
                                        </div>
                                    })
                                    : <h2 className="text-xl w-full block text-center font-bold text-slate-600 dark:text-gray-400">
                                        No product found!
                                    </h2>
                            }
                        </div>
                        : <div className='w-full flex justify-center items-center'>
                            <Loading color='text-black text-opacity-10 fill-baby-blue' width={12} height={12} />
                        </div>
                }
            </div>
            <Footer />
        </main >
    )
}

export default ViewCategoryContainer;