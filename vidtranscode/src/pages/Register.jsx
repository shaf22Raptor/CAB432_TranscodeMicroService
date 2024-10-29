import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
const registerEndpoint = `${apiBaseUrl}/user/register`;

// Reusable Input Field Component
function InputField({ label, type, value, onChange }) {
    return (
        <div>
            <label>{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                required
            />
        </div>
    );
}

// Reusable Error Message Component
function ErrorMessage({ message }) {
    return (
        <p style={{ color: 'red' }}>{message}</p>
    );
}

// Registration Service Function (for making the request to AWS Cognito)
async function registerUser(email, password, firstName, lastName) {
    const requestBody = {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName
    };

    const response = await fetch(registerEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

    return response.json();
}

// Main Registration Form Component
function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError(null);

        try {
            const data = await registerUser(email, password, firstName, lastName);

            if (data.success) {
                alert('Registration successful!');
                navigate('/login'); // Redirect to login after successful registration
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <InputField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <InputField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <InputField
                label="First Name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <InputField
                label="Last Name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <button className='register-button' type="submit">Register</button>

            {error && <ErrorMessage message={error} />}
            <Link to='/'>
                <button className='home-button'>
                    Main menu
                </button>
            </Link>
        </form>
    );
}

// Register Page Component
export default function RegisterPage() {
    return (
        <div className='register-page'>
            <h2>Register</h2>
            <RegisterForm />
        </div>
    );
}
