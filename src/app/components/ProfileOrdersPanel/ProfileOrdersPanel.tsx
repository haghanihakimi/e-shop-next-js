"use client";
import { useOrders } from "@/app/store/actions/orders";
import { RootState } from "@/app/store/store";
import moment from "moment";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";
import { useSelector } from "react-redux";


export default function DropDownAttr() {
    const { status } = useSession();
    const orders = useSelector((state: RootState) => state.orders);
    const { allUserOrders } = useOrders();

    const calculateDiscountInDollars = (item: any) => {
        const discountPercentage = parseFloat(item.discount);
        const price = parseFloat(item.price) * parseFloat(item.quantity);
        const discountInDollars = (discountPercentage / 100) * price;
        return discountInDollars;
    };

    useEffect(() => {
        if (status === "authenticated") {
            allUserOrders();
        }
    }, [])

    return (
        <>
            {
                orders.allOrders && orders.allOrders.length > 0
                    ?
                    <div className="w-full relative flex flex-col gap-8">
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <table className="w-full sm:text-xs text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="sm:text-xs text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Order #
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center">
                                            Total Price
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center">
                                            Order Date
                                        </th>
                                        <th scope="col" className="px-6 py-3">
                                            <span className="sr-only">Edit</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        orders.allOrders.map((order: any, i: any) => {
                                            return <tr key={i} className="bg-white sm:text-xs text-sm border-b last:border-none dark:bg-gray-800 dark:border-gray-700">
                                                <th scope="row" className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {order.id}
                                                </th>
                                                <td className="px-6 py-2 text-center">
                                                    ${order?.items.reduce((total: any, item: any) => total + (item.price * item.quantity - calculateDiscountInDollars(item) + parseFloat(JSON.parse(item?.deliveryPrice))), 0).toLocaleString(undefined, {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })}
                                                </td>
                                                <td className="px-6 py-2 text-center capitalize">
                                                    {order?.status}
                                                </td>
                                                <td className="px-6 py-2 text-center">
                                                    {moment(order?.createdAt).format("DD/MM/YYYY")}
                                                </td>
                                                <td className="px-6 py-2 text-right">
                                                    <a href={`order/view/${order?.id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                                        View
                                                    </a>
                                                </td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    : <h3 className="select-none text-center text-lg font-bold text-slate-600 dark:text-gray-400">
                        No orders placed yet. <Link href='#' className="text-blue-500 dark:text-blue-400">Start shopping!</Link>
                    </h3>
            }
        </>
    )
}
