"use client";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getTheme } from "@/app/store/reducers/theme";
import Navigation from "@/app/partials/Navigation";
import Error404 from "./404-error/Error404";
import Error401 from "./401-error/Error401";
import Error405 from "./405-error/Error405";
import Footer from '@/app/partials/Footer';
import { useFavorites } from "@/app/store/actions/favorites";


const IndexPage = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams()
  
  useEffect(() => {
    dispatch(getTheme());
  }, [])

  return (
    <main className="w-full relative h-auto pb-12">
      <Navigation />
      <div className="w-full max-w-7xl m-auto p-2 md:p-8 text-sm">
        {
          searchParams?.get('code') === "404"
            ? <Error404 message={searchParams?.get('message')} code={searchParams?.get('code')} />
            : ''
        }
        {
          searchParams?.get('code') === "401"
            ? <Error401 message={searchParams?.get('message')} code={searchParams?.get('code')} />
            : ''
        }
        {
          searchParams?.get('code') === "405"
            ? <Error405 message={searchParams?.get('message')} code={searchParams?.get('code')} />
            : ''
        }
        <Footer />
      </div>
    </main >
  )
}

export default IndexPage;