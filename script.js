  const button = document.getElementById('waterButton');

  button.addEventListener('click', () => {
    button.classList.add('filling');
  });


  // On page load, check if already watered today
const today = new Date().toDateString();
const lastWatered = localStorage.getItem('lastWatered');

if (lastWatered === today) {
  button.classList.add('filling');  // show as already watered
}

button.addEventListener('click', () => {
  button.classList.add('filling');
  localStorage.setItem('lastWatered', today);
});