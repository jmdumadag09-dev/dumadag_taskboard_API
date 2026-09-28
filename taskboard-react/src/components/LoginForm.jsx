import { useState } from 'react';
import { api } from '../api';

export default function LoginForm({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        try {
            const data = await api('/login', {
                method: 'POST',
                body: JSON.stringify({
                    email,
                    password
                })
            });

            localStorage.setItem('token', data.token);
            onLogin();
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">Login</button>
            </form>

            {error && <p>{error}</p>}
        </div>
    );
}