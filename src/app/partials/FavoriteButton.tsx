"use client";
import {
    HiHeart as HeartIcon,
    HiOutlineHeart as OutlineHeartIcon
} from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { RootState } from "../store/store";
import { setUpdatingFavs } from "../store/reducers/favorites";
import { useFavorites } from "../store/actions/favorites";
import Loading from "./Loading";


interface Props {
    product: any;
}

export default function FavoriteButton({ product }: Props) {
    const dispatch = useDispatch();
    const favorites = useSelector((state: RootState) => state.favorites);
    const { updateFavorites } = useFavorites();

    const markFavorite = (product: any) => {
        dispatch(setUpdatingFavs(true));
        console.log(product?.id);
        updateFavorites({ productId: product?.id, brandId: Object.keys(product?.brand).length > 0 ? product?.brand?.id : product?.brand })
            .then(() => {
                dispatch(setUpdatingFavs(false));
            });
    }

    useEffect(() => {
    }, []);

    return (
        <>
            {
                favorites.updatingFavs ?
                    <div className='w-full h-full inline-flex justify-center items-center'>
                        <Loading color='text-black text-opacity-10 fill-baby-blue' width={'full'} height={'full'} />
                    </div>
                    :
                    <button
                        disabled={favorites.updatingFavs}
                        onClick={() => markFavorite(product)}
                        className={`w-full h-full flex justify-center items-center rounded ${favorites.updatingFavs ? 'opacity-50' : 'opacity-100'}`}>
                        {
                            favorites.favorites.some((item: any) => item?.products?.id === product?.id)
                                ? <HeartIcon className="w-full h-full block text-red-500" />
                                : <OutlineHeartIcon className="w-full h-full block text-slate-600 dark:text-gray-400" />
                        }
                    </button>
            }

        </>
    )
}
