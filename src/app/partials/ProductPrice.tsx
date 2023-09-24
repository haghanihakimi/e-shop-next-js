import Link from "next/link";


interface LoadingProps {
    category: any;
    productId: any;
    productTitle: any;
    productDiscount: any;
    productPrice: any;
    attributes: any;
}

export default function ProductPrice({ category, productId, productTitle, productDiscount, productPrice, attributes }: LoadingProps) {
    const discountCalculator = (price: any, discount: any) => {
        if (discount && discount > 0) {
            const discountDecimal = discount / 100;

            const discountAmount = price * discountDecimal;

            const salePrice = price - discountAmount;

            return salePrice;
        }
        return 0;
    }

    return (
        <>
            <h4 className="w-full px-2 text-left text-lg font-bold text-slate-800 flex flex-row gap-1 dark:text-light-gray">
                <Link href={`/view/product/${(category).toLowerCase()}/${productId}/${(productTitle).replace(/ /g, "-").toLowerCase()}`} target="_self"
                    className="w-full relative">
                    <span>
                        {attributes !== null ? 'From ' : ''}${productDiscount > 0 ? discountCalculator(productPrice, productDiscount).toFixed(2) : productPrice.toFixed(2)}
                    </span> {productDiscount > 0 ? '-' : ''} {productDiscount > 0 ? <del className="text-base text-slate-800 dark:text-light-gray font-normal">
                        ${productPrice.toFixed(2)}
                    </del>
                        : ''}
                </Link>
            </h4>
        </>
    )
}