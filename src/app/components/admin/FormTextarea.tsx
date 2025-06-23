import React from "react";

interface FormTextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	label: string;
}

const FormTextarea: React.FC<FormTextareaProps> = ({
	label,
	name,
	...rest
}) => (
	<div className='mb-4'>
		<label htmlFor={name} className='block text-gray-700 text-sm font-bold mb-2'>
			{label}
		</label>
		<textarea
			id={name}
			name={name}
			rows={4}
			className='shadow-inner appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100'
			{...rest}
		/>
	</div>
);

export default FormTextarea;
