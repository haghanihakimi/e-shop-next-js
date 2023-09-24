import {
    HiStar as StarIcon
} from "react-icons/hi2";


interface LoadingProps {
    rating: any;
}

export default function ProductRating({ rating }: LoadingProps) {
    const convertRating = (rating: number) => {
        return (rating / 5) * 100;
    }

    return (
        <>
            <div className='w-[99.2px] relative px-2 m-0 block'>
                <div style={{ width: `${convertRating(rating).toFixed(6)}%` }} className='p-0 m-0 inline-flex flex-row gap-0 flex-nowrap overflow-hidden'>
                    <StarIcon className="w-5 h-5 shrink-0 text-amber-400" />
                    <StarIcon className="w-5 h-5 shrink-0 text-amber-400" />
                    <StarIcon className="w-5 h-5 shrink-0 text-amber-400" />
                    <StarIcon className="w-5 h-5 shrink-0 text-amber-400" />
                    <StarIcon className="w-5 h-5 shrink-0 text-amber-400" />
                </div>
            </div>
        </>
    )
}