import React, { useRef, useEffect, useState } from "react";
import Image from "next/dist/client/image";
import Link from "next/link";
import {
    MdAddShoppingCart as AddToCartIcon
} from "react-icons/md";
import DimensionsAttr from "@/app/partials/DimensionsAttr";
import ColorsAttr from "@/app/partials/ColorsAttr";
import CapacityAttr from "@/app/partials/CapacityAttr";
import { addToCart } from "@/app/store/reducers/cart";
import { useDispatch } from "react-redux";
import FavoriteButton from "@/app/partials/FavoriteButton";


interface Props {
    singleProduct: any;
    products: any;
}

const SingleProductAttributes: React.FC<Props> = ({ singleProduct, products }) => {
    const dispatch = useDispatch();

    const convertRating = (rating: number) => {
        return (rating / 5) * 100;
    }

    const discountCalculator = (price: any, discount: any) => {
        if (discount && discount > 0) {
            const discountDecimal = discount / 100;

            const discountAmount = price * discountDecimal;

            const salePrice = price - discountAmount;

            return salePrice;
        }
        return price;
    }

    const productPrice = (product: any, currentPrice: any) => {
        if (product.attributes == null) {
            return parseFloat(product.price);
        } else if (product.attributes !== null && currentPrice <= 0) {
            return parseFloat(JSON.parse(product.attributes).price[0]);
        }
        return parseFloat(currentPrice);
    }

    const addItemToCart = (item: any) => {
        dispatch(addToCart({
            id: item.id,
            title: item.title,
            price: productPrice(item, singleProduct.currentPrice),
            discount: item.discount,
            limit: item.cart_limit,
            quantity: 1,
            stock: item.stock,
            image: item.thumbnail,
            color: singleProduct.color,
            colorName: singleProduct.colorName,
            capacity: singleProduct.capacity,
            weight: JSON.parse(item.specifications).weight,
            width: JSON.parse(item.specifications).width,
            height: JSON.parse(item.specifications).height,
            length: JSON.parse(item.specifications).length,
            sku: item.sku,
            dimensions: singleProduct.dimensions,
            category: products.singleProduct.categories,
            brand: products.singleProduct.brand.id
        }))
    }

    useEffect(() => {
    }, [])

    return (
        <div className="w-full min-w-[280px] relative flex flex-col gap-2 flex-1 grow">
            {/* Product title */}
            <h2 className="w-full text-lg font-bold tracking-wide text-slate-700 dark:text-light-gray">
                {products.singleProduct.title}
            </h2>

            {/* Product price */}
            {
                products.singleProduct.stock > 0
                    ?
                    <h4 className="w-full text-lg font-bold tracking-wider text-slate-800 flex flex-row gap-1 dark:text-light-gray">
                        ${
                            products.singleProduct.discount > 0
                                ? discountCalculator(productPrice(products.singleProduct, singleProduct.currentPrice), products.singleProduct.discount).toFixed(2)
                                : productPrice(products.singleProduct, singleProduct.currentPrice).toFixed(2)
                        }
                        &nbsp;{products.singleProduct.discount > 0 ? '-' : ''}&nbsp;
                        {
                            products.singleProduct.discount > 0
                                ?
                                <del className="text-base font-medium text-slate-800 text-opacity-50 dark:text-light-gray dark:text-opacity-50">
                                    ${
                                        productPrice(products.singleProduct, singleProduct.currentPrice).toFixed(2)
                                    }
                                </del>
                                : ''
                        }
                    </h4>
                    : ''
            }

            {/* product short description */}
            {
                products.singleProduct.shortDescription && products.singleProduct.shortDescription.length > 0
                    ?
                    <div className="w-full mt-6 flex flex-col gap-2 text-base text-slate-700 dark:text-light-gray">
                        <strong className="tracking-wide">Short Description:</strong>
                        <article className="font-medium"
                            dangerouslySetInnerHTML={{ __html: products.singleProduct.shortDescription }}></article>
                    </div>
                    : ''
            }

            {/* Show dropdown if "dimensions" exists in the attributes */}
            {
                products.singleProduct.stock > 0 && products.singleProduct.attributes !== null && JSON.parse(products.singleProduct.attributes).hasOwnProperty('dimensions')
                    ?
                    <DimensionsAttr data={products.singleProduct} />
                    : ''
            }

            {/* Show dropdown if "colors" exists in the attributes */}
            {
                products.singleProduct.stock > 0 && products.singleProduct.attributes !== null && JSON.parse(products.singleProduct.attributes).hasOwnProperty('colors')
                    ?
                    <ColorsAttr data={products.singleProduct} />
                    : ''
            }

            {/* Show dropdown if "capacity" exists in the attributes */}
            {
                products.singleProduct.stock > 0 && products.singleProduct.attributes !== null && JSON.parse(products.singleProduct.attributes).hasOwnProperty('capacity')
                    ?
                    <CapacityAttr data={products.singleProduct} />
                    : ''
            }

            {/* Add to cart button */}
            {
                products.singleProduct.stock > 0
                    ?
                    <div className="w-full relative select-none flex flex-row justify-start items-center gap-3">
                        <form action="/" method="POST"
                            onSubmit={(e) => { e.preventDefault(); addItemToCart(products.singleProduct) }}
                            className="w-fit h-full flex flex-row items-center justify-center">
                            <button type="submit"
                                className="w-fit flex flex-row items-center justify-between gap-1 px-4 py-2 rounded bg-baby-blue shadow-md text-white font-semibold text-base tracking-wide transition duration-200 dark:bg-blue-500 hover:bg-blue-600">
                                <AddToCartIcon className="w-5 h-5 text-white" />
                                <span>
                                    Add to Cart
                                </span>
                            </button>
                        </form>
                        <div className="w-8 h-9 my-auto relative flex justify-center items-center">
                            <FavoriteButton product={products.singleProduct} />
                        </div>
                    </div>
                    :
                    <strong className="select-none text-base font-semibold text-red-600 bg-red-50 w-fit block p-2 rounded border border-red-600 shadow-md">
                        Out of stock
                    </strong>
            }

            {/* How many remains in stock if stock is equal to or less than 5 */}
            {
                products.singleProduct.stock > 0 && products.singleProduct.stock <= 5
                    ?
                    <span className="select-none text-green-600 dark:text-green-400 font-semibold text-base block p-2 mt-2 bg-green-50 dark:bg-green-700 dark:bg-opacity-20 rounded border border-green-600 shadow-md w-fit">
                        {`${products.singleProduct.stock < 10 ? `0${products.singleProduct.stock}` : products.singleProduct.stock} in stock`}
                    </span>
                    : ''
            }

            {/* Product meta data */}
            {
                products.singleProduct.brand && Object.keys(products.singleProduct.brand).length > 0
                    ?
                    <div className="w-full mt-3 flex flex-row gap-1 items-center text-base text-slate-700 dark:text-light-gray">
                        <strong>Brand:</strong>
                        <Link href={`/brand/${products.singleProduct.brand.id}`} target="_self"
                            className="text-blue-600 font-semibold dark:text-blue-400">
                            {products.singleProduct.brand.title}
                        </Link>
                    </div>
                    : ''
            }


            {
                products.singleProduct.categories && products.singleProduct.categories.length > 0
                    ?
                    products.singleProduct.categories.map((category: any, i: any) => {
                        return <div key={i} className="w-full flex flex-row gap-1 items-center text-base text-slate-700 dark:text-light-gray">
                            <strong>Category:</strong>
                            <Link href={`/category/${category?.category?.id}/${category?.category?.name.toLowerCase()}`} target="_self"
                                className="text-blue-600 font-semibold dark:text-blue-400">
                                {category.category.name}
                            </Link>
                            {
                                i === products.singleProduct.categories.length - 1
                                    ? ''
                                    : <span>, </span>
                            }
                        </div>
                    })
                    : ''
            }
        </div>
    );
}

export default SingleProductAttributes;