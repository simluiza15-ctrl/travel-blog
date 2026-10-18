
import { useSyncExternalStore } from 'react';
import { Link } from 'react-router-dom';
import './_Header.scss';

function subscribeToAuth(callback) {
    window.addEventListener('auth-change', callback);
    window.addEventListener('storage', callback);

    return () => {
        window.removeEventListener('auth-change', callback);
        window.removeEventListener('storage', callback);
    };
}

function getAuthSnapshot() {
    return Boolean(localStorage.getItem('token'));
}

function Header() {
    const isLoggedIn = useSyncExternalStore(
        subscribeToAuth,
        getAuthSnapshot,
        () => false
    );

    return (
        <header className="header">
            <div className="header__container">
                <Link className="header__logo" to="/">
                    Travel Blog
                </Link>

                <nav className="header__nav">
                    <Link to="/">Путешествия</Link>

                    {isLoggedIn ? (
                        <Link to="/profile">Профиль</Link>
                    ) : (
                        <>
                            <Link to="/login">Войти</Link>
                            <Link to="/register">Регистрация</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;
