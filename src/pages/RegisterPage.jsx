import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth';

function RegisterPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');

        if (!email.trim() || !password) {
            setError('Заполни все поля.');
            return;
        }

        setLoading(true);

        try {
            const data = await registerUser(
                email.trim(),
                password
            );

            if (data.token) {
                navigate('/');
            } else {
                setError(
                    'Регистрация выполнена, но сервер не вернул токен. Попробуй войти.'
                );
            }
        } catch (err) {
            setError(err.message || 'Ошибка регистрации.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="auth-page">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h1>Регистрация</h1>

                <label htmlFor="register-email">Электронная почта</label>
                <input
                    id="register-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />

                <label htmlFor="register-password">Пароль</label>
                <input
                    id="register-password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />

                {error && <p className="auth-form__error" role="alert">{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? 'Регистрируем...' : 'Зарегистрироваться'}
                </button>

                <p>
                    Уже есть аккаунт? <Link to="/login">Войти</Link>
                </p>
            </form>
        </main>
    );
}

export default RegisterPage;
