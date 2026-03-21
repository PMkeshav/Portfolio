let currentSlide = 0;
const slider = document.getElementById("slider");
const totalSlides = slider.children.length;


function showSlides( index ) {
  if (index < 0) index = totalSlides - 1;
  if (index >= totalSlides) index = 0;
  slider.style.transform = `translateX(-${index * 100}%)`;
  currentSlide = index;
}

function nextSlide(){
  showSlides(currentSlide + 1);
}

 function prevSlide() {
    showSlides(currentSlide - 1);
  }