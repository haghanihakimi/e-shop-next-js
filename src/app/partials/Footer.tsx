import moment from "moment"
import Link from "next/link"


export default function Loading() {
    const year = moment(new Date()).format('Y')
    return (
        <>
            <div className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-lg fixed bottom-0 left-0 z-0 p-4 flex justify-center items-center">
                <Link
                    href='#'
                    target="_self"
                    className="text-base font-medium tracking-wide text-slate-500 dark:text-light-gray dark:text-opacity-70 hover:underline">
                    Terms &amp; Conditions
                </Link>
                &nbsp;&nbsp;
                <span className="text-sm font-medium tracking-wide text-slate-500 dark:text-light-gray dark:text-opacity-70">
                    &bull;
                </span>
                &nbsp;&nbsp;
                <span className="text-base font-medium tracking-wide text-slate-500 dark:text-light-gray dark:text-opacity-70">
                    eShop &copy; {year}
                </span>
            </div>
        </>
    )
}