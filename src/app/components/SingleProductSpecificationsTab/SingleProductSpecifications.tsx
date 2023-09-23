import React, { useRef, useEffect, useState } from "react";
import Image from "next/dist/client/image";

interface Props {
    singleProduct: any,
}

const SingleProductSpecificationsTab: React.FC<Props> = ({ singleProduct }) => {

    return (
        <div className="w-full relative">
            <article
            className="w-full max-w-4xl flex flex-col gap-1 text-slate-800 text-base tracking-wide dark:text-light-gray">
                <p><strong>Width:</strong> {JSON.parse(singleProduct.specifications).width} cm</p>
                <p><strong>Height:</strong> {JSON.parse(singleProduct.specifications).height} cm</p>
                <p><strong>Length:</strong> {JSON.parse(singleProduct.specifications).length} cm</p>
                <p><strong>Weight:</strong> {JSON.parse(singleProduct.specifications).weight} kg</p>
            </article>
        </div>
    );
}

export default SingleProductSpecificationsTab;