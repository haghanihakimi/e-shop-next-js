"use client";
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from "react-redux";
import Navigation from "@/app/partials/Navigation";
import React, { useEffect } from "react";
import moment from 'moment';
import { getTheme } from "@/app/store/reducers/theme";
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
      successfulPayment(params?.id);
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
          <div className='w-full max-w-4xl m-auto py-8 px-4'>

            {/* Order date & code */}
            <div className='w-full relative'>
              {/* moment(orders.createdAt).format("DD/MM/YYYY") */}
              <h2 className='text-2xl font-bold py-2 text-slate-700 dark:text-gray-300'>
                Order <span className='uppercase'>es-{orders.orders.id}</span>
                <span className='text-base font-bold block'>Ordered at {moment(orders.createdAt).format("DD/MM/YYYY")}</span>
              </h2>
            </div>

            {/* shipping addresses */}
            <div className='w-full flex flex-row flex-wrap gap-4 items-center justify-start mb-6'>
              {/* shipping section */}
              <div className='w-full min-w-[200px] max-w-xs flex-1 relative flex flex-col gap-1'>
                <h3 className='w-full text-xl py-4 font-bold text-slate-700 dark:text-gray-300'>
                  Shipping Address
                </h3>
                <span className='text-md tracking-wide text-slate-700 dark:text-gray-300'>
                  {orders?.orders?.users?.firstname} {orders?.orders?.users?.surname}
                </span>
                <div className='w-full flex flex-row'>
                  <span className='text-md tracking-wide text-slate-700 dark:text-gray-300'>
                    {orders?.orders?.users?.street},
                  </span>
                  &nbsp;<span className='text-md tracking-wide text-slate-700 dark:text-gray-300'>
                    {orders?.orders?.users?.city} {orders?.orders?.users?.postcode}
                  </span>
                </div>
                <span className='text-md tracking-wide text-slate-700 dark:text-gray-300'>
                  {orders?.orders?.users?.country}
                </span>
                <span className='text-md tracking-wide text-slate-700 dark:text-gray-300'>
                  Payment: {orders?.orders?.paymentType} - {orders?.orders?.lastDigits}
                </span>
              </div>
            </div>

            {/* Order Summary */}
            <div className='w-full relative'>
              <strong className='text-left text-base text-slate-700 dark:text-gray-300'>
                Order summary:
              </strong>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr className='text-center'>
                      <th scope="col" className="px-2 py-3 text-left">
                        Product name
                      </th>
                      <th scope="col" className="px-2 py-3">
                        SKU
                      </th>
                      <th scope="col" className="px-2 py-3">
                        Price
                      </th>
                      <th scope="col" className="px-2 py-3">
                        Delivery
                      </th>
                      <th scope="col" className="px-2 py-3">
                        Discount
                      </th>
                      <th scope="col" className="px-2 py-3">
                        Quantity
                      </th>
                      <th scope="col" className="px-2 py-3 text-right">
                        Total Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      orders.orders.items.map((item: any, i: any) => {
                        return <tr key={i} className="bg-white text-center border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                          <th scope="row" className="px-2 py-3 text-[14px] font-medium text-slate-700 dark:text-gray-300">
                            <span className='inline-block w-full max-w-[200px] text-left'>
                              {item.name}
                            </span>
                          </th>
                          <th scope="row" className="px-2 py-3 text-[14px] font-medium text-slate-700 whitespace-nowrap dark:text-gray-300">
                            {(item.sku).slice(4, 16).toUpperCase()}
                          </th>
                          <th scope="row" className="px-2 py-3 text-[14px] font-medium text-slate-700 whitespace-nowrap dark:text-gray-300">
                            ${JSON.parse(item.price).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </th>
                          <th scope="row" className="px-2 py-3 text-[14px] font-medium text-slate-700 dark:text-gray-300">
                            <span className='inline-block w-full max-w-[120px]'>
                              {item.delivery !== null ? `${item.delivery} - $${item.deliveryPrice}` : '-'}
                            </span>
                          </th>
                          <th scope="row" className="px-2 py-3 text-[14px] font-medium text-slate-700 whitespace-nowrap dark:text-gray-300">
                            {JSON.parse(item.discount) > 0 ? `${JSON.parse(item.discount)}%` : '-'}
                          </th>
                          <th scope="row" className="px-2 py-3 text-[14px] font-medium text-slate-700 whitespace-nowrap dark:text-gray-300">
                            {JSON.parse(item.quantity)}
                          </th>
                          <th scope="row" className="px-2 py-3 text-[14px] text-right font-medium text-slate-700 whitespace-nowrap dark:text-gray-300">
                            ${(parseFloat(item.price) * parseInt(JSON.parse(item.quantity)) + parseFloat(JSON.parse(item.deliveryPrice))).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </th>
                        </tr>
                      })
                    }

                    <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'>
                      <td rowSpan={8} colSpan={8} className='text-right p-2 text-base whitespace-nowrap bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'>
                        <strong className='w-fit float-left text-left px-2 inline-block text-slate-700 dark:text-gray-300'>
                          Total
                        </strong>
                        <strong className='w-fit float-right text-right px-0 inline-block text-slate-700 dark:text-gray-300'>
                          ${
                            orders.orders.items.reduce((total: any, item: any) => total + (parseFloat(item.price) * parseInt(JSON.parse(item.quantity), 0) - calculateDiscountInDollars(item)) + parseFloat(JSON.parse(item.deliveryPrice)), 0).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })
                          }
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
          : ''
      }
    </main >
  )
}
