async function loadReviews() {
  const container = document.getElementById('reviews-container');
  
  if (!container) return;

  try {
    const response = await fetch('https://69f10d27c1533dbedc9e0fb9.mockapi.io/floralspace/response');
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const reviews = await response.json();

    container.innerHTML = '';

    if (!reviews || reviews.length === 0) {
      container.innerHTML = '<p class="no-reviews">Поки що немає відгуків. Будьте першим!</p>';
      return;
    }

    reviews.forEach(review => {
      const reviewEl = document.createElement('div');
      reviewEl.className = 'review-card';

      const rating = review.rating || 5;
      const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));

      reviewEl.innerHTML = `
        <div class="review-header">
          <strong>${review.name || 'Анонімний клієнт'}</strong>
          <span class="review-date">${review.date || ''}</span>
        </div>
        <div class="review-stars">${stars}</div>
        <p class="review-text">"${review.response || review.text || review.comment || 'Дякуємо за відгук!'}"</p>
      `;
      container.appendChild(reviewEl);
    });

  } catch (error) {
    console.error('Помилка завантаження відгуків:', error);
    container.innerHTML = `
      <p class="error">
        Не вдалося завантажити відгуки.<br>
        <small>Спробуйте оновити сторінку.</small>
      </p>`;
  }
}

// Запускаємо після повного завантаження сторінки
window.addEventListener('load', loadReviews);
