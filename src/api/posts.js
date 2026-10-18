const API_URL = 'https://travelblog.skillbox.cc/api';

// Общая обработка ответа API
async function readResponse(response) {
    const text = await response.text();

    let data = {};

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = { message: text };
        }
    }

    if (!response.ok) {
        throw new Error(
            data.message ||
            data.error ||
            `Ошибка запроса: ${ response.status } `
        );
    }

    return data;
}

// Заголовки авторизации
function getAuthHeaders() {
    const token = localStorage.getItem('token');

    return token
        ? { Authorization: `Bearer ${ token } ` }
        : {};
}

// Уведомить приложение об изменении авторизации
function notifyAuthChange() {
    window.dispatchEvent(new Event('auth-change'));
}

// Получить список путешествий
export async function getPosts() {
    const response = await fetch(`${ API_URL }/posts`);
return readResponse(response);
}

// Получить путешествие по ID
export async function getPostById(id) {
    const response = await fetch(`${API_URL}/posts/${id}`);
    return readResponse(response);
}

// Получить комментарии путешествия
export async function getPostComments(id) {
    const response = await fetch(`${API_URL}/posts/${id}/comments`);
    return readResponse(response);
}

// Добавить комментарий
export async function addComment(id, fullName, comment) {
    const response = await fetch(`${API_URL}/posts/${id}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify({
            full_name: fullName,
            comment,
        }),
    });

    return readResponse(response);
}

// Добавить путешествие
export async function createPost({
    title,
    description,
    country,
    city,
    photo,
}) {
    const formData = new FormData();

    formData.append('title', title);
    formData.append('description', description);
    formData.append('country', country);
    formData.append('city', city);

    if (photo) {
        formData.append('photo', photo);
    }

    const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
    });

    return readResponse(response);
}

// Регистрация
export async function registerUser(email, password) {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await readResponse(response);

    if (data.token) {
        localStorage.setItem('token', data.token);
        notifyAuthChange();
    }

    return data;
}

// Вход
export async function loginUser(email, password) {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await readResponse(response);

    if (!data.token) {
        throw new Error('Сервер не вернул токен авторизации.');
    }

    localStorage.setItem('token', data.token);
    notifyAuthChange();

    return data;
}

// Выход
export async function logoutUser() {
    const response = await fetch(`${API_URL}/logout`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    // Даже если сервер вернул ошибку, не считаем пользователя
    // авторизованным после завершения выхода.
    try {
        await readResponse(response);
    } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        notifyAuthChange();
    }
}

// Получить профиль пользователя
export async function getUser() {
    const response = await fetch(`${API_URL}/user`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });

    return readResponse(response);
}

// Обновить профиль пользователя
export async function updateUser({
    full_name,
    city,
    country,
    bio,
    photo,
}) {
    const formData = new FormData();

    if (full_name !== undefined) {
        formData.append('full_name', full_name);
    }

    if (city !== undefined) {
        formData.append('city', city);
    }

    if (country !== undefined) {
        formData.append('country', country);
    }

    if (bio !== undefined) {
        formData.append('bio', bio);
    }

    if (photo) {
        formData.append('photo', photo);
    }

    const response = await fetch(`${API_URL}/user`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
    });

    return readResponse(response);
}

// Изменить пароль
export async function changePassword(password) {
    const response = await fetch(`${API_URL}/user/password`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify({ password }),
    });

    return readResponse(response);
}
