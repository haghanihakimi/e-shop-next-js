import Link from "next/link";


interface LoadingProps {
    category: any;
    productId: any;
    productTitle: any;
}

export default function ProductPrice({ category, productId, productTitle }: LoadingProps) {

    return (
        <>
            <Link href={`/view/product/${(category).toLowerCase()}/${productId}/${(productTitle).replace(/ /g, "-").toLowerCase()}`} target="_self"
                className="w-full relative block px-2 text-base text-slate-900 font-bold tracking-wide dark:text-light-gray">
                {productTitle}
            </Link>
        </>
    )
}