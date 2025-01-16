/** @format */

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createForm } from '../../service/operations/formApi'; // API call
import { resetFormData } from '../../slices/formSlice'; // Redux action to reset form data

function BookingDetails() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Fetch booking details from Redux (data from previous forms)
	const bookingDetails = useSelector((state) => state.forms.form || {});

	// Local state for current form fields
	const [bookedByName, setbookedByName] = useState('');
	//   const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [paymentMethod, setPaymentMethod] = useState('Cash');
	const [errors, setErrors] = useState({});

	// Handle form validation and submission
	const handleCheckout = async () => {
		const validationErrors = {};

		// Validate mandatory fields
		if (!bookedByName.trim())
			validationErrors.bookedByName = 'First Name is required';
		// if (!lastName.trim()) validationErrors.lastName = "Last Name is required";
		if (!email.trim()) validationErrors.email = 'Email is required';
		if (!phone.trim()) validationErrors.phone = 'Phone Number is required';
		if (!paymentMethod)
			validationErrors.paymentMethod = 'Payment Method is required';

		// If there are validation errors, update the state
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		// Combine data from Redux with the current form's data
		const payload = {
			...bookingDetails, // Data from previous forms
			bookedByName,
			email,
			phoneNumber: phone,
			flightNumber: flightNumber || null,
			pickupSign: pickupSign || null,
			paymentStatus: paymentMethod === 'Cash' ? 0 : 1,
			notes: notes || null,
		};

		try {
			// Submit the combined payload to the API
			const response = await createForm(payload);
			console.log('Form submitted successfully:', response);

			// Reset Redux form state after successful submission
			dispatch(resetFormData());

			// Navigate to confirmation page
			navigate('/');
		} catch (error) {
			console.error('Error submitting form:', error);
			alert('Failed to submit form. Please try again.');
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen bg-[#F3F4F6]'>
			<div className='bg-white p-8 rounded-xl shadow-2xl w-full max-w-3xl space-y-6'>
				<h2 className='text-3xl font-bold text-sky-700 text-center mb-6'>
					Enter Your Details
				</h2>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<div>
						<label className='block text-sky-600 mb-2'>Name*</label>
						<input
							type='text'
							placeholder='Your Name'
							value={bookedByName}
							onChange={(e) => setbookedByName(e.target.value)}
							className='w-full px-4 py-3 bg-sky-50 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500'
						/>
						{errors.bookedByName && (
							<p className='text-blue-500 text-sm'>{errors.bookedByName}</p>
						)}
					</div>
					<div>
						<label className='block text-sky-600 mb-2'>Email*</label>
						<input
							type='email'
							placeholder='Your Email Address'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className='w-full px-4 py-3 bg-sky-50 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500'
						/>
						{errors.email && (
							<p className='text-blue-500 text-sm'>{errors.email}</p>
						)}
					</div>
					<div>
						<label className='block text-sky-600 mb-2'>Phone Number*</label>
						<input
							type='text'
							placeholder='Your Phone Number'
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							className='w-full px-4 py-3 bg-sky-50 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500'
						/>
						{errors.phone && (
							<p className='text-blue-500 text-sm'>{errors.phone}</p>
						)}
					</div>
				</div>

				{/* Payment Method */}
				<div>
					<h3 className='text-xl font-semibold text-sky-700 mb-4'>
						Choose Payment Option
					</h3>
					<div className='flex items-center space-x-6'>
						<label className='flex items-center'>
							<input
								type='radio'
								value='Cash'
								checked={paymentMethod === 'Cash'}
								onChange={(e) => setPaymentMethod(e.target.value)}
								className='form-radio text-sky-600 focus:ring-sky-500'
							/>
							<span className='ml-2 text-sky-600'>Cash</span>
						</label>
						<label className='flex items-center'>
							<input
								type='radio'
								value='Card'
								checked={paymentMethod === 'Card'}
								onChange={(e) => setPaymentMethod(e.target.value)}
								className='form-radio text-sky-600 focus:ring-sky-500'
							/>
							<span className='ml-2 text-sky-600'>Card</span>
						</label>
					</div>
					{errors.paymentMethod && (
						<p className='text-blue-500 text-sm'>{errors.paymentMethod}</p>
					)}
				</div>

				<button
					onClick={handleCheckout}
					className='w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white py-3 rounded-lg hover:from-sky-700 hover:to-blue-700 transition-all duration-300 shadow-lg'
				>
					Checkout
				</button>
			</div>
		</div>
	);
}

export default BookingDetails;
