"use client";
import React, { FormEventHandler, useEffect } from "react";
import { debounce } from 'lodash';
import * as Dialog from '@radix-ui/react-dialog';
import Image from 'next/image';
import {
    HiOutlineXMark as CloseIcon,
    HiMagnifyingGlass as SearchIcon,
} from "react-icons/hi2";
import Link from 'next/link';
import Loading from "@/app/partials/Loading";
import { useSearch } from '../store/actions/search';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';


export default function SearchBox() {
    const search = useSelector((state: RootState) => state.search);
    const { searchProducts } = useSearch();
    const [searching, setSearching] = React.useState<boolean>(false);

    const debouncedGetSuburbs = debounce((item: string) => {
        searchProducts(item).finally(() => {
            setSearching(false);
        });
    }, 500);

    const submitSearchProducts = (item: string) => {
        setSearching(true);
        debouncedGetSuburbs(item); // Call the debounced function
    }

    useEffect(() => {
        return () => {
            ;
        }
    }, []);
    return (
        <>
            <Dialog.Root>
                <Dialog.Trigger asChild>
                    <div className="w-6 h-6 flex items-center justify-center p-0 m-0 relative">
                        <SearchIcon className="w-5 h-5 text-slate-800 dark:text-light-gray transition duration-200 hover:text-baby-blue dark:hover:text-baby-blue" />
                    </div>
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay className="bg-white bg-opacity-70 backdrop-blur fixed inset-0 p-4 dark:bg-black dark:bg-opacity-[0.95] z-50" />
                    <Dialog.Content className="z-50 fixed p-4 top-[50%] left-[50%] max-h-[85vh] overflow-hidden w-full max-w-2xl translate-x-[-50%] translate-y-[-50%]">
                        <div className='w-full select-none h-auto p-4 rounded bg-slate-100 dark:bg-slate-900 overflow-hidden shadow-lg border border-slate-300 dark:border-slate-700'>
                            <Dialog.Close asChild onClick={() => {submitSearchProducts("");}}>
                                <div className='w-full select-none flex justify-end items-center px-4 py-2 rounded'>
                                    <button
                                        className="relative w-6 h-6 rounded-full flex items-center justify-center"
                                        aria-label="Close">
                                        <CloseIcon className='w-6 h-6 text-slate-800 dark:text-light-gray' />
                                    </button>
                                </div>
                            </Dialog.Close>
                            <fieldset className="relative p-4">
                                <input
                                    className="w-full bg-white text-base font-medium shadow-sm tracking-wide dark:bg-slate-700 rounded p-2 border border-slate-300 text-slate-800 dark:border-slate-600 dark:text-light-gray transition duration-200 ring-4 ring-transparent focus:ring-2 focus:ring-baby-blue"
                                    id="name"
                                    onChange={({ target }) => { submitSearchProducts(target.value) }}
                                    autoFocus
                                    spellCheck={false}
                                    placeholder='Search Products...'
                                />
                            </fieldset>
                            {
                                searching ?
                                    <div className='w-full px-6 py-2 flex justify-start items-start'>
                                        <Loading color='text-black text-opacity-10 fill-baby-blue' width={6} height={6} />
                                    </div>
                                    : ''
                            }
                            {
                                search.results && search.results.length > 0 ?
                                    <div className='w-full select-none flex relative h-auto max-h-[400px] px-4 flex flex-col gap-1 overflow-auto overflow-x-hidden'>
                                        {
                                            search.results.map((result: any, i: any) => {
                                                return <div key={i} className='w-full relative p-2 flex flex-row gap-1 items-center justify-between bg-slate-800 rounded transition duration-200 hover:bg-slate-600'>
                                                    {/* result product image */}
                                                    <div className='w-8 h-8 rounded'>
                                                        <Image
                                                            src={result?.thumbnail}
                                                            width={32}
                                                            height={32}
                                                            className='bg-light-gray dark:bg-slate-600 rounded object-fit'
                                                            alt="Picture of the author"
                                                        />
                                                    </div>

                                                    {/* Result text */}
                                                    <div className='w-full flex items-center justify-start rounded'>
                                                        <Link href={`/view/product/${(result?.categories[0]?.category?.name).toLowerCase()}/${result?.id}/${(result?.title).replace(/ /g, "-").toLowerCase()}`} target='_self'
                                                            className='block w-full p-2 text-base font-medium text-slate-800 dark:text-light-gray'>
                                                            {result?.title} <span className="opacity-75">(SKU: {result?.sku.slice(4, 16).toUpperCase()})</span>
                                                        </Link>
                                                    </div>
                                                </div>
                                            })
                                        }
                                    </div>
                                    : ''
                            }
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </>
    )
}