"use client";
import { useSession } from "next-auth/react";
import { useParams } from 'next/navigation';
import { useDispatch, useSelector } from "react-redux";
import Navigation from "@/app/partials/Navigation";
import React, { useEffect, useState } from "react";
import { getTheme } from "@/app/store/reducers/theme";
import { useProducts } from '@/app/store/actions/products';
import Loading from "@/app/partials/Loading";
import Breadcrumbs from "@/app/partials/Breadcrumb";
import Footer from "@/app/partials/Footer";
import { RootState } from '@/app/store/store';
import SingleProductImage from "@/app/components/SingleProductImage/ProductImage";
import SingleProductAttributes from "@/app/components/SingleProductAttributes/SingleProductAttributes";
import SingleProductTabs from '@/app/components/SingleProductTabs/SingleProductTabs';
import RelatedProducts from '@/app/components/RelatedProducts/RelatedProducts';
import { useFavorites } from '@/app/store/actions/favorites';
import { useProfile } from "@/app/store/actions/profile";

export default function SingleProduct() {
  const products = useSelector((state: RootState) => state.products);
  const singleProduct = useSelector((state: RootState) => state.singleProduct);
  const dispatch = useDispatch();
  const params = useParams()
  const [fetchingProduct, setFetchingProduct] = useState(false);
  const { getSingleProduct } = useProducts();
  const { data: session, status } = useSession();
  const { getFavorites } = useFavorites();
  const { getUser } = useProfile();

  useEffect(() => {
    dispatch(getTheme());

    const loadSingleProduct = async () => {
      setFetchingProduct(true);
      await getSingleProduct(params ? Number(params.product) : 1)
        .then(() => {
          setFetchingProduct(false);
        });
    }

    if (status === "authenticated") {
      getFavorites();
      getUser(session?.user?.email);
    }


    loadSingleProduct();
  }, [status])

  return (
    <main className="w-full relative h-auto pb-12">
      <Navigation />

      {
        fetchingProduct
          ? <div className='w-full p-8 flex justify-center items-center'>
            <Loading color='text-black text-opacity-10 fill-baby-blue' width={6} height={6} />
          </div>
          : <div className="w-full max-w-7xl relative m-auto p-2 md:p-8 text-sm p-4">
            {
              products.singleProduct && Object.keys(products.singleProduct).length > 0
                ?
                <div className="w-full flex flex-col gap-4">
                  <Breadcrumbs paths={[
                    { path: 'home', link: '/' },
                    { path: 'shop', link: '/shop' },
                    // { path: products.singleProduct.categories[0].category.name, link: '/view/category' },
                    ...products.singleProduct.categories.map((category: any, i: any) => {
                      return { path: category.category.name, link: `/` }
                    }),
                    { path: products.singleProduct.title }
                  ]} />
                  {/* product image and attributes summar container */}
                  <div className="w-full flex flex-row gap-6 sm:grap-12 flex-wrap">
                    {/* Product image container */}
                    <SingleProductImage singleProduct={singleProduct} products={products} />

                    {/* Product short description attributes summary container */}
                    <SingleProductAttributes singleProduct={singleProduct} products={products} />
                  </div>

                  {/* Product description and specifications */}
                  <div className="w-full flex flex col gap-4">
                    <SingleProductTabs singleProduct={products.singleProduct} />
                  </div>
                </div>
                : ''
            }
            <RelatedProducts categories={products?.singleProduct?.categories} />
            <Footer />
          </div>
      }
    </main >
  )
}
