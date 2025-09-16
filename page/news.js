document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('news-search');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const newsGrid = document.querySelector('.news-grid');
    
    // Initialize LinkedIn API
    let linkedInAPI;
    
    // Handle OAuth callback first
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    
   
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterNews(searchTerm, getActiveFilter());
        });
    }
    
    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            filterNews(searchTerm, category);
        });
    });
    
    async function loadLinkedInPosts() {
        try {
            const posts = await linkedInAPI.getPosts();
            console.log('Loaded LinkedIn posts:', posts.length);
            displayLinkedInPosts(posts);
        } catch (error) {
            console.error('Failed to load LinkedIn posts:', error);
            addLinkedInLoginButton();
        }
    }
    
    function displayLinkedInPosts(posts) {
        // Remove existing LinkedIn posts
        const existingLinkedInPosts = newsGrid.querySelectorAll('[data-category="linkedin"]');
        existingLinkedInPosts.forEach(post => post.remove());
        
        // Add new LinkedIn posts
        posts.slice(0, 3).forEach(post => { // Limit to 3 posts
            const article = createLinkedInNewsCard(post);
            newsGrid.appendChild(article);
        });
    }
    
    function createLinkedInNewsCard(post) {
        const article = document.createElement('article');
        article.className = 'news-card';
        article.dataset.category = 'linkedin';
        
        const postText = post.text?.text || post.commentary || 'LinkedIn Post';
        const postDate = new Date(post.created?.time || Date.now()).toLocaleDateString();
        const postUrl = `https://www.linkedin.com/feed/update/${post.id}`;
        
        article.innerHTML = `
            <div class="news-content">
                <span class="news-category linkedin">LinkedIn</span>
                <span class="news-date">${postDate}</span>
                <h3>${postText.substring(0, 50)}...</h3>
                <p>${postText.substring(0, 150)}${postText.length > 150 ? '...' : ''}</p>
                <a href="${postUrl}" target="_blank" class="read-more">View on LinkedIn</a>
            </div>
        `;
        
        return article;
    }
    
    function addLinkedInLoginButton() {
        // Remove existing login button
        const existingBtn = document.querySelector('.linkedin-login-btn');
        if (existingBtn) existingBtn.remove();
        
        const newsHeader = document.querySelector('.news-header');
        const loginBtn = document.createElement('button');
        loginBtn.textContent = 'Connect LinkedIn to show your posts';
        loginBtn.className = 'linkedin-login-btn';
        loginBtn.style.cssText = `
            background: #0077b5;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 5px;
            margin-top: 1rem;
            cursor: pointer;
            font-weight: 600;
            display: block;
            margin-left: auto;
            margin-right: auto;
        `;
        
        loginBtn.addEventListener('click', () => {
            if (linkedInAPI) {
                linkedInAPI.authorize();
            } else {
                console.error('LinkedIn API not initialized');
            }
        });
        
        newsHeader.appendChild(loginBtn);
    }
    
    function getActiveFilter() {
        const activeBtn = document.querySelector('.filter-btn.active');
        return activeBtn ? activeBtn.dataset.category : 'all';
    }
    
    function filterNews(searchTerm, category) {
        const allCards = document.querySelectorAll('.news-card');
        
        allCards.forEach(card => {
            const cardCategory = card.dataset.category || '';
            const cardText = card.textContent.toLowerCase();
            
            const matchesSearch = !searchTerm || cardText.includes(searchTerm);
            const matchesCategory = category === 'all' || cardCategory === category;
            
            if (matchesSearch && matchesCategory) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Initialize LinkedIn when config is ready
    if (window.LINKEDIN_CONFIG) {
        initializeLinkedIn();
    } else {
        console.error('LINKEDIN_CONFIG not found - make sure config.js loads first');
    }
});