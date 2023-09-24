"use client";

import Link from "next/link";


interface BreadcrumbProps {
    paths: Array<any>
}

export default function HomeContainer({ paths }: BreadcrumbProps) {

    return (
        <>
            <div className="w-fit flex flex-row flex-nowrap gap-1 text-sm sm:text-base p-0 m-0 font-medium tracking-wide capitalize">
                {
                    paths.map((path: any, i: any) => {
                        const isLastItem = i === paths.length - 1;
                        if (i === paths.length - 1) {
                            return <div
                                key={i}
                                className="w-fit flex flex-row flex-nowrap gap-1 text-slate-800 dark:text-light-gray">
                                <span>{path.path}</span>
                                {
                                    isLastItem
                                        ? ''
                                        : <span>/</span>
                                }
                            </div>
                        }
                        return <Link href={`${path.link}`}
                            key={i}
                            className="w-fit text-baby-blue flex flex-row flex-nowrap gap-1">
                            <span>{path.path}</span>
                            {
                                isLastItem
                                    ? ''
                                    : <span className="text-slate-800 dark:text-light-gray">/</span>
                            }
                        </Link>
                    })
                }
            </div>
        </>
    )
}
