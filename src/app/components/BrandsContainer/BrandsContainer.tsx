"use client";
import { useDispatch, useSelector } from "react-redux";
import Image from 'next/image';
import Link from "next/link";
import Head from "next/head";
import Navigation from "@/app/partials/Navigation";
import React, { useEffect } from "react";
import { RootState } from "@/app/store/store";
import { getTheme } from "@/app/store/reducers/theme";
import Footer from "@/app/partials/Footer";
import { useBrands } from "@/app/store/actions/brands";
import Loading from "@/app/partials/Loading";


const BrandsContainer = () => {
    const theme = useSelector((state: RootState) => state.theme);
    const brands = useSelector((state: RootState) => state.brands);
    const [loadingBrands, setLoadingBrands] = React.useState<boolean>(false);
    const dispatch = useDispatch();
    const { getBrands } = useBrands();

    useEffect(() => {
        dispatch(getTheme());
        setLoadingBrands(true);
        getBrands().then(() => {
            setLoadingBrands(false)
        });
    }, [])

    return (
        <main className="w-full relative h-auto pb-12">
            <Head>
                <title>eShop - Brands</title>
                <meta property="og:eShop-Cart" content="eShop - Cart" key="eShop-Cart" />
            </Head>
            <Navigation />

            {/* Brands Grids */}
            <div className="w-full max-w-6xl relative mx-auto p-4">
                {
                    !loadingBrands ?
                        <div className={`w-full relative grid ${brands.brands && brands.brands.length > 0 ? 'grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-1 md:gap-4`}>
                            {
                                brands.brands && brands.brands.length > 0 ?
                                    brands.brands.map((brand: any, i: any) => {
                                        return <div key={i} className="w-full select-none max-w-xs h-auto border border-gray-200 rounded shadow-md dark:bg-slate-800 dark:border-slate-800">
                                            <Link href={`/brand/${brand.id}`}
                                                className="relative p-4 flex flex-col gap-4 items-center justify-center">
                                                <Image src={brand.logo}
                                                    alt="Apple image"
                                                    width={120}
                                                    height={120}
                                                    className="object-cover rounded" />
                                                <h2 className="text-center text-lg text-slate-700 font-bold px-2 dark:text-gray-300">
                                                    {brand.title}
                                                </h2>
                                            </Link>
                                        </div>
                                    })
                                    : <h2 className="text-xl w-full block text-center font-bold text-slate-600 dark:text-gray-400">
                                        No brand found!
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

export default BrandsContainer;