import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    getPostById,
    getPostComments,
    addComment,
} from '../api/posts';
import './_PostPage.scss';

const API_ORIGIN = 'https://travelblog.skillbox.cc';

function PostPage() {
    const { id } = useParams();

    const [result, setResult] = useState({
        loading: true,
        post: null,
        error: '',
    });

    const [fullName, setFullName] = useState('');
    const [commentText, setCommentText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [commentError, setCommentError] = useState('');
    const [commentSuccess, setCommentSuccess] = useState('');

    useEffect(() => {
        let cancelled = false;

        async function loadPost() {
            setResult({
                loading: true,
                post: null,
                error: '',
            });

            try {
                const data = await getPostById(id);

                if (cancelled) return;

                setResult({
                    loading: false,
                    post: data,
                    error: '',
                });
            } catch (error) {
                if (!cancelled) {
                    setResult({
                        loading: false,
                        post: null,
                        error:
                            error.message ||
                            'Ошибка загрузки путешествия.',
                    });
                }
            }
        }

        loadPost();

        return () => {
            cancelled = true;
        };
    }, [id]);

    async function refreshComments() {
        const data = await getPostComments(id);

        const comments = Array.isArray(data)
            ? data
            : Array.isArray(data?.comments)
                ? data.comments
                : [];

        setResult((previous) => {
            if (!previous.post) return previous;

            return {
                ...previous,
                post: {
                    ...previous.post,
                    comments,
                },
            };
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const name = fullName.trim();
        const text = commentText.trim();

        if (!name || !text) {
            setCommentError('Заполни имя и текст комментария.');
            setCommentSuccess('');
            return;
        }

        setSubmitting(true);
        setCommentError('');
        setCommentSuccess('');

        try {
            await addComment(id, name, text);
            await refreshComments();

            setCommentText('');
            setCommentSuccess('Комментарий успешно добавлен.');
        } catch (error) {
            setCommentError(
                error.message ||
                'Не удалось добавить комментарий. Проверь авторизацию и попробуй ещё раз.'
            );
        } finally {
            setSubmitting(false);
        }
    }

    if (result.loading) {
        return (
            <main className="post-page">
                <p>Загружаем путешествие...</p>
            </main>
        );
    }

    if (result.error) {
        return (
            <main className="post-page">
                <h1>Не удалось загрузить путешествие</h1>
                <p>{result.error}</p>
                <Link to="/">Вернуться на главную</Link>
            </main>
        );
    }

    if (!result.post) {
        return (
            <main className="post-page">
                <h1>Путешествие не найдено</h1>
                <Link to="/">Вернуться на главную</Link>
            </main>
        );
    }

    const post = result.post;

    const imageUrl = post.photo
        ? post.photo.startsWith('http://') ||
            post.photo.startsWith('https://')
            ? post.photo
            : `${API_ORIGIN}${post.photo.startsWith('/') ? '' : '/'}${post.photo}`
        : '';

    const comments = Array.isArray(post.comments)
        ? post.comments
        : [];

    return (
        <main className="post-page">
            <Link className="post-page__back" to="/">
                ← Все путешествия
            </Link>

            <article className="post-page__article">
                {imageUrl && (
                    <img
                        className="post-page__image"
                        src={imageUrl}
                        alt={post.title || 'Фотография путешествия'}
                    />
                )}

                <div className="post-page__content">
                    <h1>{post.title}</h1>

                    <p className="post-page__location">
                        {[post.country, post.city]
                            .filter(Boolean)
                            .join(', ')}
                    </p>

                    <p>{post.description}</p>

                    <section className="post-page__comments">
                        <h2>Комментарии</h2>

                        {comments.length > 0 ? (
                            comments.map((item, index) => (
                                <article
                                    className="post-page__comment"
                                    key={
                                        item.id ??
                                        `${item.created_at ?? 'comment'}-${index}`
                                    }
                                >
                                    <p className="post-page__comment-author">
                                        {item.author_name ||
                                            item.full_name ||
                                            'Пользователь'}
                                    </p>

                                    <p>{item.comment}</p>
                                </article>
                            ))
                        ) : (
                            <p>Комментариев пока нет.</p>
                        )}

                        <form
                            className="post-page__comment-form"
                            onSubmit={handleSubmit}
                        >
                            <h3>Оставить комментарий</h3>

                            <label htmlFor="comment-name">
                                Имя
                            </label>

                            <input
                                id="comment-name"
                                type="text"
                                value={fullName}
                                onChange={(event) =>
                                    setFullName(event.target.value)
                                }
                                placeholder="Твоё имя"
                                required
                            />

                            <label htmlFor="comment-text">
                                Комментарий
                            </label>

                            <textarea
                                id="comment-text"
                                value={commentText}
                                onChange={(event) =>
                                    setCommentText(event.target.value)
                                }
                                placeholder="Напиши комментарий"
                                rows={4}
                                required
                            />

                            {commentError && (
                                <p
                                    role="alert"
                                    className="post-page__error"
                                >
                                    {commentError}
                                </p>
                            )}

                            {commentSuccess && (
                                <p
                                    role="status"
                                    className="post-page__success"
                                >
                                    {commentSuccess}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                            >
                                {submitting
                                    ? 'Отправляем...'
                                    : 'Отправить комментарий'}
                            </button>
                        </form>
                    </section>
                </div>
            </article>
        </main>
    );
}

export default PostPage;
