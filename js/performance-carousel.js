document.addEventListener('DOMContentLoaded', function() {
    const track = document.getElementById('performanceTrack');
    const prevBtn = document.getElementById('perfPrevBtn');
    const nextBtn = document.getElementById('perfNextBtn');
    const indicators = document.querySelectorAll('.performance .carousel__indicator');
    
    let currentSlide = 0;
    
    // Simple if-else to determine total slides based on filename
    let totalSlides;
    if (window.location.pathname.includes('fullelectricsystem')) {
        totalSlides = 6;
    } else if (window.location.pathname.includes('serialhybridsystem')) {
        totalSlides = 3;
    } else if (window.location.pathname.includes('parallelhybridsystem')) {
        totalSlides = 4;
    } else {
        totalSlides = 3; // default
    }
    
    function updateCarousel() {
        const translateX = -currentSlide * (100 / totalSlides);
        track.style.transform = `translateX(${translateX}%)`;
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('carousel__indicator--active', index === currentSlide);
        });
        
        const slides = document.querySelectorAll('.performance .carousel__slide');
        slides.forEach((slide, index) => {
            slide.classList.toggle('carousel__slide--active', index === currentSlide);
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }
    
    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateCarousel();
    }
    
    if (prevBtn && nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
    }
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });
    
    // Auto-advance slides every 8 seconds
    setInterval(nextSlide, 8000);
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (document.querySelector('.performance:hover')) {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
        }
    });
    
    // Initialize carousel
    updateCarousel();
});