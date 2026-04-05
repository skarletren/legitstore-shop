import { useState, useEffect, useRef } from 'react';

function App() {
  // ========== ВСЕ ХУКИ НА ВЕРХНЕМ УРОВНЕ ==========
  const [isAdmin, setIsAdmin] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [addedMsg, setAddedMsg] = useState(false);
  const [isClosingModal, setIsClosingModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Всі');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRulesOpen, setIsRulesOpen] = useState(false); // состояние для попапа правил

  // Загрузка товаров из localStorage или дефолтные
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('legitstore_products');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, name: "Товар 1", price: "3 200", desc: "Преміальний комфорт та футуристичний силует.", sizes: ["37","38","39","40","41","42","43","44","45"], category: "Кросівки", images: ["https://via.placeholder.com/150"], currentImageIndex: 0 },
      { id: 2, name: "Товар 2", price: "5 700", desc: "Масивний дизайн у стилі нульових.", sizes: ["37","38","39","40","41","42","43","44","45"], category: "Кеди", images: ["https://via.placeholder.com/150"], currentImageIndex: 0 },
      { id: 3, name: "Товар 3", price: "5 000", desc: "Спортивна естетика в деконструйованому стилі.", sizes: ["37","38","39","40","41","42","43","44","45"], category: "Кросівки", images: ["https://via.placeholder.com/150"], currentImageIndex: 0 },
      { id: 4, name: "Товар 4", price: "1 800", desc: "Джинси кльош з ідеальною посадкою.", sizes: ["S","M","L","XL"], category: "Штани та джинси", images: ["https://via.placeholder.com/150"], currentImageIndex: 0 },
      { id: 5, name: "Товар 5", price: "2 600", desc: "Класичний світшот з м'якої бавовни.", sizes: ["S","M","L","XL"], category: "Худі та світшоти", images: ["https://via.placeholder.com/150"], currentImageIndex: 0 },
      { id: 6, name: "Товар 6", price: "4 200", desc: "Легендарний силует для повсякденного стилю.", sizes: ["37","38","39","40","41","42","43","44","45"], category: "Кросівки", images: ["https://via.placeholder.com/150"], currentImageIndex: 0 },
      { id: 7, name: "Товар 7", price: "900", desc: "Базова біла футболка оверсайз.", sizes: ["S","M","L","XL"], category: "Футболки", images: ["https://via.placeholder.com/150"], currentImageIndex: 0 },
      { id: 8, name: "Товар 8", price: "900", desc: "Футболка з яскравим принтом.", sizes: ["S","M","L","XL"], category: "Футболки", images: ["https://via.placeholder.com/150"], currentImageIndex: 0 },
      { id: 9, name: "Товар 9", price: "2 100", desc: "Зручне зіп-худі на кожен день.", sizes: ["S","M","L","XL"], category: "Худі та світшоти", images: ["https://via.placeholder.com/150"], currentImageIndex: 0 },
      { id: 10, name: "Товар 10", price: "1 950", desc: "Широкі джинси з щільного деніму.", sizes: ["S","M","L","XL"], category: "Штани та джинси", images: ["https://via.placeholder.com/150"], currentImageIndex: 0 },
    ];
  });

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('legitstore_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Сохранение товаров и корзины в localStorage
  useEffect(() => {
    localStorage.setItem('legitstore_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('legitstore_cart', JSON.stringify(cart));
  }, [cart]);

  // Telegram WebApp
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      tg.setHeaderColor('#1a73e8');
    }
  }, []);

  // Refs
  const shopRef = useRef(null);
  const sliderRef = useRef(null);
  const allProductsRef = useRef(null);

  // Анимация при скролле
  useEffect(() => {
    setIsVisible(true);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    setTimeout(() => {
      const productsCards = document.querySelectorAll('.product-scroll-anim');
      productsCards.forEach(card => {
        card.classList.remove('is-visible');
        observer.observe(card);
      });
      const titles = document.querySelectorAll('.animated-title');
      titles.forEach(title => observer.observe(title));
      if (shopRef.current) observer.observe(shopRef.current);
      if (allProductsRef.current) observer.observe(allProductsRef.current);
    }, 100);

    return () => observer.disconnect();
  }, [selectedCategory, searchQuery]);

  // ========== ОБРАБОТЧИКИ ==========
  const handleSecretClick = () => {
    setClicks(prev => prev + 1);
    if (clicks + 1 === 5) {
      const pass = prompt("Введіть адмін-пароль:");
      if (pass === "1221") {
        setIsAdmin(true);
        alert("Режим адміна увімкнено!");
      }
      setClicks(0);
    }
    setTimeout(() => setClicks(0), 2000);
  };

  // Добавление товара с несколькими фото
  const handleAddProduct = () => {
    const name = document.getElementById('p-name')?.value;
    const price = document.getElementById('p-price')?.value;
    const category = document.getElementById('p-category')?.value;
    const desc = document.getElementById('p-desc')?.value;
    const fileInput = document.getElementById('p-file');
    const files = fileInput?.files ? Array.from(fileInput.files) : [];

    if (!name || !price || !category) {
      return alert("Заповніть назву, ціну та категорію!");
    }

    const saveFinalItem = (readyImages) => {
      const newItem = {
        id: Date.now(),
        name,
        price,
        category,
        description: desc || "",
        images: readyImages.length ? readyImages : ["https://via.placeholder.com/150"],
        currentImageIndex: 0,
        sizes: category === "Кросівки" || category === "Кеди" 
          ? ["37","38","39","40","41","42","43","44","45"] 
          : ["S","M","L","XL"]
      };
      setProducts(prev => [newItem, ...prev]);
      alert(`Товар успішно додано! Фото: ${readyImages.length}`);
      
      // Очистка формы
      document.getElementById('p-name').value = '';
      document.getElementById('p-price').value = '';
      document.getElementById('p-desc').value = '';
      if(fileInput) fileInput.value = '';
    };

    if (files.length > 0) {
      const imagesArray = [];
      let processed = 0;
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          imagesArray.push(reader.result);
          processed++;
          if (processed === files.length) saveFinalItem(imagesArray);
        };
        reader.readAsDataURL(file);
      });
    } else {
      saveFinalItem([]);
    }
  };

  // Удаление товара (только для админа)
  const handleDeleteProduct = (productId, e) => {
    e.stopPropagation();
    if (window.confirm("Видалити цей товар?")) {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  // Переключение изображений в модалке
  const handleModalNext = (e) => {
    e.stopPropagation();
    if (!selectedProduct) return;
    const productId = selectedProduct.id;
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const newIndex = (product.currentImageIndex + 1) % product.images.length;
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, currentImageIndex: newIndex } : p
    ));
    setSelectedProduct(prev => ({ ...prev, currentImageIndex: newIndex }));
  };

  const handleModalPrev = (e) => {
    e.stopPropagation();
    if (!selectedProduct) return;
    const productId = selectedProduct.id;
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const newIndex = product.currentImageIndex === 0 ? product.images.length - 1 : product.currentImageIndex - 1;
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, currentImageIndex: newIndex } : p
    ));
    setSelectedProduct(prev => ({ ...prev, currentImageIndex: newIndex }));
  };

  const nextImg = (productId, e) => {
    if (e) e.stopPropagation();
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const nextIdx = (p.currentImageIndex || 0) + 1;
        return { ...p, currentImageIndex: nextIdx >= p.images.length ? 0 : nextIdx };
      }
      return p;
    }));
  };

  const prevImg = (productId, e) => {
    if (e) e.stopPropagation();
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const prevIdx = (p.currentImageIndex || 0) - 1;
        return { ...p, currentImageIndex: prevIdx < 0 ? p.images.length - 1 : prevIdx };
      }
      return p;
    }));
  };

  const filteredProducts = products.filter(item => {
    const matchesCategory = selectedCategory === 'Всі' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchQuery('');
    setIsMenuOpen(false);
    setTimeout(() => {
      allProductsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const card = sliderRef.current.querySelector('.product-scroll-anim');
      const cardWidth = card ? card.offsetWidth + 20 : sliderRef.current.offsetWidth;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -cardWidth : cardWidth,
        behavior: 'smooth'
      });
    }
  };

  const closeProductModal = () => {
    setIsClosingModal(true);
    setTimeout(() => {
      setSelectedProduct(null);
      setSelectedSize(null);
      setAddedMsg(false);
      setIsClosingModal(false);
    }, 300);
  };

  const addToCart = (product) => {
    if (!selectedSize) return alert("Спершу обери розмір!");
    setCart([...cart, { ...product, chosenSize: selectedSize, cartId: Date.now() }]);
    setAddedMsg(true);
    setTimeout(() => {
      closeProductModal();
      setTimeout(() => setIsCartOpen(true), 350);
    }, 1000);
  };

  // ========== ИСПРАВЛЕННАЯ ФУНКЦИЯ ОФОРМЛЕНИЯ ЗАКАЗА ==========
  const handleCheckout = () => {
    if (cart.length === 0) return;
    const orderList = cart.map(item => `- ${item.name} (${item.chosenSize}): ${item.price} UAH`).join('\n');
    const total = cart.reduce((sum, item) => sum + parseInt(item.price.replace(/\s/g, '')), 0);
    const text = encodeURIComponent(`Вітаю! Хочу зробити замовлення:\n\n${orderList}\n\nРазом: ${total} UAH`);
    // Отправляем менеджеру @leg1t_store
    window.open(`https://t.me/leg1t_store?text=${text}`, '_blank');
    setCart([]);
    setIsCartOpen(false);
  };

  const CloseIcon = ({ onClick }) => (
    <div onClick={onClick} className="close-icon-wrapper">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </div>
  );

  const shoeSizes = ["37", "38", "39", "40", "41", "42", "43", "44", "45"];
  const clothingSizes = ["S", "M", "L", "XL"];
  const fakeReviewsBase = [
    { name: "Діма", text: "Якість просто пушка! Рекомендую однозначно." },
    { name: "Оля", text: "Оригінал 100%, розмір підійшов ідеально, дякую!" },
    { name: "Макс", text: "Доставка швидка, менеджери топ. Буду брати ще." },
    { name: "Катя", text: "Дуже зручні, виглядають вживу ще краще, ніж на фото." },
    { name: "Влад", text: "Легіт чек пройшли, все чітко. Респект магазину." }
  ];

  return (
    <div style={{ backgroundColor: '#fff', color: '#000', minHeight: '100vh', fontFamily: "'Inter', sans-serif", opacity: isVisible ? 1 : 0, transition: 'opacity 0.8s', overflowX: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <div className="top-glow-bar"></div>

      <header className="main-header">
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setIsMenuOpen(true)} className="nav-pill-btn">КАТАЛОГ</button>
          <button onClick={() => setIsCartOpen(true)} className="nav-pill-btn">КОШИК [{cart.length}]</button>
        </div>
        <div className="logo-wrap-3d">
          <h1 className="main-logo-3d" onClick={handleSecretClick} style={{ cursor: 'pointer', userSelect: 'none' }}>LEGIT STORE</h1>
        </div>
      </header>

      {/* АДМИН-ПАНЕЛЬ */}
      {isAdmin && (
        <div className="admin-panel-modern">
          <div className="admin-panel-header">
            <h2>⚡ Панель керування</h2>
            <button className="admin-close-btn" onClick={() => setIsAdmin(false)}>✕</button>
          </div>
          <div className="admin-form">
            <input id="p-name" type="text" placeholder="Назва товару" className="admin-input" />
            <div className="admin-row">
              <input id="p-price" type="number" placeholder="Ціна (UAH)" className="admin-input" />
              <select id="p-category" className="admin-input">
                <option value="">Категорія</option>
                <option value="Футболки">Футболки</option>
                <option value="Худі та світшоти">Худі та світшоти</option>
                <option value="Штани та джинси">Штани та джинси</option>
                <option value="Шорти">Шорти</option>
                <option value="Кросівки">Кросівки</option>
                <option value="Аксесуари">Аксесуари</option>
              </select>
            </div>
            <textarea id="p-desc" placeholder="Опис (розміри, матеріал...)" rows="3" className="admin-input"></textarea>
            <div className="file-zone">
              <label className="file-label">📸 Фото товару (можна декілька)</label>
              <input type="file" id="p-file" accept="image/*" multiple style={{ display: 'none' }} />
              <button className="file-trigger" onClick={() => document.getElementById('p-file').click()}>Вибрати файли</button>
            </div>
            <button onClick={handleAddProduct} className="admin-submit">➕ Опублікувати товар</button>
          </div>
        </div>
      )}

      {/* Оверлей и драверы */}
      <div className={`drawer-overlay ${isMenuOpen || isCartOpen ? 'visible' : ''}`} onClick={() => { setIsMenuOpen(false); setIsCartOpen(false); }}></div>

      <div className={`side-drawer left-drawer ${isMenuOpen ? 'open' : ''}`}>
        <CloseIcon onClick={() => setIsMenuOpen(false)} />
        <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '20px', marginTop: '30px' }}>КАТАЛОГ</h2>
        <div className="search-container">
          <input type="text" placeholder="Пошук товару..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input" />
        </div>
        <div className="catalog-content">
          <div className="catalog-section">
            <ul className="catalog-list">
              <li onClick={() => handleCategorySelect('Всі')} className={selectedCategory === 'Всі' ? 'active-category' : ''}>ВСІ ТОВАРИ</li>
            </ul>
          </div>
          <div className="catalog-section">
            <h3 className="catalog-subtitle">ОДЯГ</h3>
            <ul className="catalog-list">
              <li onClick={() => handleCategorySelect('Футболки')}>Футболки</li>
              <li onClick={() => handleCategorySelect('Худі та світшоти')}>Худі та світшоти</li>
              <li onClick={() => handleCategorySelect('Штани та джинси')}>Штани та джинси</li>
              <li onClick={() => handleCategorySelect('Шорти')}>Шорти</li>
            </ul>
          </div>
          <div className="catalog-section">
            <h3 className="catalog-subtitle">ВЗУТТЯ</h3>
            <ul className="catalog-list"><li onClick={() => handleCategorySelect('Кросівки')}>Кросівки</li></ul>
          </div>
          <div className="catalog-section">
            <h3 className="catalog-subtitle">АКСЕСУАРИ</h3>
            <ul className="catalog-list"><li onClick={() => handleCategorySelect('Аксесуари')}>Аксесуари</li></ul>
          </div>
        </div>
      </div>

      <div className={`side-drawer right-drawer ${isCartOpen ? 'open' : ''}`}>
        <CloseIcon onClick={() => setIsCartOpen(false)} />
        <h2 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '30px', marginTop: '30px' }}>КОШИК</h2>
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#eee" strokeWidth="1"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              <p style={{ color: '#bbb', fontSize: '14px', fontWeight: '500' }}>Ваш кошик порожній</p>
            </div>
          ) : cart.map(item => (
            <div key={item.cartId} className="cart-item-row">
              <div style={{ borderLeft: '3px solid #1a73e8', paddingLeft: '12px' }}>
                <p style={{ fontWeight: '800', margin: 0, fontSize: '14px' }}>{item.name}</p>
                <p style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>РОЗМІР: {item.chosenSize}</p>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <p style={{ fontWeight: '900', margin: 0, fontSize: '14px' }}>{item.price} UAH</p>
                <div style={{ cursor: 'pointer', color: '#ccc' }} onClick={() => setCart(cart.filter(c => c.cartId !== item.cartId))}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div style={{ paddingTop: '20px', borderTop: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <span style={{ fontWeight: '700' }}>РАЗОМ:</span>
              <span style={{ fontWeight: '900', fontSize: '18px', color: '#1a73e8' }}>
                {cart.reduce((sum, item) => sum + parseInt(item.price.replace(/\s/g, '')), 0).toLocaleString()} UAH
              </span>
            </div>
            <button onClick={handleCheckout} className="order-btn-green">ОФОРМИТИ ЗАМОВЛЕННЯ</button>
          </div>
        )}
      </div>

      <main style={{ flex: 1 }}>
        <section className="hero-section">
          <div className="hero-mobile-container">
            <div className="hero-mobile-img-wrap">
              <div className="placeholder-hero-mobile"></div>
              <div className="hero-mobile-gradient"></div>
              <div className="hero-content-mobile">
                <h2 className="hero-text-anim">NEW <br /> <span style={{ color: '#1a73e8' }}>DROPS</span></h2>
                <div onClick={() => shopRef.current?.scrollIntoView({ behavior: 'smooth' })} className="придбати-btn">придбати</div>
              </div>
            </div>
          </div>
          <div className="hero-pc-content">
            <h2 className="hero-text-anim" style={{color: '#fff'}}>LEGIT<br/> <span style={{ color: '#1a73e8' }}>STORE</span></h2>
            <div onClick={() => shopRef.current?.scrollIntoView({ behavior: 'smooth' })} className="придбати-btn">придбати</div>
          </div>
        </section>

        <section ref={shopRef} className="shop-section-wrapper section-no-vertical-scroll">
          <h2 className="animated-title">NEW DROPS</h2>
          <div className="slider-relative-container">
            <button className="slider-nav-btn prev" onClick={() => scrollSlider('left')}>◀</button>
            <div className="products-scroll-container" ref={sliderRef}>
              {products.map((item) => (
                <div key={`drop-${item.id}`} onClick={() => setSelectedProduct(item)} className="product-scroll-anim">
                  <div className="product-card-container" style={{ position: 'relative' }}>
                    {isAdmin && <div className="delete-icon" onClick={(e) => handleDeleteProduct(item.id, e)}>🗑️</div>}
                    <div className="product-bg">
                      <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '30px' }} />
                    </div>
                    <h3 className="product-title-text">{item.name}</h3>
                    <p style={{ fontWeight: '900', color: '#1a73e8', margin: 0 }}>{item.price} UAH</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="slider-nav-btn next" onClick={() => scrollSlider('right')}>▶</button>
          </div>
        </section>

        <section ref={allProductsRef} className="shop-section-wrapper" style={{ paddingTop: '20px' }}>
          <h2 className="animated-title">
            {searchQuery ? `РЕЗУЛЬТАТИ ПОШУКУ: "${searchQuery}"` : (selectedCategory === 'Всі' ? 'ВСІ ТОВАРИ' : selectedCategory.toUpperCase())}
          </h2>
          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <p style={{ fontWeight: 'bold', color: '#999', fontSize: '18px' }}>Нічого не знайдено :(</p>
              <button onClick={() => {setSelectedCategory('Всі'); setSearchQuery('');}} className="reset-filter">Скинути фільтри</button>
            </div>
          ) : (
            <div className="all-products-grid">
              {filteredProducts.map((item) => (
                <div key={`all-${item.id}`} onClick={() => setSelectedProduct(item)} className="product-scroll-anim">
                  <div className="product-card-container" style={{ position: 'relative' }}>
                    {isAdmin && <div className="delete-icon" onClick={(e) => handleDeleteProduct(item.id, e)}>🗑️</div>}
                    <div className="product-bg">
                      <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '30px' }} />
                    </div>
                    <h3 className="product-title-text">{item.name}</h3>
                    <p style={{ fontWeight: '900', color: '#1a73e8', margin: 0 }}>{item.price} UAH</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-logo-section">
            <h2 className="footer-logo-3d">LEGIT STORE</h2>
            <p>Твій стиль. Твій вибір.</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Клієнтам</h4>
              <span onClick={() => setIsRulesOpen(true)} style={{ cursor: 'pointer' }}>Доставка та оплата</span>
              <span>Обмін та повернення</span>
              <span>Контакти</span>
            </div>
            <div className="footer-column">
              <h4>Соцмережі</h4>
              <span>Instagram</span>
              {/* КЛИКАБЕЛЬНЫЙ TELEGRAM */}
              <span onClick={() => window.open('https://t.me/+4E96rGDoMpAwZThi', '_blank')} style={{ cursor: 'pointer' }}>Telegram</span>
              <span>TikTok</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 LEGIT STORE. Всі права захищені.</p>
        </div>
      </footer>

      {/* Модалка товара */}
      {selectedProduct && (
        <div className={`modal-overlay ${isClosingModal ? 'closing' : ''}`} onClick={closeProductModal}>
          <div className={`compact-modal ${isClosingModal ? 'closing' : ''}`} onClick={e => e.stopPropagation()}>
            <div className="modal-close-pos"><CloseIcon onClick={closeProductModal} /></div>
            <div style={{ width: '50px', height: '5px', background: '#ddd', borderRadius: '10px', margin: '0 auto 20px' }}></div>
            <div className="slider-modal-container">
              <div className="slider-image-wrapper">
                <img key={selectedProduct.currentImageIndex} src={selectedProduct.images[selectedProduct.currentImageIndex]} alt={selectedProduct.name} className="slider-image" />
              </div>
              {selectedProduct.images.length > 1 && (
                <>
                  <button className="slider-arrow slider-arrow-left" onClick={handleModalPrev}>◀</button>
                  <button className="slider-arrow slider-arrow-right" onClick={handleModalNext}>▶</button>
                  <div className="slider-counter">{selectedProduct.currentImageIndex + 1} / {selectedProduct.images.length}</div>
                </>
              )}
            </div>
            <h2 style={{ fontWeight: '900', fontSize: '24px', margin: '15px 0 5px' }}>{selectedProduct.name}</h2>
            <p style={{ color: '#666', fontSize: '14px', margin: '0 0 20px' }}>{selectedProduct.desc}</p>
            <p style={{ fontSize: '10px', fontWeight: '900', margin: '0 0 10px 0' }}>ОБЕРІТЬ РОЗМІР</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '25px' }}>
              {selectedProduct.sizes.map(s => (
                <div key={s} onClick={() => setSelectedSize(s)} className={`size-btn ${selectedSize === s ? 'selected' : ''}`}>{s}</div>
              ))}
            </div>
            <button onClick={() => addToCart(selectedProduct)} className={`main-action-btn ${addedMsg ? 'success' : ''}`}>
              {addedMsg ? 'ГАРНИЙ ВИБІР ✓' : `ДОДАТИ — ${selectedProduct.price} UAH`}
            </button>
            <div className="reviews-section">
              <h3 style={{ fontSize: '14px', fontWeight: '900', margin: '20px 0 15px 0', color: '#1a73e8' }}>ВІДГУКИ КЛІЄНТІВ</h3>
              {fakeReviewsBase.slice(0, 3).map((review, idx) => (
                <div key={idx} className="review-card">
                  <div className="review-header"><span className="review-name">{review.name}</span><span className="review-stars">★★★★★</span></div>
                  <p className="review-text">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========== МОДАЛЬНОЕ ОКНО ПРАВИЛ ========== */}
      {isRulesOpen && (
        <div className="rules-overlay" onClick={() => setIsRulesOpen(false)}>
          <div className="rules-modal" onClick={e => e.stopPropagation()}>
            <button className="rules-close" onClick={() => setIsRulesOpen(false)}>✕</button>
            <h2 className="rules-title">📜 ПРАВИЛА ТА УМОВИ</h2>
            <div className="rules-images">
              <img src="images/rules1.jpg" alt="Правило 1" />
              <img src="images/rules2.jpg" alt="Правило 2" />
            </div>
            <div className="rules-text">
              ✔️ПЕРЕД ЗАМОВЛЕННЯМ УВАЖНО ПРОЧИТАТИ ЦІ ПРАВИЛА ✔️
              <br/><br/>
              ТОВАР ЇДЕ ТІЛЬКИ ПІД ЗАМОВЛЕННЯ ( наявність мається на увазі у постачальника)👍
              <br/><br/>
              ТЕРМІН ДІЇ ДОСТАВКИ 8-15 ДНІВ 🌐
              <br/><br/>
              ПОВЕРНЕННЯ КОШТІВ/РЕЧЕЙ В НАС НЕ МАЄ ( менеджер замовляє товар для вас під ваші критерії ) ТОМУ У РАЗІ ВІДМОВИ ТОВАР ТА КОШТИ ПОВЕРНЕННЮ НЕ ПІДЛЯГАЮТЬ 🤖
              <br/><br/>
              НАШ МАГАЗИН ГАРАНТУЄ ЯКІСТЬ ТОВАРУ ТА БЕЗПЕКУ ПРИ ЗАМОВЛЕННІ В НАШОМУ МАГАЗИНІ ⚡️
              <br/><br/>
              ЯКЩО ВИ ДЕСЬ ЗРОБИЛИ ПОМИЛКУ ПРИ ЗАМОВЛЕННІ (вказали невірну вагу або зріст, або вказали невірні данні для доставки ) ПОПЕРЕДЖАЙТЕ ОДРАЗУ ПРО ЦЕ МЕНЕДЖЕРА✅
              <br/><br/>
              ВІДМОВА АБО ОБМІН ТОВАРУ Є , АЛЕ В ВИПАДКУ ЯКЩО НЕ ПІДІЙДЕ РОЗМІР, КОЛІР АБО ЯКІСТЬ 📦
              <br/><br/>
              ПЕРЕД ЗАМОВЛЕННЯМИ ВИ ПОВИННІ РОЗУМІТИ ЩО ЦІНИ В ТГК ВКАЗАННІ БЕЗ УРАХУВАННЯ ДОСТАВКИ ,ТРЕБА ВРАХОВУВАТИ ЩО ДОСТАВКА 1кг = 18$📈
              <br/><br/>
              ПЕРША ТА ДРУГА ОПЛАТА НЕ ПОВЕРТАЮТЬСЯ ЯКЩО ВИ ПРОСТО ВІДМОВЛЯЄТЕСЬ І НЕ ХОЧЕТЕ ПЛАТИТИ ДОСТАВКУ🎁 
              <br/><br/>
              НЕ ПРОЧИТАННЯ ПРАВИЛ НЕ СКАСОВУЄ ВІДПОВІДАЛЬНІСТЬ 🚫
              <br/><br/>
              ТОМУ УВАЖНО ЧИТАЙТЕ УМОВИ ПЕРЕД ОФОРМЛЕННЯМ ЗАМОВЛЕННЯ🚨
            </div>
          </div>
        </div>
      )}

      <style>{`
        * { scrollbar-width: none; -ms-overflow-style: none; }
        *::-webkit-scrollbar { display: none; }
        @keyframes rotate3d { 0% { transform: rotateY(0deg); } 100% { transform: rotateY(360deg); } }
        .logo-wrap-3d { perspective: 1000px; display: flex; align-items: center; }
        .main-logo-3d { font-size: 18px; font-weight: 900; letter-spacing: 1px; margin: 0; color: #fff; text-shadow: 0 2px 4px rgba(0,0,0,0.2); display: inline-block; }
        @keyframes textShimmer { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
        .animated-title { font-size: 36px; font-weight: 900; margin-bottom: 30px; text-transform: uppercase; background: linear-gradient(90deg, #000 0%, #000 15%, #1a73e8 50%, #000 85%, #000 100%); background-size: 150% auto; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: textShimmer 2.5s infinite alternate; opacity: 0; transform: translateY(20px); transition: all 0.8s ease-out; }
        .animated-title.is-visible { opacity: 1; transform: translateY(0); }
        .search-container { margin-bottom: 25px; }
        .search-input { width: 100%; padding: 12px 20px; border-radius: 12px; border: 1px solid #eee; background: #f9f9f9; font-size: 14px; font-weight: 600; outline: none; transition: 0.3s; }
        .search-input:focus { border-color: #1a73e8; background: #fff; box-shadow: 0 5px 15px rgba(26,115,232,0.05); }
        .main-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 5%; position: fixed; top: 0; left: 0; width: 100%; box-sizing: border-box; z-index: 1000; background: linear-gradient(to bottom, rgba(26,115,232,0.95) 0%, rgba(26,115,232,0.5) 60%, rgba(26,115,232,0) 100%); backdrop-filter: blur(8px); }
        .nav-pill-btn { background: #fff; color: #1a73e8; border: none; padding: 6px 16px; border-radius: 50px; font-size: 10px; font-weight: 900; cursor: pointer; transition: 0.3s; }
        .nav-pill-btn:hover { background: #eee; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .size-btn { padding: 12px 15px; border: 1px solid #eee; cursor: pointer; border-radius: 8px; font-weight: 700; background: #f5f5f5; transition: all 0.2s ease; }
        .size-btn:hover:not(.selected) { transform: translateY(-3px); border-color: #1a73e8; background: #fff; }
        .size-btn.selected { background: #000; color: #fff; border-color: #000; transform: scale(1.05); }
        .main-action-btn { padding: 20px; background: #000; color: #fff; width: 100%; font-weight: 900; border: none; border-radius: 12px; cursor: pointer; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .main-action-btn.success { background: #28a745; animation: btnPop 0.4s ease forwards; }
        .order-btn-green { width: 100%; padding: 18px; background: #28a745; color: #fff; border: none; border-radius: 15px; font-weight: 900; cursor: pointer; text-transform: uppercase; font-size: 13px; transition: all 0.3s ease; }
        .order-btn-green:hover { background: #218838; transform: translateY(-3px); box-shadow: 0 10px 20px rgba(40,167,69,0.3); }
        .shop-section-wrapper { padding: 80px 5%; overflow: hidden; }
        .section-no-vertical-scroll { overflow-y: hidden; }
        .slider-relative-container { position: relative; display: flex; align-items: center; }
        .products-scroll-container { display: flex; gap: 20px; overflow-x: auto; overflow-y: hidden; padding-bottom: 40px; scroll-behavior: smooth; width: 100%; scrollbar-width: none; scroll-snap-type: x mandatory; }
        .products-scroll-container::-webkit-scrollbar { display: none; }
        .all-products-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; padding-bottom: 20px; }
        .product-scroll-anim { flex: 0 0 calc((100% - 60px) / 4); opacity: 0; transform: translateY(60px); transition: opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94); scroll-snap-align: start; scroll-snap-stop: always; }
        .product-scroll-anim.is-visible { opacity: 1; transform: translateY(0); }
        .product-card-container { padding: 10px; border-radius: 30px; cursor: pointer; background: transparent; transition: all 0.3s ease; position: relative; }
        .product-card-container:hover { transform: translateY(-8px); background: #fff; box-shadow: 0 15px 35px rgba(0,0,0,0.08); }
        .product-bg { height: 280px; background: #f0f4ff; display: flex; align-items: center; justify-content: center; padding: 20px; border-radius: 30px; transition: all 0.4s ease; overflow: hidden; }
        .product-title-text { font-size: 16px; font-weight: 700; margin: 15px 0 5px; color: #000; }
        .delete-icon { position: absolute; top: 12px; right: 12px; background: rgba(255,255,255,0.9); backdrop-filter: blur(4px); width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; cursor: pointer; transition: all 0.2s ease; z-index: 10; color: #dc2626; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .delete-icon:hover { background: #dc2626; color: white; transform: scale(1.1); }
        .admin-panel-modern { max-width: 560px; margin: 30px auto; background: #ffffff; border-radius: 32px; box-shadow: 0 20px 35px -10px rgba(0,0,0,0.1), 0 0 0 1px rgba(26,115,232,0.1); z-index: 1000; position: relative; }
        .admin-panel-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 28px; background: #f8fafc; border-bottom: 1px solid #eef2f6; border-radius: 32px 32px 0 0; }
        .admin-panel-header h2 { font-size: 1.5rem; font-weight: 800; margin: 0; background: linear-gradient(135deg, #1a73e8, #0d47a1); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .admin-close-btn { background: none; border: none; font-size: 28px; cursor: pointer; color: #aaa; transition: 0.2s; line-height: 1; }
        .admin-close-btn:hover { color: #1a73e8; transform: rotate(90deg); }
        .admin-form { padding: 28px; display: flex; flex-direction: column; gap: 18px; }
        .admin-input { width: 100%; padding: 14px 18px; border: 1.5px solid #e2e8f0; border-radius: 20px; font-size: 14px; transition: 0.2s; outline: none; background: #fff; }
        .admin-input:focus { border-color: #1a73e8; box-shadow: 0 0 0 3px rgba(26,115,232,0.1); }
        .admin-row { display: flex; gap: 15px; }
        .file-zone { background: #f8fafc; border-radius: 20px; padding: 15px; text-align: center; border: 1px dashed #cbd5e1; }
        .file-label { font-weight: 600; color: #1e293b; display: block; margin-bottom: 8px; }
        .file-trigger { background: #1a73e8; color: white; border: none; padding: 10px 20px; border-radius: 40px; font-weight: 600; cursor: pointer; transition: 0.2s; }
        .file-trigger:hover { background: #0d47a1; transform: translateY(-2px); }
        .admin-submit { background: linear-gradient(135deg, #1a73e8, #0d47a1); color: white; border: none; padding: 16px; border-radius: 40px; font-weight: 800; font-size: 16px; cursor: pointer; transition: 0.3s; margin-top: 10px; }
        .admin-submit:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(26,115,232,0.3); }
        .slider-modal-container { position: relative; border-radius: 20px; overflow: hidden; background: #f0f4ff; margin-bottom: 20px; }
        .slider-image-wrapper { width: 100%; aspect-ratio: 1 / 1; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .slider-image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease, opacity 0.25s ease; animation: fadeScale 0.25s ease-out; }
        @keyframes fadeScale { 0% { opacity: 0.7; transform: scale(0.98); } 100% { opacity: 1; transform: scale(1); } }
        .slider-arrow { position: absolute; top: 50%; transform: translateY(-50%); background: #1a73e8; border: none; color: white; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 5; opacity: 0.85; }
        .slider-arrow:hover { background: #0d47a1; transform: translateY(-50%) scale(1.08); opacity: 1; box-shadow: 0 6px 16px rgba(26,115,232,0.4); }
        .slider-arrow-left { left: 12px; }
        .slider-arrow-right { right: 12px; }
        .slider-counter { position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); color: white; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 30px; }
        .reviews-section { margin-top: 25px; border-top: 1px solid #eee; padding-top: 15px; text-align: left; max-height: 200px; overflow-y: auto; }
        .review-card { background: #f9f9f9; padding: 12px; border-radius: 10px; margin-bottom: 10px; }
        .review-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
        .review-name { font-weight: 800; font-size: 13px; color: #000; }
        .review-stars { color: #f5c518; font-size: 12px; }
        .review-text { font-size: 12px; color: #555; margin: 0; line-height: 1.4; }
        .drawer-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 4500; opacity: 0; pointer-events: none; transition: 0.4s ease; backdrop-filter: blur(3px); }
        .drawer-overlay.visible { opacity: 1; pointer-events: auto; }
        .side-drawer { position: fixed; top: 0; width: 100%; max-width: 340px; height: 100%; background: #fff; z-index: 5000; padding: 40px 30px; box-sizing: border-box; display: flex; flex-direction: column; transition: transform 0.5s cubic-bezier(0.16,1,0.3,1); }
        .left-drawer { left: 0; transform: translateX(-110%); border-radius: 0 30px 30px 0; box-shadow: 12px 0 30px -5px rgba(26,115,232,0.7); }
        .right-drawer { right: 0; transform: translateX(110%); border-radius: 30px 0 0 30px; box-shadow: -12px 0 30px -5px rgba(26,115,232,0.7); }
        .side-drawer.open { transform: translateX(0); }
        .catalog-content { display: flex; flex-direction: column; gap: 30px; overflow-y: auto; }
        .catalog-subtitle { font-size: 14px; color: #999; margin-bottom: 10px; font-weight: 800; letter-spacing: 1px; }
        .catalog-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 15px; }
        .catalog-list li { font-size: 18px; font-weight: 700; cursor: pointer; transition: all 0.2s; position: relative; width: fit-content; }
        .catalog-list li:hover { color: #1a73e8; transform: translateX(5px); }
        .active-category { color: #1a73e8; transform: translateX(5px); }
        .active-category::after { content: ''; position: absolute; left: -15px; top: 50%; transform: translateY(-50%); width: 6px; height: 6px; background: #1a73e8; border-radius: 50%; }
        .main-footer { background: #0a0a0a; color: #fff; padding: 60px 5% 20px; margin-top: auto; }
        .footer-bottom { text-align: center; color: #666; font-size: 12px; }
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 6000; display: flex; align-items: flex-end; justify-content: center; transition: opacity 0.3s ease; }
        .compact-modal { background: #fff; padding: 30px; width: 100%; max-width: 500px; position: relative; border-radius: 30px 30px 0 0; animation: slideUp 0.4s cubic-bezier(0.165,0.84,0.44,1) forwards; max-height: 90vh; overflow-y: auto; }
        .close-icon-wrapper { position: absolute; top: 20px; right: 20px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #999; transition: all 0.3s; z-index: 100; }
        .close-icon-wrapper:hover { transform: rotate(90deg); color: #1a73e8; }
        .slider-nav-btn { background: transparent; border: none; cursor: pointer; transition: 0.3s; z-index: 10; position: absolute; padding: 0; }
        .slider-nav-btn.prev { left: -20px; }
        .slider-nav-btn.next { right: -20px; }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        body { margin: 0; padding: 0; overflow-x: hidden; }
        .hero-section { height: 100vh; background: linear-gradient(135deg, #001a4d, #1a73e8); position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .hero-section::after { content: ""; position: absolute; bottom: 0; left: 0; width: 100%; height: 50%; background: linear-gradient(to top, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0) 100%); z-index: 1; }
        .hero-pc-content { position: relative; z-index: 10; text-align: center; display: block; }
        .hero-mobile-container { display: none; }
        .hero-text-anim { font-size: clamp(60px, 18vw, 150px); font-weight: 900; margin: 0; line-height: 0.8; text-shadow: 2px 4px 10px rgba(0,0,0,0.15); text-align: center; }
        .придбати-btn { margin-top: 30px; padding: 12px 35px; border: 2px solid #1a73e8; background: #1a73e8; color: #fff; cursor: pointer; font-weight: 900; border-radius: 50px; font-size: 14px; transition: all 0.3s ease; display: inline-block; }
        .придбати-btn:hover { transform: translateY(-5px) scale(1.05); box-shadow: 0 10px 20px rgba(26,115,232,0.4); background: #0056b3; border-color: #0056b3; }
        /* Стили модалки правил */
        .rules-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 7000; padding: 20px; box-sizing: border-box; }
        .rules-modal { background: #1a1a1a; color: #fff; max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto; border-radius: 28px; padding: 28px 24px; position: relative; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); scrollbar-width: thin; }
        .rules-modal::-webkit-scrollbar { width: 5px; }
        .rules-modal::-webkit-scrollbar-track { background: #2a2a2a; border-radius: 10px; }
        .rules-modal::-webkit-scrollbar-thumb { background: #1a73e8; border-radius: 10px; }
        .rules-close { position: absolute; top: 18px; right: 20px; background: none; border: none; font-size: 28px; color: #aaa; cursor: pointer; transition: 0.2s; line-height: 1; padding: 0; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
        .rules-close:hover { color: #fff; background: #333; transform: rotate(90deg); }
        .rules-title { font-size: 1.8rem; font-weight: 900; text-align: center; margin: 0 0 20px 0; letter-spacing: -0.5px; background: linear-gradient(135deg, #fff, #1a73e8); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .rules-images { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; justify-content: center; }
        .rules-images img { width: calc(50% - 8px); max-width: 260px; border-radius: 20px; background: #2c2c2c; object-fit: cover; border: 1px solid #333; box-shadow: 0 8px 20px rgba(0,0,0,0.3); }
        .rules-text { font-size: 14px; line-height: 1.55; font-weight: 500; white-space: pre-wrap; word-break: break-word; padding-right: 6px; color: #eee; }
        @media (max-width: 550px) {
          .rules-images img { width: 100%; max-width: 100%; }
          .rules-modal { padding: 20px 18px; }
          .rules-title { font-size: 1.4rem; }
        }
        @media (max-width: 768px) {
          .hero-section { background: none !important; display: block; height: auto; min-height: auto; }
          .hero-section::after { display: none; }
          .hero-pc-content { display: none; }
          .hero-mobile-container { display: block; width: 100%; position: relative; }
          .hero-mobile-img-wrap { position: relative; width: 100%; height: 80vh; background: #f9f9f9; overflow: hidden; }
          .hero-mobile-gradient { position: absolute; bottom: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%); z-index: 2; }
          .hero-content-mobile { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10; text-align: center; width: 100%; }
          .hero-text-anim { font-size: clamp(40px, 14vw, 75px); color: #fff; }
          .shop-section-wrapper { padding: 40px 5%; }
          .slider-nav-btn { display: none; }
          .all-products-grid { grid-template-columns: repeat(2, 1fr); gap: 15px; }
          .product-scroll-anim { flex: 0 0 75%; }
          .slider-arrow { width: 36px; height: 36px; }
          .slider-arrow svg { width: 20px; height: 20px; }
        }
      `}</style>
    </div>
  );
}

export default App;