<script>
  // Carousel Functionality
  document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    if (carousel) {
      const list = carousel.querySelector('.list');
      const items = list.querySelectorAll('.item');
      const prevBtn = carousel.querySelector('#prev');
      const nextBtn = carousel.querySelector('#next');
      
      let currentIndex = 0;
      const itemCount = items.length;
      
      function updateCarousel() {
        list.style.transform = `translateX(-${currentIndex * 100}%)`;
      }
      
      nextBtn.addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % itemCount;
        updateCarousel();
      });
      
      prevBtn.addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + itemCount) % itemCount;
        updateCarousel();
      });
      
      // Auto-rotate every 5 seconds
      let autoRotate = setInterval(() => {
        currentIndex = (currentIndex + 1) % itemCount;
        updateCarousel();
      }, 5000);
      
      // Pause on hover
      carousel.addEventListener('mouseenter', () => clearInterval(autoRotate));
      carousel.addEventListener('mouseleave', () => {
        autoRotate = setInterval(() => {
          currentIndex = (currentIndex + 1) % itemCount;
          updateCarousel();
        }, 5000);
      });
    }
  });
</script>