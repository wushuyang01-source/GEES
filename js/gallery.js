document.addEventListener('DOMContentLoaded', function() {
    // Gallery functionality
    const mainImage = document.getElementById('mainGalleryImage');
    const mainTitle = document.getElementById('mainGalleryTitle');
    const thumbnails = document.querySelectorAll('.gallery-thumb:not(.gallery-thumb--more)');
    
    if (mainImage && thumbnails.length > 0) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                // Remove active class from all thumbnails
                thumbnails.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked thumbnail
                this.classList.add('active');
                
                // Update main image and title
                const newImage = this.dataset.image;
                const newTitle = this.dataset.title;
                
                if (newImage) {
                    mainImage.src = newImage;
                    mainImage.alt = newTitle || 'E-Pilot Image';
                }
                
                if (newTitle && mainTitle) {
                    mainTitle.textContent = newTitle;
                }
            });
        });
    }
    
    // Handle +1 more images click
    const moreThumb = document.querySelector('.gallery-thumb--more');
    if (moreThumb) {
        moreThumb.addEventListener('click', function() {
            // You can implement a modal or lightbox here
            console.log('Show more images modal');
            // For now, just update the main image
            const newImage = this.dataset.image;
            if (newImage && mainImage) {
                // Remove active class from regular thumbnails
                thumbnails.forEach(t => t.classList.remove('active'));
                
                mainImage.src = newImage;
                mainImage.alt = 'Additional E-Pilot Image';
                
                if (mainTitle) {
                    mainTitle.textContent = 'Additional Views';
                }
            }
        });
    }
});