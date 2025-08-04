import React, { useState } from 'react';

export default function App() {
    const [mode, setMode] = useState('login'); // 'login' or 'register'
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        usernameOrEmail: '',
    });
    const [message, setMessage] = useState(null);

    // Point to your backend
    const apiUrl = 'http://localhost:5000/auth';

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage(null);
        const { username, email, password } = formData;
        try {
            const res = await fetch(`${apiUrl}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || JSON.stringify(data));
            setMessage({ type: 'success', text: data.message });
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage(null);
        const { usernameOrEmail, password } = formData;
        try {
            const res = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usernameOrEmail, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || JSON.stringify(data));
            localStorage.setItem('token', data.token);
            setMessage({ type: 'success', text: 'Logged in successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '2rem auto', fontFamily: 'sans-serif' }}>
            <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>

            {message && (
                <div
                    style={{
                        padding: '0.5rem',
                        marginBottom: '1rem',
                        color: message.type === 'error' ? '#c00' : '#080',
                        border: `1px solid ${message.type === 'error' ? '#c00' : '#080'}`
                    }}
                >
                    {message.text}
                </div>
            )}

            {mode === 'register' ? (
                <form onSubmit={handleRegister}>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <label>Username</label><br/>
                        <input
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <label>Email</label><br/>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <label>Password</label><br/>
                        <input
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{ width: '100%' }}
                        />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '0.5rem' }}>
                        Register
                    </button>
                </form>
            ) : (
                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <label>Username or Email</label><br/>
                        <input
                            name="usernameOrEmail"
                            value={formData.usernameOrEmail}
                            onChange={handleChange}
                            required
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <label>Password</label><br/>
                        <input
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{ width: '100%' }}
                        />
                    </div>
                    <button type="submit" style={{ width: '100%', padding: '0.5rem' }}>
                        Login
                    </button>
                </form>
            )}

            <p style={{ marginTop: '1rem', textAlign: 'center' }}>
                {mode === 'login' ? (
                    <>
                        Need an account?{' '}
                        <button
                            onClick={() => { setMode('register'); setMessage(null); }}
                            style={{ background: 'none', border: 'none', color: '#06c', cursor: 'pointer' }}
                        >
                            Register
                        </button>
                    </>
                ) : (
                    <>
                        Already have one?{' '}
                        <button
                            onClick={() => { setMode('login'); setMessage(null); }}
                            style={{ background: 'none', border: 'none', color: '#06c', cursor: 'pointer' }}
                        >
                            Login
                        </button>
                    </>
                )}
            </p>
        </div>
    );
}
