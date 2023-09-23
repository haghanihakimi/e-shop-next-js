import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";


interface LoadingProps {
    category: any;
    productId: any;
    productTitle: any;
    productDiscount: any;
    thumbnail: any;
}

export default function ProductPrice({ category, thumbnail, productId, productTitle, productDiscount }: LoadingProps) {
    return (
        <>
            <Link href={`/view/product/${(category).toLowerCase()}/${productId}/${(productTitle).replace(/ /g, "-").toLowerCase()}`} target="_self"
                className="w-full relative select-none">
                <Image
                    src={thumbnail}
                    alt="iPhone 6"
                    width={500}
                    height={500}
                    priority={true}
                    className="w-full object-cover rounded z-0"
                />
                {
                    productDiscount > 0
                        ?
                        <div className="w-fit h-auto absolute top-2 left-1 p-1 rounded bg-baby-blue text-white text-base font-bold tracking-wide">
                            -{productDiscount < 10 ? `0${productDiscount}` : productDiscount}%
                        </div>
                        : ''
                }
                <div className="w-full h-full absolute top-0 left-0 runded dark:bg-slate-900 dark:bg-opacity-10 z-10">&nbsp;</div>
            </Link>
        </>
    )
}