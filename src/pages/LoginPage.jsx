import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/posts';

function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await loginUser(
                email.trim(),
                password
            );

            if (data.token) {
                navigate('/');
            } else {
                setError('Сервер не вернул токен авторизации.');
            }
        } catch (err) {
            setError(err.message || 'Не удалось войти.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="auth-page">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h1>Вход</h1>

                <label htmlFor="login-email">Электронная почта</label>
                <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />

                <label htmlFor="login-password">Пароль</label>
                <input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />

                {error && <p className="auth-form__error" role="alert">{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? 'Входим...' : 'Войти'}
                </button>

                <p>
                    Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                </p>
            </form>
        </main>
    );
}

export default LoginPage;
