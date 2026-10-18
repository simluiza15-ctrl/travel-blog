
const API_URL = 'https://travelblog.skillbox.cc/api';

async function sendAuthRequest(endpoint, email, password) {
    const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            data.message ||
            data.error ||
            'Не удалось выполнить запрос. Проверь данные и попробуй ещё раз.'
        );
    }

    return data;
}

export function registerUser(email, password) {
    return sendAuthRequest('register', email, password);
}

export function loginUser(email, password) {
    return sendAuthRequest('login', email, password);
}
