document.addEventListener('DOMContentLoaded', function() {
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelectorAll('.carousel__indicator');
    
    let currentSlide = 0;
    const totalSlides = 3;
    
    function updateCarousel() {
        const translateX = -currentSlide * (100 / totalSlides);
        track.style.transform = `translateX(${translateX}%)`;
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('carousel__indicator--active', index === currentSlide);
        });
        
        const slides = document.querySelectorAll('.carousel__slide');
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
    
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });
    
    setInterval(nextSlide, 56000);
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
});