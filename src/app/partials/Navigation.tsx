"use client";

import Link from "next/link";
import Image from 'next/image';
import React, { FormEventHandler, useEffect } from "react";
import { usePathname } from "next/navigation";
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
    AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { styled } from '@mui/material/styles';
import { signOut } from "next-auth/react";
import {
    HiShoppingCart as CartIcon,
    HiOutlineShoppingCart as OutlineCartIcon,
    HiBars3 as MenuIcon,
    HiOutlineHeart as OutlineHeartIcon,
    HiHeart as HeartIcon,
    HiOutlineMoon as OutlineMoonIcon,
    HiOutlineSun as OutlineSunIcon,
    HiOutlineUserCircle as UserOutlineIcon,
    HiCog8Tooth as SettingsIcon,
    HiMiniArrowLeftOnRectangle as LogoutIcon,
    HiChevronRight as ArrowForwardIosSharpIcon
} from "react-icons/hi2";
import { FaHeartCircleMinus as RemoveFavIcon } from "react-icons/fa6";
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import SearchBox from "./SearchBox";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setTheme } from "../store/reducers/theme";
import { useSession } from "next-auth/react";
import { setUpdatingFavs } from "../store/reducers/favorites";
import { useFavorites } from "../store/actions/favorites";
import { useCategories } from "../store/actions/categories";
import Loading from "./Loading";
import { setProfile } from "../store/reducers/profile";

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon />}
        {...props}
    />
))(({ theme }) => ({
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const Navigation = () => {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const theme = useSelector((state: RootState) => state.theme);
    const cart = useSelector((state: RootState) => state.cart);
    const favorites = useSelector((state: RootState) => state.favorites);
    const categories = useSelector((state: RootState) => state.categories);
    const profile = useSelector((state: RootState) => state.profile);
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [favoritesList, setFavoritesList] = React.useState<null | HTMLElement>(null);
    const [categoriesList, setCategoriesList] = React.useState<null | HTMLElement>(null);
    const [categoriesAccordion, setCategoriesAccordion] = React.useState<string | false>('panel1');
    const [mediaMenu, setMediaMenu] = React.useState<boolean>(false);
    const open = Boolean(anchorEl);
    const opennedFavlist = Boolean(favoritesList);
    const opennedCategoriesList = Boolean(categoriesList);
    const { updateFavorites, getFavorites } = useFavorites();
    const { getCategories } = useCategories();


    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null);
    }
    const handleLogout: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        const res = await signOut({ callbackUrl: `${pathname}` });
    }
    const openFavoritesList = (event: React.MouseEvent<HTMLElement>) => {
        if (favorites.favorites && favorites.favorites.length > 0) {
            setFavoritesList(event.currentTarget);
        }
    }
    const closeFavsList = () => {
        setFavoritesList(null);
    }
    const openCategoriesList = (event: React.MouseEvent<HTMLElement>) => {
        if (categories.categories && categories.categories.length > 0) {
            setCategoriesList(event.currentTarget);
        }
    }
    const closeCategoriesList = () => {
        setCategoriesList(null);
    }
    const toggleMediaMenu = () => {
        setMediaMenu(mediaMenu ? false : true);
    }
    const removeFavorite = (productId: any, brandId: any) => {
        dispatch(setUpdatingFavs(true));
        updateFavorites({ productId: productId, brandId: brandId })
            .then(() => {
                dispatch(setUpdatingFavs(false))
            });
    }

    const mediaCategoriesAcc =
        (panel: string) => (newExpanded: boolean) => {
            setCategoriesAccordion(newExpanded ? panel : false);
        };

    useEffect(() => {
        const disableMenusScroll = () => {
            setFavoritesList(null);
            setAnchorEl(null);
        }
        const toggleMediaView = () => {
            if(window.innerWidth < 640) {
                setCategoriesList(null);
            }
            if(window.innerWidth >= 640) {
                setMediaMenu(false);
            }
        }
        window.addEventListener('scroll', disableMenusScroll, true);
        window.addEventListener('resize', toggleMediaView, true);

        if (status === "authenticated") {
            getFavorites().then(() => {
                getCategories();
            });
            dispatch(setProfile({
                firstname: session?.user?.firstname,
                lastname: session?.user?.lastname,
                email: session?.user?.email,
                phone: session?.user?.phone,
                image: session?.user?.image,
                country: session?.user?.country,
                street: session?.user?.street,
                city: session?.user?.city,
                state: session?.user?.state,
                postcode: session?.user?.postcode,
            }));
        }

        return () => {
            window.removeEventListener('scroll', disableMenusScroll, true)
            window.removeEventListener('resize', toggleMediaView, true);
        }
    }, [status, categories.categories, categoriesList]);

    return (
        <>
            <header className="w-full sticky top-0 z-50 bg-white relative select-none border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-sm dark:shadow-md">
                <nav className="w-full px-6 py-3 relative flex flex-row gap-2 justify-between items-center">
                    {/* Logo container */}
                    <div className="w-auto shrink-0 relative">
                        <Link href='/' target="_self"
                            className="w-auto p-2 block text-xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-baby-blue  dark:from-slate-400 dark:to-baby-blue drop-shadow-lg">
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
                                <Link href='/brands' target="_self"
                                    className="inline-block p-2 text-slate-800 text-base transition duration-200 font-medium tracking-wide dark:text-light-gray hover:text-baby-blue dark:hover:text-baby-blue">
                                    Brands
                                </Link>
                            </li><li className="inline-block relative">
                                <button
                                    onClick={openCategoriesList}
                                    className="inline-block p-2 text-slate-800 text-base transition duration-200 font-medium tracking-wide dark:text-light-gray hover:text-baby-blue dark:hover:text-baby-blue">
                                    Categories
                                </button>
                                <Menu
                                    anchorEl={categoriesList}
                                    id="favslist"
                                    open={opennedCategoriesList}
                                    onClick={closeCategoriesList}
                                    disableScrollLock={true}
                                    PaperProps={{
                                        elevation: 0,
                                        sx: {
                                            backgroundColor: theme.theme === 'light' ? '#f9fafb' : '#1e293b',
                                            overflow: 'visible',
                                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                            mt: 2,
                                            ml: 2,
                                            minWidth: '280px',
                                            maxWidth: '300px',
                                            maxHeight: '480px',
                                            overflowY: 'auto',
                                            overflowX: 'hidden',
                                            color: theme.theme === 'light' ? '#1e293b' : '#f9fafb',
                                            left: 0,
                                            right: 0,
                                            marginLeft: 'auto',
                                            marginRight: 'auto',
                                            '&.MuiAvatar-root': {
                                                width: 32,
                                                height: 32,
                                                ml: -0.5,
                                                mr: 1,
                                            },
                                            '&:before': {
                                                backgroundColor: theme.theme === 'light' ? '#f9fafb' : '#1e293b',
                                                content: '""',
                                                display: 'block',
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                left: 0,
                                                marginLeft: 'auto',
                                                marginRight: 'auto',
                                                width: 10,
                                                height: 10,
                                                transform: 'translateY(-50%) rotate(45deg)',
                                                zIndex: 0,
                                            },
                                        },
                                    }}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                    {
                                        categories.categories && categories.categories.length > 0 ?
                                            categories.categories.map((category: any, i: any) => {
                                                return <MenuItem
                                                    key={i}
                                                    sx={{
                                                        '&.MuiMenuItem-root': {
                                                            padding: 0,
                                                            mb: 1.5,
                                                            ":last-child": {
                                                                mb: 0
                                                            }
                                                        }
                                                    }}>
                                                    <Link href={`/category/${category?.id}/${category?.name}`}
                                                        className="w-full p-2 flex flex-row items-center gap-2 truncate">
                                                        {category?.name}
                                                    </Link>
                                                </MenuItem>
                                            })
                                            : ''
                                    }
                                </Menu>
                            </li>
                        </ul>
                        <div className="w-auto flex flex-row gap-2 items-center justify-center relative">
                            <button type="button"
                                onClick={(e) => { dispatch(setTheme(theme.theme === 'light' ? 'dark' : 'light')) }}
                                className="w-6 h-6 flex items-center justify-center p-0 m-0 relative">
                                {
                                    theme.theme === 'light'
                                        ?
                                        <OutlineMoonIcon className="w-5 h-5 text-slate-800 dark:text-light-gray" />
                                        :
                                        <OutlineSunIcon className="w-5 h-5 text-slate-800 dark:text-light-gray" />
                                }
                            </button>
                            <button type="button"
                                className="w-6 h-6 flex items-center justify-center p-0 m-0 relative">
                                <SearchBox />
                            </button>
                            {
                                status === "authenticated"
                                    ? <div className="w-full relative">

                                        {
                                            favorites.updatingFavs
                                                ? <div className='w-6 h-6 inline-flex justify-center items-center'>
                                                    <Loading color='text-black text-opacity-10 fill-baby-blue' width={'full'} height={'full'} />
                                                </div>
                                                : <button disabled={favorites.updatingFavs}
                                                    onClick={openFavoritesList}
                                                    type="button"
                                                    className="w-6 h-6 flex items-center justify-center p-0 m-0 relative">
                                                    {
                                                        favorites.favorites && favorites.favorites.length <= 0
                                                            ?
                                                            <OutlineHeartIcon className="w-5 h-5 text-slate-800 dark:text-light-gray transition duration-200 hover:text-baby-blue dark:hover:text-baby-blue" />
                                                            :
                                                            <HeartIcon className="w-5 h-5 text-blue-500" />
                                                    }
                                                    {
                                                        favorites.favorites && favorites.favorites.length > 0
                                                            ?
                                                            <span className="w-fit h-fit rounded-full px-1 text-white bg-red-500 font-medium shadow-md text-sm absolute -top-2 -right-1">
                                                                {favorites.favorites.length}
                                                            </span>
                                                            : ''
                                                    }
                                                </button>
                                        }
                                        {
                                            favorites.favorites && favorites.favorites.length > 0 ?
                                                <Menu
                                                    anchorEl={favoritesList}
                                                    id="favslist"
                                                    open={opennedFavlist}
                                                    onClick={closeFavsList}
                                                    disableScrollLock={true}
                                                    PaperProps={{
                                                        elevation: 0,
                                                        sx: {
                                                            backgroundColor: theme.theme === 'light' ? '#f9fafb' : '#1e293b',
                                                            overflow: 'visible',
                                                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                                            mt: 2,
                                                            ml: 2,
                                                            minWidth: '280px',
                                                            maxWidth: '300px',
                                                            color: theme.theme === 'light' ? '#1e293b' : '#f9fafb',
                                                            '&.MuiAvatar-root': {
                                                                width: 32,
                                                                height: 32,
                                                                ml: -0.5,
                                                                mr: 1,
                                                            },
                                                            '&:before': {
                                                                backgroundColor: theme.theme === 'light' ? '#f9fafb' : '#1e293b',
                                                                content: '""',
                                                                display: 'block',
                                                                position: 'absolute',
                                                                top: 0,
                                                                right: 24,
                                                                width: 10,
                                                                height: 10,
                                                                transform: 'translateY(-50%) rotate(45deg)',
                                                                zIndex: 0,
                                                            },
                                                        },
                                                    }}
                                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                                    {
                                                        favorites.favorites && favorites.favorites.length > 0
                                                            ? favorites.favorites.map((item: any, i: number) => {
                                                                return <MenuItem key={i}
                                                                    sx={{
                                                                        '&.MuiMenuItem-root': {
                                                                            padding: 0,
                                                                            mb: 1.5,
                                                                            ":last-child": {
                                                                                mb: 0
                                                                            }
                                                                        }
                                                                    }}>
                                                                    <div className="w-full flex pr-2 flex-row items-center justify-between gap-2">
                                                                        <Link href={`/view/product/${item?.products?.categories[0]?.category?.name.toLowerCase()}/${item?.products?.id}/${item?.products?.title.replace(/ /g, "-").toLowerCase()}`}
                                                                            className="w-full px-2 flex flex-row items-center gap-2 truncate">
                                                                            <Image src={item?.products?.thumbnail}
                                                                                width={120}
                                                                                height={120}
                                                                                alt={item?.products?.title}
                                                                                className="w-12 h-12 aspect-square rounded object-cover shrink-0" />
                                                                            {item?.products?.title}
                                                                        </Link>
                                                                        <button
                                                                            disabled={favorites.updatingFavs}
                                                                            onClick={() => { removeFavorite(item?.products?.id, item?.products?.brand?.id) }}
                                                                            className={`w-6 h-6 shrink-0 flex items-center justify-center ${favorites.updatingFavs ? 'opacity-50' : 'opacity-100'}`}>
                                                                            {/*  */}
                                                                            <RemoveFavIcon className="w-5 h-5 text-red-500" />
                                                                        </button>
                                                                    </div>
                                                                </MenuItem>
                                                            })
                                                            : ''
                                                    }
                                                </Menu>
                                                : ''
                                        }
                                    </div>
                                    : <Link href='/auth/login' target="_self"
                                        className="w-6 h-6 flex items-center justify-center p-0 m-0 relative">
                                        <OutlineHeartIcon className="w-5 h-5 text-slate-800 dark:text-light-gray transition duration-200 hover:text-baby-blue dark:hover:text-baby-blue" />
                                    </Link>
                            }
                            <Link href='/cart' target="_self"
                                className="w-6 h-6 flex items-center justify-center p-0 m-0 relative relative">
                                {
                                    cart.cart && cart.cart.length <= 0
                                        ?
                                        <OutlineCartIcon className="w-5 h-5 text-slate-800 dark:text-light-gray transition duration-200 hover:text-baby-blue dark:hover:text-baby-blue" />
                                        :
                                        <CartIcon className="w-5 h-5 text-blue-500" />
                                }
                                {
                                    cart.cart && cart.cart.length > 0
                                        ?
                                        <span className={`w-fit h-fit rounded-full px-1 text-white bg-red-500 font-medium shadow-md text-sm absolute -top-2 ${cart.cart.reduce((totalQuantity, item) => parseInt(totalQuantity) + parseInt(item.quantity) < 10 ? '-right-1' : '-right-2', 0)}`}>
                                            {cart.cart.reduce((totalQuantity, item) => parseInt(totalQuantity) + parseInt(item.quantity), 0)}
                                        </span>
                                        : ''
                                }
                            </Link>
                            {
                                status === "authenticated" ?
                                    <div className="w-full relative">
                                        <button onClick={handleClick}
                                            className="w-6 h-6 flex items-center justify-center p-0 m-0 relative relative">
                                            {
                                                status === "authenticated"
                                                    ? <Avatar alt={`${profile?.firstname} ${profile?.lastname}`} src={profile?.image} sx={{ "&.MuiAvatar-circular": { maxWidth: "30px", maxHeight: "30px", ml: 2, backgroundColor: theme.theme === "light" ? 'transparent' : '#334155' } }} />
                                                    : <UserOutlineIcon className="w-6 h-6 text-slate-800 dark:text-light-gray transition duration-200 hover:text-baby-blue dark:hover:text-baby-blue" />
                                            }
                                        </button>
                                        {
                                            status === "authenticated" ?
                                                <Menu
                                                    anchorEl={anchorEl}
                                                    id="account-menu"
                                                    open={open}
                                                    onClose={handleClose}
                                                    onClick={handleClose}
                                                    disableScrollLock={true}
                                                    PaperProps={{
                                                        elevation: 0,
                                                        sx: {
                                                            backgroundColor: theme.theme === 'light' ? '#f9fafb' : '#1e293b',
                                                            overflow: 'visible',
                                                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                                            mt: 2,
                                                            ml: 2,
                                                            minWidth: '200px',
                                                            color: theme.theme === 'light' ? '#1e293b' : '#f9fafb',
                                                            '& .MuiAvatar-root': {
                                                                width: 32,
                                                                height: 32,
                                                                ml: -0.5,
                                                                mr: 1,
                                                            },
                                                            '&:before': {
                                                                backgroundColor: theme.theme === 'light' ? '#f9fafb' : '#1e293b',
                                                                content: '""',
                                                                display: 'block',
                                                                position: 'absolute',
                                                                top: 0,
                                                                right: 14,
                                                                width: 10,
                                                                height: 10,
                                                                transform: 'translateY(-50%) rotate(45deg)',
                                                                zIndex: 0,
                                                            },
                                                        },
                                                    }}
                                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                                                    <MenuItem onClick={handleClose}>
                                                        <Link href="/profile" className="w-full flex flex-row items-center">
                                                            {
                                                                profile?.image && profile?.image.length > 0
                                                                    ? <Avatar alt={`${profile?.firstname} ${profile?.lastname}`} src={profile?.image} sx={{ "&.MuiAvatar-circular": { maxWidth: "30px", maxHeight: "30px", backgroundColor: theme.theme === "light" ? 'transparent' : '#334155' } }} />
                                                                    : <Avatar alt={`${profile?.firstname} ${profile?.lastname}`} />
                                                            }
                                                            {profile?.firstname} {profile?.lastname}
                                                        </Link>
                                                    </MenuItem>
                                                    <Divider />
                                                    <MenuItem onClick={handleClose}>
                                                        <Link href="/profile" className="w-full flex flex-row items-center gap-2">
                                                            <SettingsIcon /> Settings
                                                        </Link>
                                                    </MenuItem>
                                                    <MenuItem onClick={handleClose}>
                                                        <form onSubmit={handleLogout}>
                                                            <button className="w-full flex flex-row items-center gap-2">
                                                                <LogoutIcon /> Logout
                                                            </button>
                                                        </form>
                                                    </MenuItem>
                                                </Menu>
                                                : ''
                                        }
                                    </div>
                                    : <Link href="/auth/signin"
                                        className="w-6 h-6 flex items-center justify-center p-0 m-0 relative relative">
                                        <UserOutlineIcon className="w-6 h-6 text-slate-800 dark:text-light-gray transition duration-200 hover:text-baby-blue dark:hover:text-baby-blue" />
                                    </Link>
                            }
                            <div id="mediaMenu" className="w-6 h-6 rounded-full ml-2 relative inline-block sm:hidden">
                                <button type="button"
                                    onClick={toggleMediaMenu}
                                    className="w-6 h-6 flex items-center justify-center p-0 m-0 relative">
                                    <MenuIcon className={`w-6 h-6 transition duration-200 ${mediaMenu ? 'text-baby-blue' : 'text-slate-800 hover:text-baby-blue dark:hover:text-baby-blue dark:text-light-gray'}`} />
                                </button>
                                {
                                    mediaMenu ?
                                        <div className="w-full max-w-[280px] min-w-[280px] flex flex-col gap-0 top-10 right-0 absolute z-50 border border-gray-200 shadow-md bg-white dark:border-slate-700 dark:bg-slate-800 rounded">
                                            <Link href='/' className="text-slate-700 px-4 py-2 dark:text-gray-300">
                                                Home
                                            </Link>
                                            <Link href='#' className="text-slate-700 px-4 py-2 dark:text-gray-300">
                                                Shop
                                            </Link>
                                            <Link href='/brands' className="text-slate-700 px-4 py-2 dark:text-gray-300">
                                                Brands
                                            </Link>
                                            {
                                                true ?
                                                    <Accordion expanded={categoriesAccordion === 'panel2'} onChange={mediaCategoriesAcc('panel2')}
                                                        sx={{
                                                            "&.MuiPaper-elevation": { backgroundColor: theme.theme === "light" ? '#f9fafb' : '#1e293b', border: 'none', paddingLeft: '8px', paddingRight: '8px' },
                                                            "&.MuiButtonBase-root": { padding: 0 }
                                                        }}>
                                                        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header"
                                                            sx={{ "svg": { fill: theme.theme === "light" ? '#334155' : '#d1d5db' } }}>
                                                            <span className="text-slate-700 dark:text-gray-300">
                                                                Categories
                                                            </span>
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            <div className="relative flex flex-col gap-0 max-h-[360px] overflow-y-auto overflow-x-hidden">
                                                                {
                                                                    categories.categories && categories.categories.length > 0 ?
                                                                        categories.categories.map((category: any, i: any) => {
                                                                            return <Link key={i} href={`/category/${category?.id}/${category?.name}`}
                                                                                className="text-slate-700 px-4 py-2 dark:text-gray-300">
                                                                                {category?.name}
                                                                            </Link>
                                                                        })
                                                                        : ''
                                                                }
                                                            </div>
                                                        </AccordionDetails>
                                                    </Accordion>
                                                    : ''
                                            }
                                        </div>
                                        : ''
                                }
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    )
}

export default Navigation;