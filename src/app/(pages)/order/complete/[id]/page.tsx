"use client";
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from "react-redux";
import Image from 'next/image';
import Link from "next/dist/client/link";
import Navigation from "@/app/partials/Navigation";
import React, { useEffect } from "react";
import { getTheme } from "@/app/store/reducers/theme";
import lottie from "lottie-web";
import orderCompleteAnim from "../../../../../../public/tick.json";
import { useOrders } from '@/app/store/actions/orders';
import { RootState } from '@/app/store/store';

export default function OrderContainer() {
    const { data: session, status } = useSession();
    const dispatch = useDispatch();
    const params = useParams()
    const router = useRouter();
    const orders = useSelector((state: RootState) => state.orders);
    const { successfulPayment } = useOrders();

    const calculateDiscountInDollars = (item: any) => {
        const discountPercentage = parseFloat(item.discount);
        const price = parseFloat(item.price) * parseFloat(JSON.parse(item.quantity));
        const discountInDollars = (discountPercentage / 100) * price;
        return discountInDollars;
    };

    useEffect(() => {
        dispatch(getTheme());
        if (status === "authenticated") {
            successfulPayment(params?.id).then(() => {
                const orderComplete = document.querySelector("#orderComplete");

                lottie.destroy();

                if (orderComplete) {
                    lottie.loadAnimation({
                        container: orderComplete,
                        animationData: orderCompleteAnim,
                        loop: false,
                    });
                }
            })
        } else {
            router.push("/auth/login");
        }
    }, [params?.id, dispatch, status, router, successfulPayment])

    return (
        <main className="w-full relative h-auto pb-12">
            <Navigation />

            {
                orders && Object.keys(orders).length > 0 && orders.orders.items
                    ?
                    <div className='w-full max-w-2xl m-auto py-8 px-4'>
                        {/* Heading animation container */}
                        <div className='w-full relative'>
                            <div className='w-full flex flex-col items-center justify-center relative mb-8'>
                                <div id="orderComplete" className='w-64 h-64' />
                                <h2 className='absolute bottom-6 text-[22px] font-bold text-slate-700 text-center dark:text-gray-300'>
                                    Order Complete! <br />
                                </h2>
                            </div>
                        </div>

                        {/* Order summary container */}
                        <div className='w-full h-auto mx-auto p-4 bg-gray-100 rounded flex flex-col gap-4 shadow-md dark:bg-[#131d34]'>
                            {/* Order number section */}
                            <div className='w-full relative'>
                                <h2 className='w-full text-lg flex items-center justify-start gap-4 font-bold text-slate-700 dark:text-gray-300'>
                                    <span>Order #{orders?.orders?.id}</span> <Link href={`/order/view/${params?.id}`}
                                        className='text-blue-500 text-base'>
                                        View order
                                    </Link>
                                </h2>
                                <span className='font-bold text-base text-gray-500 dark:text-gray-400'>
                                    Total Price $
                                    {
                                        (orders?.orders?.items.reduce((total: any, item: any) => total + (parseFloat(JSON.parse(item.price)) * parseInt(JSON.parse(item.quantity)) - calculateDiscountInDollars(item)) + (item?.deliveryPrice !== null ? parseFloat(JSON.parse(item?.deliveryPrice)) : 0), 0)).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })
                                    }
                                </span>
                            </div>

                            {/* customer name section */}
                            <div className='w-full relative'>
                                <strong className='block text-base text-gray-500 dark:text-gray-400'>
                                    Customer Name:
                                </strong>
                                <span className='block font-bold text-base text-gray-700 dark:text-gray-200'>
                                    Daniel HK
                                </span>
                            </div>

                            {/* payment method section */}
                            <div className='w-full relative'>
                                <strong className='block text-base text-gray-500 dark:text-gray-400'>
                                    Payment Method:
                                </strong>
                                {
                                    orders?.orders?.paymentType === "Visa"
                                        ? <div className='w-full flex flex-row gap-4 items-center justify-start'>
                                            <Image src={'https://cdn-icons-png.flaticon.com/512/179/179457.png'}
                                                alt="Visa Card payment"
                                                width={30}
                                                height={30}
                                                className="relative left-2 top-0 bottom-0 my-auto" />
                                            <span className='text-slate-700 dark:text-gray-300'>
                                                {orders?.orders?.lastDigits}
                                            </span>
                                        </div>
                                        : ''
                                }
                                {
                                    orders?.orders?.paymentType === "Master Card"
                                        ? <div className='w-full flex flex-row gap-2 items-center justify-start'>
                                            <Image src={'https://cdn-icons-png.flaticon.com/512/11041/11041055.png'}
                                                alt="Visa Card payment"
                                                width={30}
                                                height={30}
                                                className="relative" />
                                            <span className='text-slate-700 dark:text-gray-300'>
                                                {orders?.orders?.lastDigits}
                                            </span>
                                        </div>
                                        : ''
                                }
                            </div>

                            {/* confirmation email message section */}
                            <div className='w-full relative tracking-wide'>
                                <span className='text-slate-600 dark:text-gray-300'>
                                    A confirmation email has been sent to
                                </span>
                                &nbsp;
                                <strong className='text-slate-700 dark:text-gray-100'>
                                    {orders?.orders?.users?.email}
                                </strong>
                            </div>
                        </div>
                    </div>
                    : ''
            }
        </main >
    )
}
