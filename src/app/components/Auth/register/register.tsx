'use client';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Navigation from "@/app/partials/Navigation";
import React, { FormEventHandler, useEffect } from "react";
import { getTheme } from "@/app/store/reducers/theme";
import Loading from "@/app/partials/Loading";
import Footer from "@/app/partials/Footer";
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useProfile } from "@/app/store/actions/profile";
import { RootState } from "@/app/store/store";

interface RegistrationForm {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    registering: boolean;
}

const Register = () => {
    const dispatch = useDispatch();
    const theme = useSelector((state: RootState) => state.theme);
    const profile = useSelector((state: RootState) => state.profile);
    const { status } = useSession();
    const [userInfo, setUserInfo] = React.useState<RegistrationForm>({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        registering: false,
    });
    const router = useRouter();
    const { createAccount } = useProfile();

    const register: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setUserInfo({ ...userInfo, registering: true });
        createAccount({
            user: {
                firstname: userInfo?.firstname,
                lastname: userInfo?.lastname,
                email: userInfo?.email,
                password: userInfo?.password
            }
        }).then(async response => {
            if (response) {
                await signIn("credentials", {
                    email: userInfo.email,
                    password: userInfo.password,
                    redirect: false,
                });
            }
        }).finally(() => {
            setUserInfo({ ...userInfo, registering: false });
        });
    };

    useEffect(() => {
        dispatch(getTheme());

        if (status === "authenticated") {
            router.push('/');
        }
    }, [status])

    return (
        <>
            {
                status && status === "unauthenticated"
                    ?
                    <main className="w-full relative h-auto pb-12">
                        <Navigation />

                        <div className="w-full max-w-md relative mx-auto px-4 py-8">
                            <form onSubmit={register}
                                className="w-full flex flex-col gap-2 items-center select-none">
                                <h1 className="font-bold text-md text-slate-700 dark:text-gray-200">
                                    Create your <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-baby-blue dark:from-slate-400 dark:to-baby-blue">eShop</span> account now!
                                </h1>
                                <div className="w-full flex flex-row flex-wrap gap-2 items-center justify-between">
                                    <input
                                        defaultValue={userInfo?.firstname}
                                        onChange={({ target }) => { setUserInfo({ ...userInfo, firstname: target.value }) }}
                                        type="text"
                                        autoComplete="false"
                                        autoFocus={true}
                                        placeholder="First Name"
                                        className="w-full min-w-[160px] bg-white rounded flex-1 border border-gray-300 text-slate-800 transition duration-150 ring-4 ring-transparent focus:ring-2 focus:ring-blue-600 dark:border-slate-600 dark:text-light-gray dark:bg-slate-700"
                                    />
                                    <input
                                        defaultValue={userInfo?.lastname}
                                        onChange={({ target }) => { setUserInfo({ ...userInfo, lastname: target.value }) }}
                                        type="text"
                                        autoComplete="false"
                                        placeholder="Last Name"
                                        className="w-full min-w-[160px] bg-white rounded flex-1 border border-gray-300 text-slate-800 transition duration-150 ring-4 ring-transparent focus:ring-2 focus:ring-blue-600 dark:border-slate-600 dark:text-light-gray dark:bg-slate-700"
                                    />
                                </div>
                                <input
                                    defaultValue={userInfo?.email}
                                    onChange={({ target }) => { setUserInfo({ ...userInfo, email: target.value }) }}
                                    type="email"
                                    autoComplete="false"
                                    placeholder="e.g: john@email.com"
                                    className="w-full min-w-[100px] bg-white rounded flex-1 border border-gray-300 text-slate-800 transition duration-150 ring-4 ring-transparent focus:ring-2 focus:ring-blue-600 dark:border-slate-600 dark:text-light-gray dark:bg-slate-700"
                                />
                                <input
                                    defaultValue={userInfo?.password}
                                    onChange={({ target }) => { setUserInfo({ ...userInfo, password: target.value }) }}
                                    type="password"
                                    placeholder="Password"
                                    autoComplete="false"
                                    className="w-full bg-white rounded flex-1 border border-gray-300 text-slate-800 transition duration-150 ring-4 ring-transparent focus:ring-2 focus:ring-blue-600 dark:border-slate-600 dark:text-light-gray dark:bg-slate-700"
                                />
                                <button
                                    type="submit"
                                    disabled={userInfo.registering}
                                    className="w-full select-none rounded px-4 py-2 text-lg font-medium text-light-gray transition duration-150 bg-blue-500 disabled:opacity-50 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
                                    Create Account
                                </button>
                                <div className="w-full relative flex flex-row items-center justify-start">
                                    <Link href="/auth/signin" className="w-fit block relative text-blue-500 text-base font-medium tracking-wide hover:underline">
                                        Login
                                    </Link>
                                </div>
                                {/* errors container */}
                                {
                                    profile.errors && profile.errors.length > 0
                                        ? <div className="w-full select-text flex flex-col gap-2 text-red-500 text-md font-bold tracking-wide">
                                            {
                                                profile.errors.map((error: any, i: any) => {
                                                    return <span key={i}>
                                                        &times;&nbsp;{error}
                                                    </span>
                                                })
                                            }
                                        </div>
                                        : ''
                                }
                            </form>
                        </div>
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
                        <Footer />
                    </main >
                    : <div className='w-full p-8 flex justify-center items-center'>
                        <Loading color='text-black text-opacity-10 fill-baby-blue' width={6} height={6} />
                    </div>
            }
        </>
    )
}

export default Register;