"use client";

import Link from "next/link";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
    HiShoppingCart as CartIcon,
    HiOutlineShoppingCart as OutlineCartIcon,
    HiBars3 as MenuIcon,
    HiOutlineHeart as OutlineHeartIcon,
    HiHeart as HeartIcon,
} from "react-icons/hi2";
import SearchBox from "./SearchBox";


export default function Navigation() {
    return (
        <>
            <header className="w-full relative select-none border-b border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-md">
                <nav className="w-full px-6 py-3 relative flex flex-row gap-2 justify-between items-center">
                    {/* Logo container */}
                    <div className="w-auto shrink-0 relative">
                        <Link href='/' target="_self"
                            className="w-auto p-2 block text-xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-baby-blue drop-shadow-lg">
                            eShop
                        </Link>
                    </div>

                    {/* menu container */}
                    <div className="w-full flex justify-end items-center gap-2">
                        <ul className="sm:inline-block hidden">
                            <li className="inline-block">
                                <Link href='/' target="_self"
                                    className="inline-block p-2 text-slate-800 text-base transition duration-200 font-medium tracking-wide dark:text-light-gray hover:text-baby-blue dark:hover:text-baby-blue">
                                    Home
                                </Link>
                            </li><li className="inline-block">
                                <Link href='/' target="_self"
                                    className="inline-block p-2 text-slate-800 text-base transition duration-200 font-medium tracking-wide dark:text-light-gray hover:text-baby-blue dark:hover:text-baby-blue">
                                    Brands
                                </Link>
                            </li><li className="inline-block">
                                <Link href='/' target="_self"
                                    className="inline-block p-2 text-slate-800 text-base transition duration-200 font-medium tracking-wide dark:text-light-gray hover:text-baby-blue dark:hover:text-baby-blue">
                                    Shop
                                </Link>
                            </li>
                        </ul>
                        <div className="w-auto flex flex-row gap-2 items-center justify-center relative">
                            <button type="button"
                                className="w-6 h-6 flex items-center justify-center p-0 m-0 relative">
                                <SearchBox />
                            </button>
                            <Link href='#' target="_self"
                                className="w-6 h-6 flex items-center justify-center p-0 m-0 relative">
                                <OutlineHeartIcon className="w-5 h-5 text-slate-800 dark:text-light-gray transition duration-200 hover:text-baby-blue dark:hover:text-baby-blue" />
                            </Link>
                            <Link href='#' target="_self"
                                className="w-6 h-6 flex items-center justify-center p-0 m-0 relative">
                                <OutlineCartIcon className="w-5 h-5 text-slate-800 dark:text-light-gray transition duration-200 hover:text-baby-blue dark:hover:text-baby-blue" />
                            </Link>
                            <div className="w-6 h-6 rounded-full relative inline-block sm:hidden">
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger asChild>
                                        <button type="button"
                                            className="w-6 h-6 flex items-center justify-center p-0 m-0 relative">
                                            <MenuIcon className="w-6 h-6 text-slate-800 dark:text-light-gray transition duration-200 hover:text-baby-blue dark:hover:text-baby-blue" />
                                        </button>
                                    </DropdownMenu.Trigger>

                                    <DropdownMenu.Portal>
                                        <DropdownMenu.Content
                                            className="min-w-[200px] mr-4 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 z-10"
                                            sideOffset={5}
                                        >
                                            <DropdownMenu.Item className="group leading-none text-violet11 rounded flex items-center relative select-none outline-none">
                                                <Link href='/' target="_self"
                                                    className="w-full block px-4 py-2 text-base font-medium tracking-wide text-slate-800 transition duration-200 dark:text-light-gray hover:bg-slate-200 dark:hover:bg-slate-600">
                                                    Home
                                                </Link>
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Item className="group leading-none text-violet11 rounded flex items-center relative select-none outline-none">
                                                <Link href='/' target="_self"
                                                    className="w-full block px-4 py-2 text-base font-medium tracking-wide text-slate-800 transition duration-200 dark:text-light-gray hover:bg-slate-200 dark:hover:bg-slate-600">
                                                    Brands
                                                </Link>
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Item className="group leading-none text-violet11 rounded flex items-center relative select-none outline-none">
                                                <Link href='/' target="_self"
                                                    className="w-full block px-4 py-2 text-base font-medium tracking-wide text-slate-800 transition duration-200 dark:text-light-gray hover:bg-slate-200 dark:hover:bg-slate-600">
                                                    Shop
                                                </Link>
                                            </DropdownMenu.Item>

                                            <DropdownMenu.Arrow className="fill-white dark:fill-slate-800 -ml-0" />
                                        </DropdownMenu.Content>
                                    </DropdownMenu.Portal>
                                </DropdownMenu.Root>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    )
}