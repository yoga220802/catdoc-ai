import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
}

const FormInput: React.FC<FormInputProps> = ({ label, name, ...rest }) => (
	<div className='mb-4'>
		<label htmlFor={name} className='block text-gray-700 text-sm font-bold mb-2'>
			{label}
		</label>
		<input
			id={name}
			name={name}
			className='shadow-inner appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100'
			{...rest}
		/>
	</div>
);

export default FormInput;
