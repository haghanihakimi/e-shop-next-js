"use client";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import Image from 'next/image';
import Head from "next/head";
import Navigation from "@/app/partials/Navigation";
import React, { useEffect } from "react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { debounce } from 'lodash';
import { HiChevronDown as DropdownIcon, HiCheckCircle as CheckMarkIcon } from "react-icons/hi2";
import { MdDeleteForever as DeleteIcon } from "react-icons/md";
import { getTheme } from "@/app/store/reducers/theme";
import { useCountries } from "@/app/store/actions/countries";
import Loading from "@/app/partials/Loading";
import Breadcrumbs from "@/app/partials/Breadcrumb";
import Footer from "@/app/partials/Footer";
import { RootState } from "@/app/store/store";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import "@/app/(pages)/cart/page.css";
import { useCouriers } from "@/app/store/actions/couriers";
import { setCouriers } from "@/app/store/reducers/couriers";
import { updateCart, deleteCartItem, emptyCart } from "@/app/store/reducers/cart";
import Link from "next/dist/client/link";
import CountUp from 'react-countup'
import { useOrders } from "@/app/store/actions/orders";
import { useProducts } from "@/app/store/actions/products";
import { useRouter } from "next/navigation";
import FavoriteButton from "@/app/partials/FavoriteButton";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface RecipientInfo {
    firstname: string;
    surname: string;
    email: string;
    phone: string;
}

interface DeliveryInfo {
    street: string;
    city: string;
    postcode: string;
    cityList: boolean;
    postcodesList: boolean;
    courier: any;
}

interface CreditCard {
    firstname: string;
    lastname: string;
    number: any;
    date: any;
    validDate: any;
    ccv: any
    validCCV: boolean;
}

const CartContainer = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const theme = useSelector((state: RootState) => state.theme);
    const cart = useSelector((state: RootState) => state.cart);
    const countries = useSelector((state: RootState) => state.countries);
    const couriers = useSelector((state: RootState) => state.couriers);
    const stock = useSelector((state: RootState) => state.products);
    const cityWrapper = React.useRef(null)
    const postcodeWrapper = React.useRef(null)
    const [expandedAccPersonal, setExpandedAccPersonal] = React.useState<boolean>(true);
    const [expandedAccDelivery, setExpandedAccDelivery] = React.useState<boolean>(false);
    const [expandedPaymentMethod, setExpandedPaymentMethod] = React.useState<boolean>(false);
    // const [selectedCountry, setSelectedCountry] = React.useState<string>('');
    const [states, setStates] = React.useState<string>('');
    const [recipientInfo, setRecipientInfo] = React.useState<RecipientInfo>({
        firstname: '',
        surname: '',
        email: '',
        phone: '',
    });
    const [deliveryInfo, setDeliveryInfo] = React.useState<DeliveryInfo>({
        street: '',
        city: '',
        postcode: '',
        cityList: false,
        postcodesList: false,
        courier: {},
    });
    const [creditCards, setCreditCards] = React.useState<CreditCard>({
        firstname: '',
        lastname: '',
        number: '',
        date: '',
        validDate: false,
        ccv: '',
        validCCV: false,
    });
    const { getCountries } = useCountries();
    const { getSuburbs, getCouriers } = useCouriers();
    const { placeOrder } = useOrders();
    const { getProductStocks } = useProducts();
    const [loadingCouriers, setLoadingCouriers] = React.useState<boolean>(false);
    const [placingOrder, setPlacingOrder] = React.useState<boolean>(false);

    const dispatch = useDispatch();

    const calculateDiscountInDollars = (item: any) => {
        const discountPercentage = parseFloat(item.discount);
        const price = parseFloat(item.price) * parseFloat(item.quantity);
        const discountInDollars = (discountPercentage / 100) * price;
        return discountInDollars;
    };

    let totalDiscountInDollars = 0;
    cart.cart.forEach((item) => {
        totalDiscountInDollars += calculateDiscountInDollars(item);
    });

    const handleAccPersonal = () => {
        setExpandedAccPersonal(expandedAccPersonal ? false : true);
        setExpandedPaymentMethod(false);
    };
    const handleAccDelivery = () => {
        setExpandedAccDelivery(expandedAccDelivery ? false : true);
        setExpandedPaymentMethod(false);
    };
    const handlePaymentMethodAccordion = () => {
        setExpandedPaymentMethod(expandedPaymentMethod ? false : true);
        setExpandedAccDelivery(false);
        setExpandedAccPersonal(false);
    }
    const checkPersonalInfo = () => {
        return recipientInfo.firstname.length <= 0 || recipientInfo.surname.length <= 0 || recipientInfo.phone.length <= 0 || recipientInfo.email.length <= 0
    }
    const checkDeliveryInfo = () => {
        return deliveryInfo.street.length <= 0 || deliveryInfo.city.length <= 0 || deliveryInfo.postcode.length <= 0 || Object.keys(deliveryInfo.courier).length <= 0 || couriers.couriers.length <= 0
    }
    const checkPaymentInfo = () => {
        return creditCards.firstname.length <= 0 || creditCards.lastname.length <= 0 || creditCards.number.length <= 0 || checkCardType(creditCards.number).length <= 0 || !creditCards.validDate || !creditCards.validCCV
    }
    const checkCardType = (number: any) => {
        const masterCardPattern = /^(5[1-5]\d{2}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4})$/;
        const visaCardPattern = /^(4\d{3}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}|4\d{3}[ -]?\d{4}[ -]?\d{4})$/;
        // visa
        if (visaCardPattern.test(number)) {
            return "Visa";
        }

        // Mastercard 
        if (masterCardPattern.test(number)) {
            return "Master Card";
        }

        return "";
    }
    const formatCard = (value: any) => {
        const v = value
            .replace(/\s+/g, "")
            .replace(/[^0-9]/gi, "")
            .substr(0, 16);
        const parts: string[] = [];

        for (let i = 0; i < v.length; i += 4) {
            parts.push(v.substr(i, 4));
        }

        checkCardType(value);
        setCreditCards((prevInfo) => ({ ...prevInfo, number: parts.length > 1 ? parts.join(" ") : value }))
    }
    const formatDate = (value: any) => {
        const currentYear = new Date().getFullYear();
        const twoDigitYear = parseInt(currentYear.toString().slice(-2), 10);
        const currentMonth = new Date().getMonth() + 1;
        const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "").substr(0, 4);
        const parts: string[] = [];

        for (let i = 0; i < v.length; i += 2) {
            parts.push(v.substr(i, 2));
        }

        const inputYear = parseInt(parts[1], 10);
        const inputMonth = parseInt(parts[0], 10);

        if (inputYear >= twoDigitYear && inputMonth <= 12) {
            if ((inputYear === twoDigitYear && inputMonth >= currentMonth) || inputYear > twoDigitYear) {
                setCreditCards((prevInfo) => ({ ...prevInfo, validDate: true }))
            } else {
                setCreditCards((prevInfo) => ({ ...prevInfo, validDate: false }))
            }
        } else {
            setCreditCards((prevInfo) => ({ ...prevInfo, validDate: false }))
        }

        setCreditCards((prevInfo) => ({ ...prevInfo, date: parts.length > 1 ? parts.join("/") : value }))
    }
    const getCreditCardCCV = (value: any) => {
        const inputDigits = value.replace(/\D/g, '');

        const limitedInput = inputDigits.slice(0, 4);

        // setCreditCardCCV(limitedInput);
        setCreditCards((prevInfo) => ({ ...prevInfo, ccv: limitedInput }));
        setCreditCards((prev: any) => ({ ...prev, validCCV: true }));
    }
    const converShortStates = (state: any) => {
        switch (state) {
            case "ACT":
                return "Australian Capital Territory"
            case "NSW":
                return "New South Wales";
            case "NT":
                return "Northern Territory";
            case "QLD":
                return "Queensland";
            case "SA":
                return "South Australia";
            case "TS":
                return "Tasmania";
            case "VIC":
                return "Victoria";
            case "WA":
                return "Western Australia";
            default:
                return "";
        }
    }
    const searchSuburbs = (value: any) => {
        setDeliveryInfo((prevInfo) => ({ ...prevInfo, city: value }));
        if (value.length > 0) {
            const debouncedGetSuburbs = debounce(() => {
                getSuburbs(value).then(() => {
                    setDeliveryInfo((prevInfo) => ({ ...prevInfo, cityList: true }));
                });
            }, 2000);

            debouncedGetSuburbs(); // Call the debounced function
        }
    };
    const searchPostCodes = (value: any) => {
        setDeliveryInfo((prevInfo) => ({ ...prevInfo, postcode: value }));
        if (value.length > 0) {
            const debouncedGetSuburbs = debounce(() => {
                getSuburbs(value).then(() => {
                    setDeliveryInfo((prevInfo) => ({ ...prevInfo, postcodesList: true }));
                });
            }, 2000);

            debouncedGetSuburbs(); // Call the debounced function
        }
    }
    const setSuburbPostcode = (city: any, postcode: any, state: any) => {
        setStates(converShortStates(state));
        setDeliveryInfo((prevInfo) => ({ ...prevInfo, city: city, postcode: postcode, cityList: false, postcodesList: false, }))
        setLoadingCouriers(true);
        getCouriers({
            suburb: city,
            state: state,
            postcode: postcode,
            weight: cart.cart.reduce((totalWeight, item) => parseFloat(totalWeight) + parseFloat(item.weight), 0),
            length: cart.cart.reduce((totalLength, item) => parseFloat(totalLength) + parseFloat(item.length), 0),
            width: cart.cart.reduce((totalWidth, item) => parseFloat(totalWidth) + parseFloat(item.width), 0),
            height: cart.cart.reduce((totalHeight, item) => parseFloat(totalHeight) + parseFloat(item.height), 0),
            quantity: cart.cart.reduce((totalQuantity, item) => parseInt(totalQuantity) + parseInt(item.quantity), 0),
        }).then(() => { setLoadingCouriers(false) });
    }
    const completeOrder = () => {
        if (recipientInfo.firstname.length > 0 && recipientInfo.surname.length > 0 && recipientInfo.email.length > 0 && recipientInfo.phone.length > 0) {
            if (deliveryInfo.city.length > 0 && deliveryInfo.postcode.length > 0 && deliveryInfo.street.length > 0 && Object.keys(deliveryInfo.courier).length > 0) {
                if ((checkCardType(creditCards.number) === "Master Card" || checkCardType(creditCards.number) === "Visa") &&
                    creditCards.validCCV && creditCards.firstname.length > 0 && creditCards.lastname.length > 0) {
                    setPlacingOrder(true);
                    placeOrder({
                        cart: cart?.cart,
                        delivery: deliveryInfo?.courier,
                        cardNumber: creditCards.number,
                        cardType: checkCardType(creditCards.number),
                    }).then(() => {
                        setPlacingOrder(false);
                        dispatch(emptyCart());
                    });
                } else {
                    toast.error("Please fill valid payment info");
                }
            } else {
                toast.error("Please fill delivery info");
            }
        } else {
            toast.error("Please fill Recipient Info fields.");
        }
    }

    useEffect(() => {
        dispatch(getTheme());
        getCountries().then(async () => {
            await getProductStocks(cart.cart);
        });
        if (countries.countries && countries.countries.length > 0) {
            // setSelectedCountry(countries.countries[0].country);
        }
        const hideCitiesList = (event: any) => {
            if (cityWrapper.current && !(cityWrapper.current as HTMLElement).contains(event.target)) {
                setDeliveryInfo((prevInfo) => ({ ...prevInfo, cityList: false }))
            }
            if (postcodeWrapper.current && !(postcodeWrapper.current as HTMLElement).contains(event.target)) {
                setDeliveryInfo((prevInfo) => ({ ...prevInfo, postcodesList: false }))
            }
        }

        if (status === "authenticated") {
            setRecipientInfo((prev: any) => ({
                ...prev,
                firstname: session.user?.firstname,
                surname: session.user?.lastname,
                email: session.user?.email,
                phone: session.user?.phone,
            }))

            setDeliveryInfo((prev: any) => ({
                ...prev,
                street: session.user?.street,
                city: session.user?.city,
                postcode: session.user?.postcode,
                courier: {},
            }))

            setStates(session.user?.state)
        }

        document.addEventListener('click', hideCitiesList, true);
        document.addEventListener('contextmenu', hideCitiesList, true);
        return () => {
            document.removeEventListener('click', hideCitiesList, true);
            document.removeEventListener('contextmenu', hideCitiesList, true);
            dispatch(setCouriers([]));
            setDeliveryInfo((prev) => ({
                ...prev,
                courier: {}
            }));
        };
        // const askForNotificationPermission = async () => {
        //     try {
        //         const permissionResult = await Notification.requestPermission();
        //         return permissionResult === "granted";
        //     } catch (error) {
        //         console.error("Error requesting notification permission:", error);
        //         return false;
        //     }
        // };

        // const displayNotification = (title: any, options: any, url: any) => {
        //     if (Notification.permission === "granted") {
        //         const notification = new Notification(title, options);
        //         notification.onclick = () => {
        //             window.open(url, "_blank");
        //             notification.close();
        //         };
        //     }
        // };

        // const showNotification = async () => {
        //     const permissionGranted = await askForNotificationPermission();
        //     if (permissionGranted) {
        //         displayNotification(
        //             "New Message",
        //             {
        //                 body: "You have received a new message!",
        //                 icon: "https://next-status === "authenticated".js.org/img/logo/logo-xs.png",
        //             },
        //             "http://localhost:3000/cart" 
        //         );
        //     }
        // };

        // showNotification();
    }, [countries.countries, cart.cart, status])

    return (
        <main className="w-full relative h-auto pb-12">
            <Head>
                <title>eShop - Cart</title>
                <meta property="og:eShop-Cart" content="eShop - Cart" key="eShop-Cart" />
            </Head>
            <Navigation />
            {
                cart.cart
                    ?
                    <div className="w-full relative">
                        <div className="w-full max-w-6xl relative m-auto p-2 md:p-8 text-sm p-4">
                            <Breadcrumbs paths={[
                                { path: 'home', link: '/' },
                                { path: 'cart', link: '/cart' },
                            ]} />
                            {/* Cart heading texts */}
                            {
                                cart.cart.length > 0 ?
                                    <div className="w-full flex flex-col gap-0 mt-3 py-2">
                                        <h3 className="w-full text-left text-lg text-slate-800 font-bold dark:text-light-gray">
                                            Payment Details
                                        </h3>
                                        <p className="text-base font-slate-800 font-normal dark:text-light-gray">
                                            Complete your purchase by providing your payment details.
                                        </p>
                                    </div>
                                    : <h2 className="text-lg font-bold text-center py-8 px-4 text-slate-400 dark:text-gray-400">
                                        Cart is currently empty
                                    </h2>
                            }

                            {
                                cart.cart.length > 0 ?
                                    <div className="w-full flex flex-row gap-4 justify-between items-start">
                                        {/* cart full information */}
                                        <div className="w-full min-h-[200px] max-w-[700px] flex flex-col gap-0 relative rounded">
                                            {
                                                status === "authenticated"
                                                    ?
                                                    <div className="w-full h-auto relative">
                                                        <Accordion disabled={status !== "authenticated"} expanded={expandedAccPersonal && status === "authenticated"} onChange={handleAccPersonal} sx={{ "&.MuiPaper-elevation": { backgroundColor: theme.theme === 'light' ? '#f9fafb' : '#1e293b', border: theme.theme === 'light' ? '1px solid #f1f5f9' : '1px solid #334155', borderBottom: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', opacity: status === "authenticated" ? '1.0' : '0.7' }, "&.MuiPaper-elevation:before": { backgroundColor: 'transparent' }, "&.Mui-expanded": { margin: 0 } }}>
                                                            <AccordionSummary
                                                                expandIcon={<DropdownIcon className="w-4 h-4 text-slate-800 dark:text-light-gray" />}
                                                                aria-controls="payment-methods-content"
                                                                id="payment-methods-header">
                                                                <Typography className="flex flex-row items-center justify-start gap-2 text-slate-800 dark:text-light-gray">
                                                                    <strong className="text-lg font-bold text-slate-800 dark:text-light-gray">
                                                                        Recipient Info
                                                                    </strong>
                                                                    {
                                                                        !checkPersonalInfo()
                                                                            ? <CheckMarkIcon className="w-5 h-5 text-green-500 dark:text-green-400" />
                                                                            : ''
                                                                    }
                                                                </Typography>
                                                            </AccordionSummary>
                                                            <AccordionDetails>
                                                                <div className="w-full flex flex-row flex-wrap gap-4 justify-between items-center select-none">
                                                                    <input type="text" placeholder="First Name"
                                                                        defaultValue={recipientInfo.firstname}
                                                                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => { setRecipientInfo((prevInfo) => ({ ...prevInfo, firstname: e.target.value })) }}
                                                                        className="w-full min-w-[280px] bg-white rounded flex-1 border border-gray-300 text-slate-800 transition duration-150 ring-4 ring-transparent focus:ring-2 focus:ring-blue-600 dark:border-slate-600 dark:text-light-gray dark:bg-slate-700" />
                                                                    <input type="text" placeholder="Last Name"
                                                                        defaultValue={recipientInfo.surname}
                                                                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => { setRecipientInfo((prevInfo) => ({ ...prevInfo, surname: e.target.value })) }}
                                                                        className="w-full min-w-[280px] bg-white rounded flex-1 border border-gray-300 text-slate-800 transition duration-150 ring-4 ring-transparent focus:ring-2 focus:ring-blue-600 dark:border-slate-600 dark:text-light-gray dark:bg-slate-700" />
                                                                    <input type="email" placeholder="Email Address"
                                                                        defaultValue={recipientInfo.email}
                                                                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => { setRecipientInfo((prevInfo) => ({ ...prevInfo, email: e.target.value })) }}
                                                                        className="w-full min-w-[280px] bg-white rounded flex-1 border border-gray-300 text-slate-800 transition duration-150 ring-4 ring-transparent focus:ring-2 focus:ring-blue-600 dark:border-slate-600 dark:text-light-gray dark:bg-slate-700" />
                                                                    <input type="tel" placeholder="Phone"
                                                                        defaultValue={recipientInfo.phone}
                                                                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => { setRecipientInfo((prevInfo) => ({ ...prevInfo, phone: e.target.value, validPhone: e.target.value.length > 0 ? true : false })) }}
                                                                        className="w-full min-w-[280px] flex-1 bg-white rounded border border-gray-300 text-slate-800 transition duration-150 ring-4 ring-transparent focus:ring-2 focus:ring-blue-600 dark:border-slate-600 dark:text-light-gray dark:bg-slate-700" />
                                                                </div>
                                                            </AccordionDetails>
                                                        </Accordion>
                                                        <Accordion
                                                            disabled={status !== "authenticated"}
                                                            expanded={expandedAccDelivery && status === "authenticated"} onChange={handleAccDelivery}
                                                            sx={{ "&.MuiPaper-elevation": { backgroundColor: theme.theme === 'light' ? '#f9fafb' : '#1e293b', border: theme.theme === 'light' ? '1px solid #f1f5f9' : '1px solid #334155', borderBottom: theme.theme === 'light' ? '1px solid #e5e7eb' : '1px solid #334155', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', opacity: status === "authenticated" ? '1.0' : '0.7' }, "&.MuiPaper-elevation:before": { backgroundColor: 'transparent' }, "&.Mui-expanded": { margin: 0 } }}>
                                                            <AccordionSummary
                                                                expandIcon={<DropdownIcon className="w-4 h-4 text-slate-800 dark:text-light-gray" />}
                                                                aria-controls="payment-methods-content"
                                                                id="payment-methods-header">
                                                                <Typography className="flex flex-row items-center justify-start gap-2 text-slate-800 dark:text-light-gray">
                                                                    <strong className="text-lg font-bold text-slate-800 dark:text-light-gray">
                                                                        Delivery Info
                                                                    </strong>
                                                                    {
                                                                        !checkDeliveryInfo()
                                                                            ? <CheckMarkIcon className="w-5 h-5 text-green-500 dark:text-green-400" />
                                                                            : ''
                                                                    }
                                                                </Typography>
                                                            </AccordionSummary>
                                                            <AccordionDetails>
                                                                <div className="w-full relative flex flex-col select-none gap-4">
                                                                    {/* <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { setSelectedCountry(e.target.value) }} value={selectedCountry}
                                                className="w-full text-base cursor-pointer bg-white rounded flex-1 border border-gray-300 text-slate-800 transition duration-150 ring-4 ring-transparent focus:ring-2 focus:ring-blue-600 dark:border-slate-600 dark:text-light-gray dark:bg-slate-700">
                                                {
                                                    countries.countries && countries.countries.length > 0
                                                        ?
                                                        countries.countries.map((country, i) => {
                                                            return <option value={country.country} key={i} defaultChecked={countries.countries[0].country}>{country.country}</option>
                                                        })
                                                        : ''
                                                }
                                            </select> */}
                                                                    <input type="text" placeholder="Street Address"
                                                                        defaultValue={deliveryInfo.street}
                                                                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => { setDeliveryInfo((prevInfo) => ({ ...prevInfo, street: e.target.value })) }}
                                                                        className="w-full min-w-[280px] bg-white rounded flex-1 border border-gray-300 text-slate-800 transition duration-150 ring-4 ring-transparent focus:ring-2 focus:ring-blue-600 dark:border-slate-600 dark:text-light-gray dark:bg-slate-700" />
                                                                    <div className="w-full relative flex flex-row flex-wrap gap-4">
                                                                        <div className="relative w-auto flex-1">
                                                                            <input type="text" placeholder="City"
                                                                                value={deliveryInfo.city}
                                                                                onInput={(e: React.ChangeEvent<HTMLInputElement>) => { searchSuburbs(e.target.value) }}
                                                                                className="w-full min-w-[280px] bg-white rounded border border-gray-300 text-slate-800 transition duration-150 ring-4 ring-transparent focus:ring-2 focus:ring-blue-600 dark:border-slate-600 dark:text-light-gray dark:bg-slate-700" />
                                                                            {
                                                                                couriers.suburbs && couriers.suburbs.length > 0 && deliveryInfo.cityList ?
                                                                                    <div ref={cityWrapper} className="w-full max-h-[380px] overflow-auto absolute top-11 left-0 bg-gray-100 rounded shadow-md z-10 border border-slate-200 dark:bg-slate-700 dark:border-slate-500">
                                                                                        <ul>
                                                                                            {
                                                                                                couriers.suburbs.map((suburb: any, i: any) => {
                                                                                                    return <li key={i}
                                                                                                        onClick={() => { setSuburbPostcode(suburb.name, suburb.postcode, suburb.state) }}
                                                                                                        className="block p-2 text-md font-semibold tracking-wide text-slate-700 select-none cursor-pointer transition duration-150 hover:bg-gray-200 dark:hover:bg-slate-600 dark:text-light-gray">
                                                                                                        <span>{suburb.name}, {suburb.state}, {suburb.postcode}</span>
                                                                                                    </li>
                                                                                                })
                                                                                            }
                                                                                        </ul>
                                                                                    </div>
                                                                                    : ''
                                                                            }
                                                                        </div>
                                                                        <div className="relative w-auto flex-1">
                                                                            <input type="text" placeholder="Postcode"
                                                                                value={deliveryInfo.postcode}
                                                                                onInput={(e: React.ChangeEvent<HTMLInputElement>) => { searchPostCodes(e.target.value) }}
                                                                                className="w-full min-w-[280px] bg-white rounded border border-gray-300 text-slate-800 transition duration-150 ring-4 ring-transparent focus:ring-2 focus:ring-blue-600 dark:border-slate-600 dark:text-light-gray dark:bg-slate-700" />
                                                                            {
                                                                                couriers.suburbs && couriers.suburbs.length > 0 && deliveryInfo.postcodesList ?
                                                                                    <div ref={postcodeWrapper} className="w-full max-h-[380px] overflow-auto absolute top-11 left-0 bg-gray-100 rounded shadow-md z-10 border border-slate-200 dark:bg-slate-700 dark:border-slate-500">
                                                                                        <ul>
                                                                                            {
                                                                                                couriers.suburbs.map((suburb: any, i: any) => {
                                                                                                    return <li key={i}
                                                                                                        onClick={() => { setSuburbPostcode(suburb.name, suburb.postcode, suburb.state) }}
                                                                                                        className="block p-2 text-md font-semibold tracking-wide text-slate-700 select-none cursor-pointer transition duration-150 hover:bg-gray-200 dark:hover:bg-slate-600 dark:text-light-gray">
                                                                                                        <span>{suburb.name}, {suburb.state}, {suburb.postcode}</span>
                                                                                                    </li>
                                                                                                })
                                                                                            }
                                                                                        </ul>
                                                                                    </div>
                                                                                    : ''
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { setStates(e.target.value) }} value={states}
                                                                        className="w-full text-base cursor-pointer bg-white rounded flex-1 border border-gray-300 text-slate-800 transition duration-150 ring-4 ring-transparent focus:ring-2 focus:ring-blue-600 dark:border-slate-600 dark:text-light-gray dark:bg-slate-700">
                                                                        {
                                                                            countries.countries && countries.countries.length > 0
                                                                                ?
                                                                                countries.countries.map((country, i) => {
                                                                                    if (country.country === 'Australia') {
                                                                                        return JSON.parse(country.states).map((state: any, j: any) => {
                                                                                            return <option value={state} key={j} defaultValue={state === session.user?.state ? session.user?.state : country.states[0]}>{state}</option>
                                                                                        })
                                                                                    }
                                                                                })
                                                                                : ''
                                                                        }
                                                                    </select>
                                                                    <span className="p-2 text-base font-semibold text-slate-700 dark:text-light-gray">
                                                                        Available Couriers:
                                                                    </span>
                                                                    {
                                                                        loadingCouriers
                                                                            ? <div className='w-full p-0 m-0 flex flex-row gap-2 justify-start items-center'>
                                                                                Loading Couriers <Loading color='text-black text-opacity-10 fill-baby-blue' width={6} height={6} />
                                                                            </div>
                                                                            :
                                                                            couriers.couriers && couriers.couriers.length > 0 ?
                                                                                <Swiper
                                                                                    slidesPerView={6}
                                                                                    centeredSlides={false}
                                                                                    spaceBetween={30}
                                                                                    pagination={{
                                                                                        type: 'fraction',
                                                                                    }}
                                                                                    navigation={true}
                                                                                    className="mySwiper">
                                                                                    {
                                                                                        couriers.couriers.map((courier: any, i: any) => {
                                                                                            return <SwiperSlide key={i} className="flex flex-col gap-2 items-center justify-center cursor-pointer select-none">
                                                                                                <Image src={courier.logo}
                                                                                                    alt={courier.name}
                                                                                                    width={120}
                                                                                                    height={120} className="cursor-pointer select-none" />
                                                                                                <label htmlFor={`courier-${courier.quoteId}`} className="cursor-pointer select-none flex flex-col justify-center items-center gap-1 text-center text-sm text-slate-900 dark:text-slate-200">
                                                                                                    <input type="radio" id={`courier-${courier.quoteId}`} name="courier" value={JSON.stringify({ courierName: courier.name, priceExcludingGst: courier.priceExcludingGst, priceIncludingGst: courier.priceIncludingGst })}
                                                                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setDeliveryInfo((prevInfo) => ({ ...prevInfo, courier: JSON.parse(e.target.value) })) }}
                                                                                                        className="w-4 h-4 cursor-pointer select-none rounded-full ring-0 outline-none border-2 border-slate-400 focus:ring-0 focus:outline-none dark:border-slate-500" />
                                                                                                    <span>{courier.name}</span>
                                                                                                    <span>({courier.eta})</span>
                                                                                                </label>
                                                                                            </SwiperSlide>
                                                                                        })
                                                                                    }
                                                                                </Swiper>
                                                                                : ''
                                                                    }
                                                                </div>
                                                            </AccordionDetails>
                                                        </Accordion>
                                                        <Accordion
                                                            disabled={status !== "authenticated"}
                                                            expanded={expandedPaymentMethod && status === "authenticated"} onChange={handlePaymentMethodAccordion}
                                                            sx={{ "&.MuiPaper-elevation": { backgroundColor: theme.theme === 'light' ? '#f9fafb' : '#1e293b', border: theme.theme === 'light' ? '1px solid #f1f5f9' : '1px solid #334155', borderTop: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', opacity: status === "authenticated" ? '1.0' : '0.7' }, "&.MuiPaper-elevation:before": { backgroundColor: 'transparent' }, "&.Mui-expanded": { margin: 0 } }}>
                                                            <AccordionSummary
                                                                expandIcon={<DropdownIcon className="w-4 h-4 text-slate-800 dark:text-light-gray" />}
                                                                aria-controls="payment-methods-content"
                                                                id="payment-methods-header">
                                                                <Typography className="flex flex-row items-center justify-start gap-2 text-slate-800 dark:text-light-gray">
                                                                    <strong className="text-lg font-bold text-slate-800 dark:text-light-gray">
                                                                        Payment Info
                                                                    </strong>
                                                                    {
                                                                        !checkPaymentInfo()
                                                                            ? <CheckMarkIcon className="w-5 h-5 text-green-500 dark:text-green-400" />
                                                                            : ''
                                                                    }
                                                                </Typography>
                                                            </AccordionSummary>
                                                            <AccordionDetails>
                                                                <div className="w-full relative flex flex-col select-none gap-4">
                                                                    <div className="flex flex-col gap-2 w-full">
                                                                        <div className="w-full flex flex-row gap-2 items-center justify-center">
                                                                            <input type="text" placeholder="First Name"
                                                                                onInput={(e: React.ChangeEvent<HTMLInputElement>) => { setCreditCards((prev) => ({ ...prev, firstname: e.target.value })) }}
                                                                                value={creditCards.firstname}
                                                                                className='w-full min-w-[280px] bg-white rounded flex-1 border border-gray-300 text-slate-800 transition duration-150 ring-4 ring-transparent focus:ring-2 focus:ring-blue-600 dark:border-slate-600 dark:text-light-gray dark:bg-slate-700' />
                                                                            <input type="text" placeholder="Last Name"
                                                                                onInput={(e: React.ChangeEvent<HTMLInputElement>) => { setCreditCards((prev) => ({ ...prev, lastname: e.target.value })) }}
                                                                                value={creditCards.lastname}
                                                                                className='w-full min-w-[280px] bg-white rounded flex-1 border border-gray-300 text-slate-800 transition duration-150 ring-4 ring-transparent focus:ring-2 focus:ring-blue-600 dark:border-slate-600 dark:text-light-gray dark:bg-slate-700' />
                                                                        </div>
                                                                        <div className="flex flex-row gap-0 items-center justify-start w-full border border-slate-200 rounded dark:border-slate-600">
                                                                            <div className="w-full relative">
                                                                                {
                                                                                    checkCardType(creditCards.number) === 'Visa'
                                                                                        ? <Image src={'https://cdn-icons-png.flaticon.com/512/179/179457.png'}
                                                                                            alt="Visa Card payment"
                                                                                            width={30}
                                                                                            height={30}
                                                                                            className="absolute left-2 top-0 bottom-0 my-auto" />
                                                                                        : ''
                                                                                }
                                                                                {
                                                                                    checkCardType(creditCards.number) === 'Master Card'
                                                                                        ? <Image src={'https://cdn-icons-png.flaticon.com/512/11041/11041055.png'}
                                                                                            alt="Visa Card payment"
                                                                                            width={30}
                                                                                            height={30}
                                                                                            className="absolute left-2 top-0 bottom-0 my-auto" />
                                                                                        : ''
                                                                                }
                                                                                <input type="text" placeholder="Card Number"
                                                                                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => { formatCard(e.target.value); }}
                                                                                    value={creditCards.number}
                                                                                    className={`w-full h-10 no-arrow ${checkCardType(creditCards.number).length > 0 ? 'px-11' : 'px-3'} bg-white rounded-tl rounded-bl flex-1 text-slate-800 ring-0 outline-none p-0 border-0 border-r border-slate-200 rounded-none focus:ring-0 focus:outline-none focus:border-slate-200 dark:focus:border-slate-600 dark:text-light-gray dark:bg-slate-700 dark:border-slate-600`} />
                                                                            </div>
                                                                            <input type="text" placeholder="MM/DD"
                                                                                onInput={(e: React.ChangeEvent<HTMLInputElement>) => { formatDate(e.target.value); }}
                                                                                value={creditCards.date}
                                                                                className={`w-16 h-10 ${creditCards.validDate ? 'text-slate-800 dark:text-light-gray' : 'text-red-500 dark:text-red-500'} bg-white dark:bg-slate-700 rounded flex-1 text-center outline-none p-0 border-0 border-r border-slate-200 rounded-none ring-0 focus:ring-0 focus:outline-none focus:border-slate-200 dark:focus:border-slate-600 dark:border-slate-600`} />
                                                                            <input type="text" placeholder="CCV"
                                                                                value={creditCards.ccv}
                                                                                onInput={(e: React.ChangeEvent<HTMLInputElement>) => { getCreditCardCCV(e.target.value); }}
                                                                                className='w-14 h-10 no-arrow bg-white rounded-tr rounded-br flex-1 text-slate-800 text-center ring-0 outline-none p-0 border-0 rounded-none focus:ring-0 dark:text-light-gray dark:bg-slate-700' />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </AccordionDetails>
                                                        </Accordion>
                                                    </div>
                                                    :
                                                    <h4 className="w-full text-lg py-4 px-2 font-bold text-slate-700 dark:text-white">
                                                        Please login to finish payment details...
                                                    </h4>
                                            }

                                            {/* Cart products list */}
                                            {
                                                cart.cart && cart.cart.length > 0 ?
                                                    <div className="w-full relative h-auto mt-4 flex flex-col gap-4">
                                                        {
                                                            cart.cart.map((cart: any, i: any) => {
                                                                return <div key={i} className="w-full flex flex-row gap-0 items-start justify-between border border-slate-200 p-2 rounded shadow-md dark:border-slate-700">
                                                                    {/* Product image container */}
                                                                    <div className="w-fit h-auto select-none flex items-center justify-center rounded aspect-square">
                                                                        <Link href={`/view/product/${(cart.category[0].category.name).toLowerCase()}/${cart.id}/${(cart.title).replace(/ /g, "-").toLowerCase()}`}>
                                                                            <Image src={cart.image}
                                                                                alt={cart.title}
                                                                                width={120}
                                                                                height={120}
                                                                                className="w-24 h-24 max-w-[96px] object-cover aspect-square w-auto rounded shadow-sm border border-gray-100" />
                                                                        </Link>
                                                                    </div>
                                                                    {/* Product text */}
                                                                    <div className="w-full flex flex-col gap-1 px-2">
                                                                        <h2 className="text-left w-full text-base font-semibold">
                                                                            <Link href={`/view/product/${(cart.category[0].category.name).toLowerCase()}/${cart.id}/${(cart.title).replace(/ /g, "-").toLowerCase()}`} className="text-slate-700 dark:text-light-gray">
                                                                                {cart.title}
                                                                                {cart.capacity ? <span> - {cart.capacity}</span> : ''} {cart.colorName ? <span className="capitalize"> {cart.colorName}</span> : ''}
                                                                                {cart.dimensions ? <span> - {`${cart.dimensions}"`}</span> : ''}
                                                                            </Link>
                                                                        </h2>
                                                                        <span className="text-md font-semibold text-gray-500 dark:text-gray-400">
                                                                            <CountUp
                                                                                start={0}
                                                                                end={cart.price}
                                                                                duration={0.5}
                                                                                useEasing={true}
                                                                                decimals={2}
                                                                                decimal="."
                                                                                prefix="Price: $"
                                                                            />
                                                                        </span>
                                                                        <div className="flex flex-row items-center gap-1 w-fit text-md font-semibold text-gray-500 dark:text-gray-400">
                                                                            Quantity: <input type="number" max={cart.limit} min={1} value={cart.quantity}
                                                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => { dispatch(updateCart({ id: cart.id, color: cart.color, capacity: cart.capacity, dimensions: cart.dimensions, newQuantity: e.target.value })) }}
                                                                                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => { e.preventDefault() }}
                                                                                className="w-8 h-7 px-1 py-0 bg-white rounded border border-gray-300 text-slate-800 transition duration-150 ring-4 ring-transparent focus:ring-2 focus:ring-blue-600 dark:border-slate-600 dark:text-light-gray dark:bg-slate-700" />
                                                                        </div>
                                                                        <span className="text-md font-semibold text-gray-500 dark:text-gray-400">
                                                                            Total Price: ${(cart.price * cart.quantity).toFixed(2)} {cart.discount > 0 ? ` - $${((cart.price * cart.quantity) * (cart.discount / 100)).toFixed(2)} = $${((cart.price * cart.quantity) - ((cart.price * cart.quantity) * (cart.discount / 100))).toFixed(2)}` : ''}
                                                                        </span>
                                                                    </div>
                                                                    {/* Controls */}
                                                                    <div className="w-fit h-auto mt-0 flex flex-col gap-1 items-center justify-between">
                                                                        <button
                                                                            onClick={() => { dispatch(deleteCartItem({ id: cart.id })) }}
                                                                            className="w-6 h-6 flex justify-center items-center rounded">
                                                                            <DeleteIcon className="w-5 h-5 text-red-600" />
                                                                        </button>
                                                                        {
                                                                            status === "authenticated"
                                                                                ?
                                                                                <div className="w-5 h-5 relative flex justify-center items-center">
                                                                                    <FavoriteButton product={cart} />
                                                                                </div>
                                                                                : ''
                                                                        }
                                                                    </div>
                                                                </div>
                                                            })
                                                        }
                                                    </div>
                                                    : ''
                                            }
                                            {
                                                stock.outStock && stock.outStock.length > 0 ?
                                                    <div className="w-full relative h-auto mt-4 flex flex-col gap-4">
                                                        {
                                                            stock.outStock.map((stock: any, i: any) => {
                                                                return <div key={i} className="w-full flex flex-row gap-0 items-start justify-between border border-slate-200 p-2 rounded shadow-md dark:border-slate-700">
                                                                    {/* Product image container */}
                                                                    <div className="w-fit h-auto opacity-50 select-none flex items-center justify-center rounded aspect-square">
                                                                        <Image src={stock.thumbnail}
                                                                            alt={stock.title}
                                                                            width={120}
                                                                            height={120}
                                                                            className="w-24 h-24 max-w-[96px] object-cover aspect-square w-auto rounded shadow-sm border border-gray-100" />
                                                                    </div>
                                                                    {/* Product text */}
                                                                    <div className="w-full flex flex-col gap-1 px-2">
                                                                        <h2 className="text-left opacity-50 w-full text-base font-semibold text-slate-700 dark:text-light-gray">
                                                                            {stock.title}
                                                                        </h2>
                                                                        <strong className="text-base font-extrabold tracking-wide text-red-500">
                                                                            Out of stock
                                                                        </strong>
                                                                        <span className="text-md text-orange-700 font-bold tracking-wide dark:text-orange-400">
                                                                            You can bookmark this product and receive notification when it becomes available again in the near future.
                                                                        </span>
                                                                    </div>
                                                                    {/* Controls */}
                                                                    <div className="w-fit h-auto mt-0 flex flex-col gap-1 items-center justify-between">
                                                                        {
                                                                            status === "authenticated"
                                                                                ?
                                                                                <button
                                                                                    className="w-6 h-6 flex justify-center items-center rounded">
                                                                                    <HeartIcon className="w-5 h-5 text-slate-600 dark:text-gray-400" />
                                                                                </button>
                                                                                : ''
                                                                        }
                                                                    </div>
                                                                </div>
                                                            })
                                                        }
                                                    </div>
                                                    : ''
                                            }
                                        </div>

                                        {/* Cart price calculation summary container */}
                                        <div className="w-full max-w-sm shrink-0 flex flex-col gap-4">
                                            <div className="w-full bg-gray-50 rounded py-4 px-3 dark:bg-slate-800 border border-slate-200 shadow-md dark:border-slate-700">
                                                <h2 className="w-full relative flex flex-row justify-between items-center text-lg text-slate-800 dark:text-light-gray font-bold pb-4 border-b border-slate-200 dark:border-slate-700">
                                                    <span>
                                                        Subtotal
                                                    </span>
                                                    <CountUp
                                                        start={0}
                                                        end={cart.cart.reduce((total, item) => total + (item.price * item.quantity), 0)}
                                                        duration={0.5}
                                                        useEasing={true}
                                                        decimals={2}
                                                        decimal="."
                                                        prefix="$"
                                                    />
                                                </h2>
                                                <strong className="w-full flex flex-row justify-between items-center relative text-base py-2 capitalize text-slate-800 dark:text-light-gray">
                                                    <span>
                                                        items
                                                    </span>
                                                    <CountUp
                                                        start={1}
                                                        end={cart.cart.reduce((totalQuantity, item) => parseInt(totalQuantity) + parseInt(item.quantity), 0)}
                                                        duration={1}
                                                        useEasing={true}
                                                        decimals={0}
                                                    />
                                                </strong>
                                                <strong className="w-full flex flex-row justify-between items-center relative text-base py-2 capitalize text-slate-800 dark:text-light-gray">
                                                    <span>
                                                        Discount
                                                    </span>
                                                    <CountUp
                                                        start={0}
                                                        end={totalDiscountInDollars}
                                                        duration={1}
                                                        useEasing={true}
                                                        decimals={2}
                                                        decimal="."
                                                        prefix={`${totalDiscountInDollars > 0 ? '-' : ''}$`}
                                                    />
                                                </strong>
                                                {
                                                    deliveryInfo.courier && Object.keys(deliveryInfo.courier).length > 0
                                                        ?
                                                        <strong className="w-full flex flex-row justify-between items-center relative text-base py-2 capitalize text-slate-800 dark:text-light-gray">
                                                            <span>
                                                                Shipping Cost + GST:
                                                            </span>
                                                            <CountUp
                                                                start={0}
                                                                end={deliveryInfo.courier.priceIncludingGst}
                                                                duration={1}
                                                                useEasing={true}
                                                                decimals={2}
                                                                decimal="."
                                                                prefix="$"
                                                            />
                                                        </strong>
                                                        : ''
                                                }
                                                <h2 className="w-full relative flex flex-row justify-between items-center text-lg text-slate-800 dark:text-light-gray font-bold pt-4 border-t border-slate-200 dark:border-slate-700">
                                                    <span>
                                                        Total
                                                    </span>
                                                    <CountUp
                                                        start={0}
                                                        end={(cart.cart.reduce((total, item) => total + (item.price * item.quantity - calculateDiscountInDollars(item)), 0) + (Object.keys(deliveryInfo.courier).length > 0 ? deliveryInfo.courier.priceIncludingGst : 0))}
                                                        duration={0.5}
                                                        useEasing={true}
                                                        decimals={2}
                                                        decimal="."
                                                        prefix="$"
                                                    />
                                                </h2>
                                            </div>
                                            {
                                                status === "authenticated"
                                                    ?
                                                    <form action="/" method="POST"
                                                        onSubmit={(e) => { e.preventDefault(); completeOrder() }}>
                                                        {
                                                            placingOrder
                                                                ? <div className='w-full p-8 flex justify-center items-center'>
                                                                    <Loading color='text-black text-opacity-10 fill-baby-blue' width={6} height={6} />
                                                                </div>
                                                                : <button
                                                                    disabled={placingOrder}
                                                                    type="submit"
                                                                    className="w-full select-none rounded px-4 py-2 text-lg font-medium text-light-gray transition duration-150 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600">
                                                                    <CountUp
                                                                        start={0}
                                                                        end={(cart.cart.reduce((total, item) => total + (item.price * item.quantity - calculateDiscountInDollars(item)), 0) + (Object.keys(deliveryInfo.courier).length > 0 ? deliveryInfo.courier.priceIncludingGst : 0))}
                                                                        duration={0.5}
                                                                        useEasing={true}
                                                                        decimals={2}
                                                                        decimal="."
                                                                        prefix="Pay $"
                                                                    />
                                                                </button>
                                                        }
                                                    </form>
                                                    :
                                                    <Link href='/auth/signin'
                                                        className="w-full block select-none rounded px-4 py-2 text-lg font-medium text-blue-500 transition duration-150 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-600">
                                                        Login
                                                    </Link>
                                            }
                                        </div>
                                    </div>
                                    : ''
                            }
                            <Footer />
                        </div>
                    </div>
                    : <div className='w-full p-8 flex justify-center items-center'>
                        <Loading color='text-black text-opacity-10 fill-baby-blue' width={6} height={6} />
                    </div>
            }
            <ToastContainer
                position="bottom-left"
                autoClose={60000}
                hideProgressBar
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable={false}
                pauseOnHover
                theme={theme.theme === "dark" ? "dark" : "light"}
                limit={1}
            />
        </main >
    )
}

export default CartContainer;