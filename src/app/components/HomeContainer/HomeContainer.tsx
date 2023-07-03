"use client";
import { useDispatch, useSelector } from "react-redux";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Image from "next/image";
import Navigation from "../../partials/Navigation";
import { useEffect, useState } from "react";
import { getTheme } from "@/app/store/reducers/theme";
import { filterProductsList } from "@/app/store/reducers/products";
import {
  HiArrowsUpDown as SortIcon,
  HiStar as StarIcon,

} from "react-icons/hi2";
import Link from "next/link";
import { useProducts } from "@/app/store/actions/products";
import { RootState } from "@/app/store/store";
import Loading from "@/app/partials/Loading";
import Footer from '@/app/partials/Footer';

export default function HomeContainer() {
  const [sort, setSort] = useState('');
  const [fetchingProducts, setFetchingProducts] = useState(false);
  const products = useSelector((state: RootState) => state.products);
  const dispatch = useDispatch();
  const { getProducts } = useProducts();

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
    return 0;
  }

  useEffect(() => {
    dispatch(getTheme());

    const fetchProducts = async () => {
      setFetchingProducts(true);
      await getProducts(50).then(() => {
        setFetchingProducts(false);
      });
    }

    fetchProducts();
  }, [])

  return (
    <main className="w-full relative h-auto pb-12">
      <Navigation />
      <div className="w-full max-w-7xl m-auto p-2 md:p-8 text-sm">
        {/* heading cover */}
        <div className="w-full h-auto max-h-[360px] overflow-hidden rounded shadow-lg relative select-none z-0">
          <div className="w-full h-full absolute top-0 left-0 bg-black bg-opacity-60 z-10 backdrop-blur-[2px]">&nbsp;</div>
          <Image
            src='https://resource.logitech.com/w_1001,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/keyboards/k580-multi-device-wireless-keyboard/k580-slim-multi-device-wireless-kb-full-setup-rose.jpg?v=1'
            width={2000}
            height={2000}
            alt="Keyboard Premium"
            className="w-full h-full object-cover -translate-y-0 z-0 xl:-translate-y-72" />
          <div className="w-full flex flex-col gap-3 pb-2 absolute md:bottom-6 md:left-6 left-0 bottom-0 p-2 md:p-0 z-50">
            <h2 className="w-fit px-0 rounded text-lg sm:text-base font-bold text-light-gray shadow-lg">
              Logitech Keyboards
            </h2>
            <p className="w-fit text-light-gray font-medium text-sm px-0 py-0 rounded">
              Buy Logitech keyboards and all wireless keyboard with 25% off.
            </p>
            <Link href='' target="_self"
              className="w-fit text-light-gray font-medium text-sm px-4 py-2 rounded border border-slate-300">
              All 5 Keyboards
            </Link>
          </div>
        </div>

        {/* Products filter and view controls container */}
        <div className="w-full flex justify-start items-center gap-2 py-12 px-2 select-none">
          {/* Filter button */}
          <div className="w-fit shrink-0 relative">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="w-fit flex flex-row gap-1 items-center py-1 px-2 shadow-sm rounded border border-slate-300 dark:border-slate-700 transition duration-150 hover:shadow-md">
                  <SortIcon className="w-5 h-5 text-slate-800 dark:text-light-gray" />
                  <span className="hidden sm:inline-block text-base text-slate-800 font-medium tracking-wide dark:text-light-gray">
                    Sort
                  </span>
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[100px] -mr-16 bg-white dark:bg-slate-800 shadow-lg rounded border border-slate-200 dark:border-slate-700"
                  sideOffset={5}
                >
                  <DropdownMenu.Item className="group leading-none text-violet11 rounded flex items-center relative select-none outline-none">
                    <label htmlFor="name_a_z" className="w-full text-left inline-flex gap-1 justify-start items-center p-2 text-base font-medium tracking-wide text-slate-800 transition duration-200 dark:text-light-gray hover:bg-slate-200 dark:hover:bg-slate-600">
                      <input type="radio" name="name_a_z" value={'a-z'} id="name_a_z"
                        checked={sort === 'a-z'}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSort(e.target.value); dispatch(filterProductsList({ name: e.target.value })) }}
                        className="w-4 h-4 rounded-full ring-0 ring-transparent outline-none focus:ring-0 focus:ring-transparent" />
                      Name A-Z
                    </label>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="group leading-none text-violet11 rounded flex items-center relative select-none outline-none">
                    <label htmlFor="name_z_a" className="w-full text-left inline-flex gap-1 justify-start items-center p-2 text-base font-medium tracking-wide text-slate-800 transition duration-200 dark:text-light-gray hover:bg-slate-200 dark:hover:bg-slate-600">
                      <input type="radio" name="name_z_a" value={'z-a'} id="name_z_a"
                        checked={sort === 'z-a'}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSort(e.target.value); dispatch(filterProductsList({ name: e.target.value })) }}
                        className="w-4 h-4 rounded-full ring-0 ring-transparent outline-none focus:ring-0 focus:ring-transparent" />
                      Name Z-A
                    </label>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="group leading-none text-violet11 rounded flex items-center relative select-none outline-none">
                    <label htmlFor="price_high_low" className="w-full text-left inline-flex gap-1 justify-start items-center p-2 text-base font-medium tracking-wide text-slate-800 transition duration-200 dark:text-light-gray hover:bg-slate-200 dark:hover:bg-slate-600">
                      <input type="radio" name="price_high_low" value={'high-low'} id="price_high_low"
                        checked={sort === 'high-low'}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSort(e.target.value); dispatch(filterProductsList({ name: e.target.value })) }}
                        className="w-4 h-4 rounded-full ring-0 ring-transparent outline-none focus:ring-0 focus:ring-transparent" />
                      Price High-Low
                    </label>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="group leading-none text-violet11 rounded flex items-center relative select-none outline-none">
                    <label htmlFor="price_low_high" className="w-full text-left inline-flex gap-1 justify-start items-center p-2 text-base font-medium tracking-wide text-slate-800 transition duration-200 dark:text-light-gray hover:bg-slate-200 dark:hover:bg-slate-600">
                      <input type="radio" name="price_low_high" value={'low-high'} id="price_low_high"
                        checked={sort === 'low-high'}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSort(e.target.value); dispatch(filterProductsList({ name: e.target.value })) }}
                        className="w-4 h-4 rounded-full ring-0 ring-transparent outline-none focus:ring-0 focus:ring-transparent" />
                      Price Low-High
                    </label>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="group leading-none text-violet11 rounded flex items-center relative select-none outline-none">
                    <label htmlFor="most_popular" className="w-full text-left inline-flex gap-1 justify-start items-center p-2 text-base font-medium tracking-wide text-slate-800 transition duration-200 dark:text-light-gray hover:bg-slate-200 dark:hover:bg-slate-600">
                      <input type="radio" name="most_popular" value={'most-popular'} id="most_popular"
                        checked={sort === 'most-popular'}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSort(e.target.value); dispatch(filterProductsList({ name: e.target.value })) }}
                        className="w-4 h-4 rounded-full ring-0 ring-transparent outline-none focus:ring-0 focus:ring-transparent" />
                      Most Popular
                    </label>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="group leading-none text-violet11 rounded flex items-center relative select-none outline-none">
                    <label htmlFor="price_low_high" className="w-full text-left inline-flex gap-1 justify-start items-center p-2 text-base font-medium tracking-wide text-slate-800 transition duration-200 dark:text-light-gray hover:bg-slate-200 dark:hover:bg-slate-600">
                      <input type="radio" name="least_popular" value={'least-popular'} id="least_popular"
                        checked={sort === 'least-popular'}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSort(e.target.value); dispatch(filterProductsList({ name: e.target.value })) }}
                        className="w-4 h-4 rounded-full ring-0 ring-transparent outline-none focus:ring-0 focus:ring-transparent" />
                      Least Popular
                    </label>
                  </DropdownMenu.Item>

                  <DropdownMenu.Arrow className="fill-white shadow-lg dark:fill-slate-800 -ml-0" />
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>

        {/* Products grid */}
        {
          fetchingProducts
            ?
            <Loading color='text-black text-opacity-10 fill-baby-blue' width={6} height={6} />
            :
            <div className="w-full grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-4">

              {/* products.productsList && products.productsList.length > 0 */}
              {
                products.productsList && products.productsList.length > 0
                  ?
                  products.productsList.map((product: any, i: any) => {
                    const price = product.price !== null ? parseFloat(product.price) : parseFloat(JSON.parse(product.attributes).price[0]);
                    return <div key={i} className="object-cover rounded aspect-square shadow-md sm:hover:shadow-lg transition duration-20 scale-1 sm:hover:scale-105 rounded flex flex-col gap-2 p-2 justify-between items-start bg-white border border-slate-300 dark:border-slate-700 dark:bg-slate-800">
                      <Link href={`/view/product/${(product.categories[0].category.name).toLowerCase()}/${product.id}/${(product.title).replace(/ /g, "-").toLowerCase()}`} target="_self"
                        className="w-full max-h-[300px] relative aspect-square select-none">
                        <Image
                          src={product.thumbnail}
                          alt="iPhone 6"
                          width={500}
                          height={500}
                          priority={true}
                          className="w-full max-h-[250px] min-h-[250px] object-cover rounded aspect-square z-0"
                        />
                        {
                          product.discount !== null
                            ?
                            <div className="w-fit h-auto absolute top-2 left-1 p-1 rounded bg-baby-blue text-white text-base font-bold tracking-wide">
                              -{product.discount < 10 ? `0${product.discount}` : product.discount}%
                            </div>
                            : ''
                        }
                        <div className="w-full h-full absolute top-0 left-0 runded dark:bg-slate-900 dark:bg-opacity-10 z-10">&nbsp;</div>
                      </Link>

                      <h2 className="w-full block p-0 m-0 text-left flex flex-col gap-1 pt-2">
                        <div className='w-[99.2px] relative px-2 m-0 block'>
                          <div style={{ width: `${convertRating(product.rating).toFixed(6)}%` }} className='p-0 m-0 inline-flex flex-row gap-0 flex-nowrap overflow-hidden'>
                            <StarIcon className="w-5 h-5 shrink-0 text-amber-400" />
                            <StarIcon className="w-5 h-5 shrink-0 text-amber-400" />
                            <StarIcon className="w-5 h-5 shrink-0 text-amber-400" />
                            <StarIcon className="w-5 h-5 shrink-0 text-amber-400" />
                            <StarIcon className="w-5 h-5 shrink-0 text-amber-400" />
                          </div>
                        </div>
                        <Link href={`/view/product/${(product.categories[0].category.name).toLowerCase()}/${product.id}/${(product.title).replace(/ /g, "-").toLowerCase()}`} target="_self"
                          className="w-full relative block px-2 text-base text-slate-900 font-bold tracking-wide dark:text-light-gray">
                          {product.title}
                        </Link>
                      </h2>

                      <h4 className="w-full px-2 text-lg font-bold text-slate-800 flex flex-row gap-1 dark:text-light-gray">
                        <Link href={`/view/product/${(product.categories[0].category.name).toLowerCase()}/${product.id}/${(product.title).replace(/ /g, "-").toLowerCase()}`} target="_self"
                          className="w-full relative">
                          <span>
                            {product.attributes !== null ? 'From ' : ''}${product.discount !== null ? discountCalculator(price, product.discount).toFixed(2) : price.toFixed(2)}
                          </span> {product.discount !== null ? '-' : ''} {product.discount !== null ? <del className="text-base text-slate-800 dark:text-light-gray font-normal">
                            ${price.toFixed(2)}
                          </del>
                            : ''}
                        </Link>
                      </h4>
                    </div>
                  })
                  : ''
              }


            </div>
        }
        <Footer />
      </div>
    </main >
  )
}
