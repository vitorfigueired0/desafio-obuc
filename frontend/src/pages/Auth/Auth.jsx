import { useState } from 'react';
import './Auth.css';
import obucLogo from '../../assets/obuc-logo.png';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export const Auth = () => {
	const [isSignUp, setIsSignUp] = useState(false);
	const clearFormData = { name: '', email: '', password: '', confirmPassword: '' }
	const [formData, setFormData] = useState(clearFormData)

	const navigate = useNavigate()

	const toggleMode = () => {
		setIsSignUp((prev) => !prev);
		setFormData(clearFormData)
	};

	const handleSubmit = (e) => {
		e.preventDefault()
		if (isSignUp) {
			signUp()
		} else {
			signIn()
		}
	}

	const signIn = async () => {

		const data = {
			email: formData.email,
			password: formData.password
		}

		try {
			const res = await api.post('/auth', data)
			if (res.status == 200) {
				localStorage.setItem('authToken', `Bearer ${res.data.token}`)
				navigate('/')

				return
			}
		} catch (error) {
			console.error(error)
		}
	}

	const signUp = async () => {
		try {
			const res = await api.post('/user', formData)
			if (res.status == 201) {
				signIn()
			}
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<div id='main-wrapper'>
			<div id='form-div' className={isSignUp ? 'form-div-sigup' : 'form-div-sigin'}>
				<div id='form-header'>
					<figure><img src={obucLogo} alt='Logo' /></figure>
				</div>

				<form className={isSignUp ? 'form-signup' : 'form-signin'} onSubmit={(e) => handleSubmit(e)}>
					{isSignUp && (
						<input
							type='text'
							className='login-input'
							placeholder='Full Name'
							value={formData.name}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, name: e.target.value }))
							}
							required
						/>
					)}
					<input
						type='email'
						className='login-input'
						placeholder='Email'
						value={formData.email}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, email: e.target.value }))
						}
						required
					/>
					<input
						type='password'
						className='login-input'
						placeholder='Password'
						value={formData.password}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, password: e.target.value }))
						}
						required
					/>
					{isSignUp && (
						<input
							type='password'
							className='login-input'
							placeholder='Confirm password'
							value={formData.confirmPassword}
							onChange={(e) =>
								setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))
							}
							required
						/>
					)}

					<button
						type='submit'
						className='submit-button'
					>
						{isSignUp ? 'Sing Up' : 'Sign In'}
					</button>
				</form>

				<p onClick={toggleMode} className='toggle-mode'>
					{isSignUp ? 'Already have an account? Login' : `Don't have an account? Sign Up`}
				</p>
			</div>
		</div>
	);
};