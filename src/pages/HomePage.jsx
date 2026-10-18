import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPost } from '../api/posts';
import './_HomePage.scss';

import heroImage from '../assets/woman-1.png';
import image1 from '../assets/Rectangle 17.png';
import image2 from '../assets/Rectangle 18.png';
import image3 from '../assets/Rectangle 19.png';
import image4 from '../assets/Rectangle 23.png';
import image5 from '../assets/Rectangle 24.png';
import image6 from '../assets/Rectangle 25.png';

const travels = [
    {
        id: 1,
        title: 'Один зимний день в Венеции',
        country: 'Италия',
        city: 'Венеция',
        image: image1,
        description: 'Говорят, что Венецию покинуло 70% местных жителей. Говорят, что это из-за сверхтуризма. Ещё говорят, что Венеция...',
    },
    {
        id: 2,
        title: 'Фуншал. Расслабленный и броский',
        country: 'Португалия',
        city: 'Фуншал',
        image: image2,
        description: 'Обзорно о замках Фуншала, музеях, скульптурах и нарядных улицах центра',
    },
    {
        id: 3,
        title: 'Два сезона Северной Осетии. Часть 1 — Зима',
        country: 'Россия',
        city: 'Владикавказ',
        image: image3,
        description: 'Моя первая вылазка в Северную Осетию, январь совсем не популярный месяц тут, но с погодой очень повезло, виды были...',
    },
    {
        id: 4,
        title: 'Короткое воспоминание о Мономоли',
        country: 'Италия',
        city: 'Мономоли',
        image: image4,
        description: 'За окном уже снег, минус четыре и рано темнеет… Скоро рождественские и новогодние праздники. Кажется надо бы...',
    },
    {
        id: 5,
        title: 'Санкт-Петербург. Дворец Коттедж',
        country: 'Россия',
        city: 'Санкт-Петербург',
        image: image5,
        description: 'Дворец Коттедж и парк Александрия располагаются к востоку от центрального петергофского ансамбля на землях...',
    },
    {
        id: 6,
        title: 'Арабская сказка: успеть за 8 часов',
        country: 'ОАЭ',
        city: 'Дубай',
        image: image6,
        description: 'Длинная стыковка на пути в Южную Америку: знакомство с Дохой, столицей одного из самых маленьких государств...',
    },
];

function HomePage() {
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [photo, setPhoto] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const isLoggedIn = Boolean(localStorage.getItem('token'));

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setMessage('');
        setSaving(true);

        try {
            await createPost({
                title: title.trim(),
                description: description.trim(),
                country: country.trim(),
                city: city.trim(),
                photo,
            });

            setMessage('Путешествие успешно добавлено.');
            setTitle('');
            setDescription('');
            setCountry('');
            setCity('');
            setPhoto(null);
            setShowForm(false);
        } catch (err) {
            setError(err.message || 'Не удалось добавить путешествие.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <main className="home">
            <section
                className="home__hero"
                style={{ backgroundImage: `url(${heroImage})` }}
            >
                <div className="home__hero-content">
                    <h1>Там, где мир начинается с путешествий</h1>
                </div>
            </section>

            <section className="travels">
                {message && <p role="status">{message}</p>}
                {error && <p role="alert">{error}</p>}

                <div className="travels__grid">
                    {travels.map((travel) => (
                        <article className="travel-card" key={travel.id}>
                            <img
                                className="travel-card__image"
                                src={travel.image}
                                alt={travel.title}
                            />

                            <div className="travel-card__content">
                                <h2>{travel.title}</h2>
                                <p>{travel.description}</p>
                                <span>
                                    {travel.country}, {travel.city}
                                </span>
                                <Link to={`/posts/${travel.id}`}>
                                    Подробнее
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>

                {!isLoggedIn ? (
                    <Link className="travels__add" to="/login">
                        Добавить моё путешествие
                    </Link>
                ) : (
                    <button
                        className="travels__add"
                        type="button"
                        onClick={() => {
                            setError('');
                            setMessage('');
                            setShowForm((previous) => !previous);
                        }}
                    >
                        {showForm
                            ? 'Закрыть форму'
                            : 'Добавить моё путешествие'}
                    </button>
                )}

                {showForm && isLoggedIn && (
                    <form className="travel-form" onSubmit={handleSubmit}>
                        <h2>Новое путешествие</h2>

                        <label htmlFor="travel-title">Название</label>
                        <input
                            id="travel-title"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            required
                        />

                        <label htmlFor="travel-description">Описание</label>
                        <textarea
                            id="travel-description"
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                            rows="5"
                            required
                        />

                        <label htmlFor="travel-country">Страна</label>
                        <input
                            id="travel-country"
                            value={country}
                            onChange={(event) => setCountry(event.target.value)}
                            required
                        />

                        <label htmlFor="travel-city">Город</label>
                        <input
                            id="travel-city"
                            value={city}
                            onChange={(event) => setCity(event.target.value)}
                            required
                        />

                        <label htmlFor="travel-photo">Фотография</label>
                        <input
                            id="travel-photo"
                            type="file"
                            accept="image/*"
                            onChange={(event) =>
                                setPhoto(event.target.files?.[0] ?? null)
                            }
                        />

                        <button type="submit" disabled={saving}>
                            {saving
                                ? 'Публикуем...'
                                : 'Опубликовать путешествие'}
                        </button>
                    </form>
                )}
            </section>
        </main>
    );
}

export default HomePage;
