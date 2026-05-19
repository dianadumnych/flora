document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reviewForm');
    const resultCard = document.getElementById('reviewResult');
    const statusText = document.getElementById('ratingStatus');
    const stars = document.querySelectorAll('input[name="rating"]');
    const API_URL = 'https://69f10d27c1533dbedc9e0fb9.mockapi.io/floralspace/response';

    // Логіка зірок
    stars.forEach(star => {
        star.addEventListener('change', (e) => {
            const val = parseInt(e.target.value);
            statusText.textContent = val <= 3
                ? "Нам прикро! Ми будемо ставати кращими."
                : "Дякуємо! Нам дуже приємно.";
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');

        let isValid = true;
        const nameInput = document.getElementById('userName');
        let name = nameInput.value.trim();
        const text = document.getElementById('reviewText').value.trim();
        const ratingInput = document.querySelector('input[name="rating"]:checked');
        const category = document.getElementById('category').value;

        // Валідація
        if (name.length > 20) {
            document.getElementById('nameError').textContent = "Ім'я не може перевищувати 20 символів";
            isValid = false;
        } else if (!name) {
            document.getElementById('nameError').textContent = "Введіть ім'я";
            isValid = false;
        } else if (!/^[а-яА-Яa-zA-ZіІїЇєЄґҐ\s]+$/.test(name)) {
            document.getElementById('nameError').textContent = "Лише літери та пробіли";
            isValid = false;
        }

        if (text.length < 5) {
            document.getElementById('textError').textContent = "Напишіть довший відгук (мінімум 5 символів)";
            isValid = false;
        }

        if (!ratingInput) {
            document.getElementById('ratingError').textContent = "Оберіть оцінку";
            isValid = false;
        }

        if (!isValid) return;

        // Відправка
        const submitBtn = form.querySelector('.submit-btn');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = "Відправляємо...";
        submitBtn.disabled = true;

        const reviewData = {
            name: name,
            category: category || "Букети",
            response: text,
            rating: parseInt(ratingInput.value),
            additionally: getCheckedOptions()
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewData)
            });

            if (!response.ok) throw new Error('Помилка сервера');

            showSuccessResult(name, text, ratingInput.value, category);
        } catch (error) {
            console.error('Помилка:', error);
            alert('Не вдалося відправити відгук. Перевірте інтернет та спробуйте ще раз.');
        } finally {
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    function getCheckedOptions() {
        const checked = [];
        document.querySelectorAll('.opt-check:checked').forEach(cb => {
            const label = document.querySelector(`label[for="${cb.id}"]`).textContent;
            checked.push(label);
        });
        return checked.join(', ');
    }

    function showSuccessResult(name, text, rating, category) {
        form.style.display = 'none';
        document.getElementById('formTitle').textContent = "Дякуємо за відгук!";
        
        document.getElementById('resName').textContent = name;
        document.getElementById('resContent').textContent = `"${text}"`;
        document.getElementById('resCategory').textContent = category || "Букети";
        document.getElementById('resStars').textContent = "★".repeat(rating);

        const tagsContainer = document.getElementById('resTags');
        tagsContainer.innerHTML = '';

        document.querySelectorAll('.opt-check:checked').forEach(cb => {
            const label = document.querySelector(`label[for="${cb.id}"]`).textContent;
            const span = document.createElement('span');
            span.className = 'tag';
            span.textContent = label;
            tagsContainer.appendChild(span);
        });

        resultCard.style.display = 'block';
    }
});
