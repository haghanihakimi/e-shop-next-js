"use client";
import Image from "next/image";
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from "react-redux";
import Navigation from "@/app/partials/Navigation";
import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import './page.css';
import { FreeMode, Navigation as SwiperNav, Thumbs } from "swiper";
import { getTheme } from "@/app/store/reducers/theme";
import {
  HiArrowsUpDown as SortIcon,
} from "react-icons/hi2";
import { useProducts } from '@/app/store/actions/products';
import Loading from "@/app/partials/Loading";
import Breadcrumbs from "@/app/partials/Breadcrumb";
import Footer from "@/app/partials/Footer";
import { RootState } from '@/app/store/store';
import Link from "next/link";
import DimensionsAttr from "@/app/partials/DimensionsAttr";
import ColorsAttr from "@/app/partials/ColorsAttr";
import CapacityAttr from "@/app/partials/CapacityAttr";

export default function HomeContainer() {
  const products = useSelector((state: RootState) => state.products);
  const dispatch = useDispatch();
  const params = useParams()
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [fetchingProduct, setFetchingProduct] = useState(false);
  const { getSingleProduct } = useProducts();


  const convertRating = (rating: number) => {
    return (rating / 5) * 100;
  }

  const discountCalculator = (price: any, discount: any) => {
    if (discount && discount > 0) {
      const discountDecimal = discount / 100;

      const discountAmount = price * discountDecimal;

      const salePrice = price - discountAmount;

      return salePrice;
    }
    return 0;
  }

  useEffect(() => {
    dispatch(getTheme());

    const loadSingleProduct = async () => {
      setFetchingProduct(true);
      await getSingleProduct(params ? Number(params.product) : 1)
        .then(() => {
          setFetchingProduct(false);
        });
    }


    loadSingleProduct();
  }, [])

  return (
    <main className="w-full relative h-auto pb-12">
      <Navigation />

      {
        fetchingProduct
          ? <div className='w-full p-8 flex justify-center items-center'>
            <Loading color='text-black text-opacity-10 fill-baby-blue' width={6} height={6} />
          </div>
          : <div className="w-full max-w-7xl relative m-auto p-2 md:p-8 text-sm p-4">
            {
              products.singleProduct && Object.keys(products.singleProduct).length > 0
                ?
                <div className="w-full flex flex-col gap-4">
                  <Breadcrumbs paths={[
                    { path: 'home', link: '/' },
                    { path: 'shop', link: '/shop' },
                    // { path: products.singleProduct.categories[0].category.name, link: '/view/category' },
                    ...products.singleProduct.categories.map((category: any, i: any) => {
                      return { path: category.category.name, link: `/` }
                    }),
                    { path: products.singleProduct.title }
                  ]} />
                  {/* product image and attributes summar container */}
                  <div className="w-full flex flex-row gap-6 sm:grap-12 flex-wrap">
                    {/* Product image container */}
                    <div className="w-full max-w-lg max-h-[600px] min-w-[280px] flex-1 grow p-2 border border-slate-300 flex flex-col gap-2 justify-start p-0 m-0 rounded shadow-lg select-none dark:border-slate-800">
                      <Swiper
                        loop={true}
                        spaceBetween={10}
                        navigation={true}
                        thumbs={{ swiper: thumbsSwiper }}
                        modules={[FreeMode, SwiperNav, Thumbs]}
                        className="mySwiper2 rounded">
                        {
                          products.singleProduct.images && JSON.parse(products.singleProduct.images).length > 0
                            ? JSON.parse(products.singleProduct.images).map((image: any, i: any) => {
                              return <SwiperSlide key={i}>
                                <Image src={image}
                                  width={500}
                                  height={500}
                                  alt='something'
                                  className='rounded w-full min-h-[400px] object-cover' />
                              </SwiperSlide>
                            })
                            : ''
                        }
                      </Swiper>
                      <Swiper
                        // onSwiper={setThumbsSwiper}
                        loop={true}
                        spaceBetween={6}
                        slidesPerView={4}
                        freeMode={true}
                        watchSlidesProgress={true}
                        modules={[FreeMode, SwiperNav, Thumbs]}
                        className="mySwiper flex flex-row justify-start items-center gap-0 rounded">
                        {
                          products.singleProduct.images && JSON.parse(products.singleProduct.images).length > 0
                            ? JSON.parse(products.singleProduct.images).map((image: any, i: any) => {
                              return <SwiperSlide key={i}>
                                <Image src={image}
                                  width={500}
                                  height={500}
                                  alt='something'
                                  className='rounded w-full object-cover' />
                              </SwiperSlide>
                            })
                            : ''
                        }
                      </Swiper>
                    </div>

                    {/* Product short description attributes summary container */}
                    <div className="w-full min-w-[280px] relative flex flex-col gap-2 flex-1 grow">
                      {/* Product title */}
                      <h2 className="w-full text-lg font-bold tracking-wide text-slate-700 dark:text-light-gray">
                        {products.singleProduct.title}
                      </h2>

                      {/* Product price */}
                      <h4 className="w-full text-lg font-bold tracking-wider text-slate-800 flex flex-row gap-1 dark:text-light-gray">
                        $250.00
                      </h4>

                      {/* product short description */}
                      {
                        products.singleProduct.shortDescription && products.singleProduct.shortDescription.length > 0
                          ?
                          <div className="w-full mt-6 flex flex-col gap-2 text-base text-slate-700 dark:text-light-gray">
                            <strong className="tracking-wide">Short Description:</strong>
                            <article className="font-medium">
                              {products.singleProduct.shortDescription}
                            </article>
                          </div>
                          : ''
                      }

                      {/* Show dropdown if "dimensions" exists in the attributes */}
                      {
                        products.singleProduct.attributes !== null && JSON.parse(products.singleProduct.attributes).hasOwnProperty('dimensions')
                          ?
                          <DimensionsAttr data={products.singleProduct} />
                          : ''
                      }

                      {/* Show dropdown if "colors" exists in the attributes */}
                      {
                        products.singleProduct.attributes !== null && JSON.parse(products.singleProduct.attributes).hasOwnProperty('colors')
                          ?
                          <ColorsAttr data={products.singleProduct} />
                          : ''
                      }
                      
                      {/* Show dropdown if "colors" exists in the attributes */}
                      {
                        products.singleProduct.attributes !== null && JSON.parse(products.singleProduct.attributes).hasOwnProperty('capacity')
                          ?
                          <CapacityAttr data={products.singleProduct} />
                          : ''
                      }

                      {/* Product meta data */}
                      {
                        products.singleProduct.brand && Object.keys(products.singleProduct.brand).length > 0
                          ?
                          <div className="w-full mt-3 flex flex-row gap-1 items-center text-base text-slate-700 dark:text-light-gray">
                            <strong>Brand:</strong>
                            <Link href='#' target="_self"
                              className="text-blue-600 font-semibold">
                              {products.singleProduct.brand.title}
                            </Link>
                          </div>
                          : ''
                      }


                      {
                        products.singleProduct.categories && products.singleProduct.categories.length > 0
                          ?
                          products.singleProduct.categories.map((category: any, i: any) => {
                            return <div key={i} className="w-full flex flex-row gap-1 items-center text-base text-slate-700 dark:text-light-gray">
                              <strong>Category:</strong>
                              <Link href='#' target="_self"
                                className="text-blue-600 font-semibold">
                                {category.category.name}
                              </Link>
                              {
                                i === products.singleProduct.categories.length - 1
                                  ? ''
                                  : <span>, </span>
                              }
                            </div>
                          })
                          : ''
                      }
                    </div>
                  </div>

                  {/* Product description and specifications */}
                </div>
                : ''
            }

            <Footer />
          </div>
      }
    </main >
  )
}
