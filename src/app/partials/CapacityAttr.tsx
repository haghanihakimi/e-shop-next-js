"use client";

import Link from "next/link";
import {
    HiCheck as CheckIcon,
} from "react-icons/hi2";


interface BreadcrumbProps {
    data: any;
}

export default function DropDownAttr({ data }: BreadcrumbProps) {

    return (
        <>
            <div className="w-fit flex grid select-none flex flex-col gap-2 text-sm sm:text-base p-0 m-0 font-medium tracking-wide capitalize ring-4 ring-transparent focus:ring-1 focus:ring-blue-400 transition duration-200">
                {/* Chosing Storages */}
                {
                    data.attributes && JSON.parse(data.attributes).hasOwnProperty('capacity')
                        ?
                        <div className="flex flex-col gap-2 w-full">
                            <strong className="w-full text-base font-semibold text-slate-700 capitalize dark:text-light-gray">
                                Capacity
                            </strong>
                            <select className="w-full max-w-[160px] rounded border border-slate-200 shadow-sm transition duration-200 ring-4 ring-transparent focus:ring-2 focus:ring-blue-400 dark:bg-slate-800 dark:text-light-gray dark:border-slate-700">
                                {
                                    JSON.parse(data.attributes).capacity.map((attr: any, i: any) => {
                                        return <option value={`${attr}`} key={i}>{attr}</option>
                                    })
                                }
                            </select>
                        </div>
                        : ''
                }
            </div>
        </>
    )
}
