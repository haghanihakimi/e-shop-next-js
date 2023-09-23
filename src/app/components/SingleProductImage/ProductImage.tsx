import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import './ProductImage.css';
import { FreeMode, Navigation as SwiperNav, Thumbs } from "swiper";

interface Props {
    singleProduct: any,
    products: any,
}

const SingleProductImage: React.FC<Props> = ({ singleProduct, products }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    return (
        <div className="w-full max-w-lg max-h-[600px] min-w-[280px] flex-1 grow p-2 border border-slate-300 flex flex-col gap-2 justify-start p-0 m-0 rounded shadow-lg select-none dark:border-slate-800">
            <Swiper
                loop={true}
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, SwiperNav, Thumbs]}
                className="mySwiper2 rounded">
                {
                    singleProduct.images && singleProduct.images.length > 0
                        ? singleProduct.images.map((image: any, i: any) => {
                            return <SwiperSlide key={i}>
                                <Image src={image}
                                    width={500}
                                    height={500}
                                    alt={products?.singleProduct?.title}
                                    className='rounded w-full object-cover' />
                            </SwiperSlide>
                        })
                        : JSON.parse(products.singleProduct.images).map((image: any, i: any) => {
                            return <SwiperSlide key={i}>
                                <Image src={image}
                                    width={500}
                                    height={500}
                                    alt={products?.singleProduct?.title}
                                    className='rounded w-full object-cover' />
                            </SwiperSlide>
                        })
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
                    singleProduct.images && singleProduct.images.length > 0
                        ? singleProduct.images.map((image: any, i: any) => {
                            return <SwiperSlide key={i}>
                                <Image src={image}
                                    width={500}
                                    height={500}
                                    alt={products?.singleProduct?.title}
                                    className='rounded w-full' />
                            </SwiperSlide>
                        })
                        : JSON.parse(products.singleProduct.images).map((image: any, i: any) => {
                            return <SwiperSlide key={i}>
                                <Image src={image}
                                    width={500}
                                    height={500}
                                    alt={products?.singleProduct?.title}
                                    className='rounded w-full' />
                            </SwiperSlide>
                        })
                }
            </Swiper>
        </div>
    );
}

export default SingleProductImage;