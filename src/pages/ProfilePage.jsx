
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    getUser,
    updateUser,
    changePassword,
    logoutUser,
} from '../api/posts';
import './_ProfilePage.scss';

const API_ORIGIN = 'https://travelblog.skillbox.cc';

function getPhotoUrl(photo) {
    if (!photo || typeof photo !== 'string') return '';
    if (photo.startsWith('http')) return photo;
    return `${API_ORIGIN}${photo.startsWith('/') ? '' : '/'}${photo}`;
}

function ProfilePage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        full_name: '',
        city: '',
        country: '',
        bio: '',
    });
    const [photo, setPhoto] = useState(null);
    const [currentPhoto, setCurrentPhoto] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [password, setPassword] = useState('');
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        let cancelled = false;

        async function loadProfile() {
            try {
                const data = await getUser();
                const user = data.user ?? data.userInfo ?? data;

                if (!cancelled) {
                    setForm({
                        full_name: user.full_name ?? '',
                        city: user.city ?? '',
                        country: user.country ?? '',
                        bio: user.bio ?? '',
                    });
                    setCurrentPhoto(getPhotoUrl(user.photo));
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || 'Не удалось загрузить профиль.');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadProfile();

        return () => {
            cancelled = true;
        };
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    async function handleSave(event) {
        event.preventDefault();
        setError('');
        setMessage('');
        setSaving(true);

        try {
            const formData = new FormData();
            formData.append('full_name', form.full_name.trim());
            formData.append('city', form.city.trim());
            formData.append('country', form.country.trim());
            formData.append('bio', form.bio.trim());

            if (photo) {
                formData.append('photo', photo);
            }

            const updatedUser = await updateUser(formData);
            const user = updatedUser.user ?? updatedUser.userInfo ?? updatedUser;

            setForm({
                full_name: user.full_name ?? form.full_name,
                city: user.city ?? form.city,
                country: user.country ?? form.country,
                bio: user.bio ?? form.bio,
            });

            if (user.photo) {
                setCurrentPhoto(getPhotoUrl(user.photo));
            }

            setPhoto(null);
            setMessage('Профиль успешно сохранён.');
        } catch (err) {
            setError(err.message || 'Не удалось сохранить профиль.');
        } finally {
            setSaving(false);
        }
    }

    async function handlePasswordChange(event) {
        event.preventDefault();
        setPasswordError('');
        setPasswordMessage('');

        if (!password.trim()) {
            setPasswordError('Введи новый пароль.');
            return;
        }

        setPasswordSaving(true);

        try {
            await changePassword(password);
            setPassword('');
            setPasswordMessage('Пароль успешно изменён.');
        } catch (err) {
            setPasswordError(err.message || 'Не удалось изменить пароль.');
        } finally {
            setPasswordSaving(false);
        }
    }

    async function handleLogout() {
        setError('');

        try {
            await logoutUser();
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Не удалось выйти из аккаунта.');
        }
    }

    if (loading) {
        return (
            <main className="profile-page">
                <p>Загружаем профиль...</p>
            </main>
        );
    }

    return (
        <main className="profile-page">
            <section className="profile-card">
                <h1>Мой профиль</h1>

                {error && <p className="profile-card__error" role="alert">{error}</p>}
                {message && <p className="profile-card__success" role="status">{message}</p>}

                {currentPhoto && !photo && (
                    <img
                        className="profile-card__photo"
                        src={currentPhoto}
                        alt="Фотография профиля"
                    />
                )}

                {photo && (
                    <p className="profile-card__file">
                        Выбрана фотография: {photo.name}
                    </p>
                )}

                <form className="profile-form" onSubmit={handleSave}>
                    <label htmlFor="profile-name">Имя и фамилия</label>
                    <input
                        id="profile-name"
                        name="full_name"
                        type="text"
                        value={form.full_name}
                        onChange={handleChange}
                        autoComplete="name"
                    />

                    <label htmlFor="profile-city">Город</label>
                    <input
                        id="profile-city"
                        name="city"
                        type="text"
                        value={form.city}
                        onChange={handleChange}
                        autoComplete="address-level2"
                    />

                    <label htmlFor="profile-country">Страна</label>
                    <input
                        id="profile-country"
                        name="country"
                        type="text"
                        value={form.country}
                        onChange={handleChange}
                        autoComplete="country-name"
                    />

                    <label htmlFor="profile-bio">О себе</label>
                    <textarea
                        id="profile-bio"
                        name="bio"
                        rows="4"
                        value={form.bio}
                        onChange={handleChange}
                    />

                    <label htmlFor="profile-photo">Фотография профиля</label>
                    <input
                        id="profile-photo"
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                            setPhoto(event.target.files?.[0] ?? null);
                        }}
                    />

                    <button type="submit" disabled={saving}>
                        {saving ? 'Сохраняем...' : 'Сохранить профиль'}
                    </button>
                </form>

                <div className="profile-card__divider" />

                <h2>Изменить пароль</h2>

                <form className="profile-form" onSubmit={handlePasswordChange}>
                    <label htmlFor="profile-password">Новый пароль</label>
                    <input
                        id="profile-password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="new-password"
                        required
                    />

                    {passwordError && (
                        <p className="profile-card__error" role="alert">
                            {passwordError}
                        </p>
                    )}

                    {passwordMessage && (
                        <p className="profile-card__success" role="status">
                            {passwordMessage}
                        </p>
                    )}

                    <button type="submit" disabled={passwordSaving}>
                        {passwordSaving ? 'Меняем пароль...' : 'Изменить пароль'}
                    </button>
                </form>

                <button
                    className="profile-card__logout"
                    type="button"
                    onClick={handleLogout}
                >
                    Выйти из аккаунта
                </button>

                <Link className="profile-card__back" to="/">
                    Вернуться к путешествиям
                </Link>
            </section>
        </main>
    );
}

export default ProfilePage;
