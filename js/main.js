const hambuger = document.querySelector('.hambuger');
const navMobile = document.querySelector('.nav-list-mobile');
const dropDown = document.querySelectorAll('.bi-chevron-down');
const faqsContent = document.querySelectorAll('.faqs-content');
//Generat
const screen = document.getElementById('screen');
const len = document.getElementById('length');
const lowerCase = document.getElementById('lowercase');
const upperCase = document.getElementById('uppercase');
const number = document.getElementById('number');
const symbol = document.getElementById('symbol');
const btn = document.querySelector('.btn-gen');
const view = document.getElementById('view');
const years = document.getElementById('years');
const copyPassword = document.getElementById('copy-password');
const copySuccess = document.querySelector('.copy-success');

hambuger.addEventListener('click', () => {
  navMobile.classList.toggle('hidden');
});

dropDown.forEach((drop, i) => {
  drop.addEventListener('click', () => {
    drop.classList.toggle('bi-chevron-down');
    drop.classList.toggle('bi-chevron-up');
    faqsContent[i].classList.toggle('hidden');
  });
});

const header = document.querySelectorAll('.main-header');

window.addEventListener('scroll', scrollE);
scrollE();

function scrollE() {
  header.forEach((head) => {
    if (window.scrollY > head.offsetHeight + 150) {
      head.classList.add('fixed');
    } else {
      head.classList.remove('fixed');
    }
  });
}

//Generate Function

class Gene {
  generatePassword(lower, upper, number, symbol, length) {
    let generatedPassword = '';

    const typesCount = lower + upper + number + symbol;

    const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(
      (item) => Object.values(item)[0]
    );

    if (typesCount === 0) {
      return '';
    }

    for (let i = 0; i < length; i += typesCount) {
      typesArr.forEach((type) => {
        const funcName = Object.keys(type)[0];
        generatedPassword += this.randomFunc[funcName]();
      });
    }

    const finalPassword = generatedPassword.slice(0, length);
    return finalPassword;
  }

  randomFunc = {
    lower: this.getLower,
    upper: this.getUpper,
    number: this.getNumbers,
    symbol: this.getSymbols,
  };
  //Generator function

  getLower() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 97);
  }
  getUpper() {
    return String.fromCharCode(Math.floor(Math.random() * 26) + 65);
  }
  getNumbers() {
    return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
  }
  getSymbols() {
    const sys = '!@#$%^&*?';
    return sys[Math.floor(Math.random() * sys.length)];
  }

  findTrue(field) {
    let compareNum = /[0-9]+/g;
    let compareLower = /[a-z]+/g;
    let compareUpper = /[A-Z]+/g;
    let compareSyb = /[^0-9a-zA-Z]+/g;
    return (
      (compareNum.test(field) +
        compareLower.test(field) +
        compareUpper.test(field) +
        compareSyb.test(field)) *
      10
    );
  }
}

const generate = new Gene();

if (window.location.pathname === '/index.html') {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const length = +len.value;
    const hasLower = lowerCase.checked;
    const hasUpper = upperCase.checked;
    const hasNumber = number.checked;
    const hasSymbol = symbol.checked;

    screen.value = generate.generatePassword(
      hasLower,
      hasUpper,
      hasNumber,
      hasSymbol,
      length
    );
  });

  let count = 0;
  let count2 = 0;

  function inc() {
    count++;
    if (count === 35) {
      clearInterval(interval);
    }
    view.style.transition = 'all 0.75s ease';
    view.innerText = `${count}+ million`;
  }

  function inc2() {
    count2++;
    if (count2 === 5) {
      clearInterval(interval2);
    }
    years.style.transition = 'all 0.75s ease';
    years.innerText = `${count2}+ years`;
  }

  let interval = setInterval(inc, 125);
  let interval2 = setInterval(inc2, 1000);

  copyPassword.addEventListener('click', () => {
    const password = screen.value;
    if (!password) {
      return;
    }

    navigator.clipboard.writeText(password);
    copyPassword.classList.add('hidden');
    copySuccess.classList.remove('hidden');
    setTimeout(() => {
      copyPassword.classList.remove('hidden');
      copySuccess.classList.add('hidden');
    }, 3000);
  });
}
