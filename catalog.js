document.addEventListener('DOMContentLoaded', () => {
  
  // === Основні налаштування ===
  const API_URL = 'https://69f10d27c1533dbedc9e0fb9.mockapi.io/floralspace/catalog';

  const apiProductsContainer = document.getElementById('api-products-container');
  const messageContainer = document.getElementById('message-container');
  const filterForm = document.getElementById('filter-form');
  const categorySelect = document.getElementById('category-select');
  const priceMaxInput = document.getElementById('price-max');

  let dbProducts = [];

  // === Завантаження даних з MockAPI ===
  async function fetchCatalogData() {
    try {
      showSystemMessage('Завантаження товарів...', 'info');

      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`Помилка: ${response.status}`);
      }

      dbProducts = await response.json();
      renderApiProducts(dbProducts);

    } catch (error) {
      console.error('Помилка завантаження:', error);
      showSystemMessage('Не вдалося завантажити товари з MockAPI.<br>Перевірте інтернет або посилання.', 'error');
    }
  }

  // === Рендер товарів ===
  function renderApiProducts(products) {
    apiProductsContainer.innerHTML = '';

    if (products.length === 0) {
      showSystemMessage('Товарів за заданими фільтрами не знайдено.', 'info');
      return;
    }

    messageContainer.innerHTML = '';
    messageContainer.className = 'message-container';

    products.forEach(item => {
      const card = document.createElement('article');
      card.className = 'card-catalog';        // ← Використовуємо потрібний клас

      card.innerHTML = `
        <img 
          src="${item.image}" 
          loading="lazy"
          alt="${item.name}" 
          onerror="this.onerror=null; this.src='https://placehold.co/400x300/f1c8d4/6b4e9e?text=${encodeURIComponent(item.name)}';"
        >
        <h2>${item.name}</h2>
        <p class="price">${item.price} грн</p>
        <button class="add-btn" type="button" 
                data-tooltip="Категорія: ${item.category || 'Не вказано'}">
          Детальніше
        </button>
      `;

      apiProductsContainer.appendChild(card);
    });

    // Налаштування тултіпів після рендеру
    setupTooltips();
  }

  // === Фільтрація ===
  function applyFilters() {
    const selectedCategory = categorySelect.value.trim().toLowerCase();
    let maxPrice = priceMaxInput.value ? parseFloat(priceMaxInput.value) : Infinity;

    if (isNaN(maxPrice) || maxPrice < 0) maxPrice = Infinity;

    const filtered = dbProducts.filter(product => {
      const productCategory = (product.category || '').trim().toLowerCase();
      const matchCategory = !selectedCategory || productCategory === selectedCategory;
      const matchPrice = product.price <= maxPrice;

      return matchCategory && matchPrice;
    });

    renderApiProducts(filtered);
  }

  // === Універсальна функція тултіпів ===
  function setupTooltips() {
    // Шукаємо і .card і .card-catalog
    const cards = document.querySelectorAll('.card, .card-catalog');

    cards.forEach(card => {
      const button = card.querySelector('.add-btn');
      if (!button) return;

      // Видаляємо старий тултіп
      let tooltip = card.querySelector('.tooltip');
      if (tooltip) tooltip.remove();

      tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = button.getAttribute('data-tooltip');
      card.appendChild(tooltip);

      // Позиціонування під кнопкою
      button.addEventListener('mouseenter', () => {
        tooltip.classList.add('visible');
        
        const btnRect = button.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        
        const topPosition = btnRect.bottom - cardRect.top + 8;

        tooltip.style.top = `${topPosition}px`;
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translateX(-50%)';
      });

      button.addEventListener('mouseleave', () => {
        tooltip.classList.remove('visible');
      });
    });
  }

  // === Повідомлення ===
  function showSystemMessage(text, type = 'info') {
    apiProductsContainer.innerHTML = '';
    messageContainer.innerHTML = text;
    messageContainer.className = `message-container ${type}`;
  }

  // === Слухачі подій ===
  categorySelect.addEventListener('change', applyFilters);
  priceMaxInput.addEventListener('input', applyFilters);
  
  filterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    applyFilters();
  });

  // === Ініціалізація ===
  fetchCatalogData();

  // Для статичних карток (наприклад, бестселери)
  setupTooltips();
});