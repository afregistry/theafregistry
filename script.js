document.addEventListener("DOMContentLoaded", () => {
    // Redefining htmlElement inside the script so the buttons can find it again
    const htmlElement = document.documentElement;
    
    // Theme Button Logic
    const themeBtns = {
        black: document.getElementById('theme-black'),
        white: document.getElementById('theme-white'),
        gray: document.getElementById('theme-gray'),
        random: document.getElementById('theme-random')
    };

    function setTheme(themeName) {
        htmlElement.setAttribute('data-theme', themeName);
        htmlElement.style = ''; 
        localStorage.setItem('site-theme', themeName);
    }

    function generateRandomTheme() {
        const randomBg = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        const r = parseInt(randomBg.slice(1, 3), 16);
        const g = parseInt(randomBg.slice(3, 5), 16);
        const b = parseInt(randomBg.slice(5, 7), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        const textColor = brightness > 125 ? '#000000' : '#ffffff';

        htmlElement.setAttribute('data-theme', 'random');
        htmlElement.style.setProperty('--bg-color', randomBg);
        htmlElement.style.setProperty('--sidebar-bg', randomBg);
        htmlElement.style.setProperty('--text-color', textColor);
        htmlElement.style.setProperty('--link-color', textColor);
        
        localStorage.setItem('site-theme', 'random');
        localStorage.setItem('custom-bg', randomBg);
        localStorage.setItem('custom-text', textColor);
    }

    if(themeBtns.black) themeBtns.black.addEventListener('click', () => setTheme('black'));
    if(themeBtns.white) themeBtns.white.addEventListener('click', () => setTheme('white'));
    if(themeBtns.gray) themeBtns.gray.addEventListener('click', () => setTheme('gray'));
    if(themeBtns.random) themeBtns.random.addEventListener('click', generateRandomTheme);

    // Live Search & Filter Logic
    const searchBox = document.getElementById('live-search');
    const checkboxes = document.querySelectorAll('.cat-filter');
    const items = document.querySelectorAll('.filterable-item');

    function filterContent() {
        const query = searchBox ? searchBox.value.toLowerCase() : '';
        const activeCategories = Array.from(checkboxes)
                                      .filter(cb => cb.checked)
                                      .map(cb => cb.value.toLowerCase());

        // 1. Hide/Show items based on search/tags AND category headers
        items.forEach(item => {
            const title = (item.getAttribute('data-title') || '').toLowerCase();
            const tags = (item.getAttribute('data-tags') || '').toLowerCase();
            
            const parentRefCategory = item.closest('.ref-category');
            const parentCategoryTitle = parentRefCategory ? parentRefCategory.querySelector('.ref-header').textContent.toLowerCase() : '';

            const matchesSearch = title.includes(query) || tags.includes(query) || parentCategoryTitle.includes(query);
            const matchesCategory = activeCategories.length === 0 || activeCategories.some(cat => tags.includes(cat));

            item.style.display = (matchesSearch && matchesCategory) ? '' : 'none';
        });

        // 2. Hide/Show empty Reference categories
        const refCategories = document.querySelectorAll('.ref-category');
        refCategories.forEach(category => {
            const itemsInCategory = Array.from(category.querySelectorAll('.filterable-item'));
            if (itemsInCategory.length > 0) {
                const hasVisibleItems = itemsInCategory.some(item => item.style.display !== 'none');
                category.style.display = hasVisibleItems ? '' : 'none';
            }
        });
    }

    if (searchBox) searchBox.addEventListener('input', filterContent);
    checkboxes.forEach(cb => cb.addEventListener('change', filterContent));

    // --- AUTO-FOCUS TYPING LOGIC ---
    document.addEventListener('keydown', (e) => {
        if (!searchBox) return; 

        if (document.activeElement !== searchBox && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            searchBox.focus();
        }
    });
});
