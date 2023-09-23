'use client';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Head from "next/head";
import Navigation from "@/app/partials/Navigation";
import React, { FormEventHandler, useEffect } from "react";
import { getTheme } from "@/app/store/reducers/theme";
import Loading from "@/app/partials/Loading";
import Footer from "@/app/partials/Footer";
import Link from "next/link";

interface LoginForm {
    email: string;
    password: string;
    loginErrors: string;
}

const Login = () => {
    const [userInfo, setUserInfo] = React.useState<LoginForm>({
        email: "",
        password: "",
        loginErrors: "",
    });
    const dispatch = useDispatch();
    const { status } = useSession();
    const router = useRouter();

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();

        const res = await signIn("credentials", {
            email: userInfo.email,
            password: userInfo.password,
            redirect: false,
        });

        if (res && res.error === "CredentialsSignin") {
            setUserInfo({ ...userInfo, loginErrors: "Incorrect email or password. Please check given email and password and try again." });
            return;
        }
    };

    useEffect(() => {
        dispatch(getTheme());

        if (status === "authenticated") {
            router.back();
        }
    }, [status])

    return (
        <>
            {
                status && status === "unauthenticated"
                    ?
                    <main className="w-full relative h-auto pb-12">
                        <Head>
                            <title>eShop - Login</title>
                            <meta property="og:eShop-Login" content="eShop - Login" key="eShop-Login" />
                        </Head>
                        <Navigation />

                        {/* Brands Grids */}
                        <div className="w-full max-w-md relative mx-auto px-4 py-8">
                            <form onSubmit={handleSubmit}
                                className="w-full flex flex-col gap-4 items-center select-none">
                                <h1 className="font-bold text-md text-slate-700 dark:text-gray-200">
                                    Login back to your <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-baby-blue dark:from-slate-400 dark:to-baby-blue">eShop</span>
                                </h1>
                                <input
                                    value={userInfo.email}
                                    onChange={({ target }) =>
                                        setUserInfo({ ...userInfo, email: target.value })
                                    }
                                    type="email"
                                    placeholder="john@email.com"
                                    className="w-full bg-white rounded flex-1 border border-gray-300 text-slate-800 transition duration-150 ring-4 ring-transparent focus:ring-2 focus:ring-blue-600 dark:border-slate-600 dark:text-light-gray dark:bg-slate-700"
                                />
                                <input
                                    value={userInfo.password}
                                    onChange={({ target }) =>
                                        setUserInfo({ ...userInfo, password: target.value })
                                    }
                                    type="password"
                                    placeholder="Password"
                                    className="w-full bg-white rounded flex-1 border border-gray-300 text-slate-800 transition duration-150 ring-4 ring-transparent focus:ring-2 focus:ring-blue-600 dark:border-slate-600 dark:text-light-gray dark:bg-slate-700"
                                />
                                <button
                                    type="submit"
                                    className="w-full select-none rounded px-4 py-2 text-lg font-medium text-light-gray transition duration-150 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
                                    Sign In
                                </button>
                                <div className="w-full relative flex flex-row items-center justify-start">
                                    <Link href="#" className="w-fit block relative text-blue-500 text-base font-medium tracking-wide hover:underline">
                                        Create Account
                                    </Link>
                                    {/* <span className="w-fit block relative text-blue-500 text-base font-medium tracking-wide">
                            &nbsp;/&nbsp;
                        </span>
                        <Link href="#" className="w-fit block relative text-blue-500 text-base font-medium tracking-wide hover:underline">
                            Forgotten Account
                        </Link> */}
                                </div>
                            </form>
                            {
                                userInfo.loginErrors && userInfo.loginErrors.length > 0
                                    ? <strong className="w-full text-red-500 font-bold tracking-wide text-md">
                                        {userInfo.loginErrors}
                                    </strong>
                                    : ''
                            }
                        </div>
                        <Footer />
                    </main >
                    : <div className='w-full p-8 flex justify-center items-center'>
                        <Loading color='text-black text-opacity-10 fill-baby-blue' width={6} height={6} />
                    </div>
            }
        </>
    )
}

export default Login;