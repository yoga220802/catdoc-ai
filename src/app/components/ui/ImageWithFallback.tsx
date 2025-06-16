"use client";

import Image, { ImageProps } from "next/image";
import { useState, useEffect } from "react";

interface ImageWithFallbackProps extends ImageProps {
	fallbackSrc: string;
}

export default function ImageWithFallback({
	src,
	fallbackSrc,
	alt,
	...rest
}: ImageWithFallbackProps) {
	const [imgSrc, setImgSrc] = useState(src);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setImgSrc(src);
		setIsLoading(true);
	}, [src]);

	return (
		<div
			className='relative overflow-hidden rounded-lg'
			style={{ width: rest.width, height: rest.height }}>
			{isLoading && (
				<div className='absolute inset-0 w-full h-full rounded-lg bg-gray-200 animate-pulse' />
			)}

			<Image
				{...rest}
				src={imgSrc || fallbackSrc}
				alt={alt}
				className={`transition-opacity duration-300 ease-in-out rounded-lg ${
					isLoading ? "opacity-0" : "opacity-100"
				}`}
				onLoad={() => setIsLoading(false)}
				onError={() => {
					setIsLoading(false);
					setImgSrc(fallbackSrc);
				}}
			/>
		</div>
	);
}
