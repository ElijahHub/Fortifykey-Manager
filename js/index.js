const passEye = document.querySelectorAll('.pass-icon');

passEye.forEach((eye) => {
  eye.addEventListener('click', () => {
    eye.classList.toggle('bi-eye');
    eye.classList.toggle('bi-eye-slash');
    if (eye.classList.contains('bi-eye-slash')) {
      eye.previousElementSibling.type = 'text';
    } else {
      eye.previousElementSibling.type = 'password';
    }
  });
});
let counter = 1;
const change = () => {
  counter === 5 ? (counter = 1) : counter++;
  const noActive = counter === 1 ? 5 : counter - 1;
  document.querySelector(`.slide-${noActive}`).classList.add('hidden');
  document.querySelector(`.slide-${counter}`).classList.remove('hidden');
};
if (window.screen.width > 1024) {
  setInterval(change, 10000);
}
