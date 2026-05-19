  async function loadReviews() {
      const container = document.getElementById('reviews-container');
      
      try {
        const response = await fetch('https://69f10d27c1533dbedc9e0fb9.mockapi.io/floralspace/response');
        if (!response.ok) throw new Error('Не вдалося завантажити дані');
        
        const reviews = await response.json();
        
        container.innerHTML = '';
        
        if (!reviews || reviews.length === 0) {
          container.innerHTML = '<p class="no-reviews">Поки що немає відгуків. Будьте першим!</p>';
          return;
        }

        reviews.forEach(review => {
          const reviewEl = document.createElement('div');
          reviewEl.className = 'review-card';
          
          const stars = review.rating 
            ? '★'.repeat(Math.floor(review.rating)) + '☆'.repeat(5 - Math.floor(review.rating))
            : '★★★★★';
          
          reviewEl.innerHTML = `
            <div class="review-header">
              <strong>${review.name || 'Анонімний клієнт'}</strong>
              <span class="review-date">${review.date || ''}</span>
            </div>
            <div class="review-stars">${stars}</div>
            <p class="review-text">"${review.text || review.comment || 'Дякуємо за відгук!'}"</p>
          `;
          container.appendChild(reviewEl);
        });
      } catch (error) {
        console.error(error);
        container.innerHTML = '<p class="error">Не вдалося завантажити відгуки. Спробуйте пізніше.</p>';
      }
    }

    // Завантажуємо відгуки після завантаження сторінки
    window.addEventListener('load', loadReviews);
