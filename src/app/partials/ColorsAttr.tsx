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
                {/* Choosing colours */}
                {
                    data.attributes && JSON.parse(data.attributes).hasOwnProperty('colors')
                        ?
                        <div className="flex flex-col gap-2 w-full">
                            <strong className="w-full text-base font-semibold text-slate-700 capitalize dark:text-light-gray">
                                Colors
                            </strong>
                            <div className="w-fit flex flex-row gap-2 items-center justify-start">
                                {
                                    JSON.parse(data.attributes).colors.map((attr: any, i: any) => {
                                        let style = {};
                                        if (attr.color.length > 1) {
                                            style = { background: `linear-gradient(to right, ${attr.color[0]}, ${attr.color[1]})` };
                                        } else {
                                            style = { backgroundColor: attr.color[0] };
                                        }

                                        return (
                                            <div key={i} className="flex flex-col gap-1 items-center justify-center">
                                                <input
                                                    type="radio"
                                                    className="hidden invisible opacity-0 peer"
                                                    id={`rdColor${i}`}
                                                    name="colors"
                                                    value={attr.color[0]}
                                                />
                                                <label
                                                    htmlFor={`rdColor${i}`}
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ring-4 ring-transparent transition duration-200 peer-checked:ring-2 peer-checked:ring-blue-400 border border-slate-300 dark:border-slate-700`}
                                                    style={style}
                                                >
                                                </label>
                                                <span className="text-sm text-slate-800 dark:text-light-gray transition duration-200 peer-checked:underline peer-checked:font-medium peer-checked:text-blue-600">
                                                    {attr.color_name}
                                                </span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        : ''
                }
            </div>
        </>
    )
}
