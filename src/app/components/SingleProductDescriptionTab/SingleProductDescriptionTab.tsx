import React, { useRef, useEffect, useState } from "react";
import Image from "next/dist/client/image";

interface Props {
    singleProduct: any,
}

const SingleProductDescriptionTab: React.FC<Props> = ({ singleProduct }) => {

    return (
        <div className="w-full relative">
            <article dangerouslySetInnerHTML={{ __html: singleProduct.description }}
            className="w-full max-w-4xl text-slate-800 text-base tracking-wide dark:text-light-gray">
                {/*  */}
            </article>
        </div>
    );
}

export default SingleProductDescriptionTab;