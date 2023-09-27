"use client";
import { useDispatch, useSelector } from "react-redux";
import Image from 'next/image';
import Link from "next/link";
import Head from "next/head";
import { useParams } from 'next/navigation';
import Navigation from "@/app/partials/Navigation";
import React, { useEffect } from "react";
import { RootState } from "@/app/store/store";
import { getTheme } from "@/app/store/reducers/theme";
import { useBrands } from "@/app/store/actions/brands";
import Breadcrumbs from "@/app/partials/Breadcrumb";
import ProductRating from "@/app/partials/ProductRating";
import ProductImage from "@/app/partials/ProductImage";
import ProductTitle from "@/app/partials/ProductTitle";
import ProductPrice from "@/app/partials/ProductPrice";
import Footer from "@/app/partials/Footer";
import Loading from "@/app/partials/Loading";


const ViewBrandContainer = () => {
    const theme = useSelector((state: RootState) => state.theme);
    const dispatch = useDispatch();
    const brand = useSelector((state: RootState) => state.brands);
    const params = useParams();
    const [loadingProducts, setLoadingProducts] = React.useState<boolean>(false);
    const { getBrandProducts } = useBrands();

    useEffect(() => {
        dispatch(getTheme());

        setLoadingProducts(true);
        getBrandProducts(params?.brand).then(() => {
            setLoadingProducts(false);
        });
    }, [params?.brand])

    return (
        <main className="w-full relative h-auto pb-12">
            <Navigation />

            {/* Brands Grids */}
            <div className="w-full max-w-6xl relative mx-auto p-4">
                <Breadcrumbs paths={[
                    { path: 'home', link: '/' },
                    { path: 'brands', link: '/brands' },
                    { path: brand.brandProducts.title, link: '' }
                ]} />
                <h2 className="text-xl text-slate-700 font-bold py-8 p-0 dark:text-gray-300">
                    {brand.brandProducts.title}
                </h2>
                {
                    !loadingProducts ?
                        <div className={`w-full select-none relative grid ${brand.brandProducts.products && brand.brandProducts.products.length > 0 ? 'grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-1 md:gap-4`}>
                            {
                                brand.brandProducts.products && brand.brandProducts.products.length > 0 ?
                                    brand.brandProducts.products.map((brand: any, i: any) => {
                                        const price = brand.price !== null ? parseFloat(brand.price) : parseFloat(JSON.parse(brand.attributes).price[0]);
                                        return <div key={i} className="object-cover rounded aspect-square shadow-md sm:hover:shadow-lg transition duration-20 scale-1 sm:hover:scale-105 rounded flex flex-col gap-2 p-2 justify-between items-start bg-white border border-slate-300 dark:border-slate-700 dark:bg-slate-800">
                                            <ProductImage category={brand.categories[0].category.name} thumbnail={brand.thumbnail} productId={brand.id} productTitle={brand.title} productDiscount={brand.discount} />
                                            <h2 className="w-full block p-0 m-0 text-left flex flex-col gap-1 pt-2">
                                                <ProductRating rating={brand.rating} />
                                                <ProductTitle category={brand.categories[0].category.name} productId={brand.id} productTitle={brand.title} />
                                            </h2>

                                            <ProductPrice category={brand.categories[0].category.name} productId={brand.id} productTitle={brand.title} productDiscount={brand.discount} productPrice={price} attributes={brand.attributes} />
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

export default ViewBrandContainer;