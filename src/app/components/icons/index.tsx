import React from "react";

// Properti umum untuk semua ikon
const iconProps = {
	className: "w-6 h-6",
	strokeWidth: "2",
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
};

export const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg {...iconProps} {...props}>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M4 6h16M4 12h16M4 18h16'></path>
	</svg>
);

export const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg {...iconProps} {...props}>
		<path d='M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z'></path>
		<polyline points='9 22 9 12 15 12 15 22'></polyline>
	</svg>
);

export const DiagnoseIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg {...iconProps} {...props}>
		<path d='M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'></path>
		<path d='M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z'></path>
	</svg>
);

export const InfoIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg {...iconProps} {...props}>
		<path d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'></path>
	</svg>
);

export const HelpIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg {...iconProps} {...props}>
		<path d='M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3'></path>
		<circle cx='12' cy='12' r='10'></circle>
		<line x1='12' y1='17' x2='12.01' y2='17'></line>
	</svg>
);

export const LogoutIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg {...iconProps} {...props}>
		<path d='M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4'></path>
		<polyline points='16 17 21 12 16 7'></polyline>
		<line x1='21' y1='12' x2='9' y2='12'></line>
	</svg>
);
