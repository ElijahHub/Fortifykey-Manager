const form = document.getElementById('login-form');
const userError = document.querySelector('.user-error');
const passError = document.querySelector('.password-error');
const loader = document.querySelector('.loader');
const usersApi = 'https://fortifykey-server.onrender.com/user';

//decrypt function
const dencFunc = (msg) => {
  let e = new Encrypt('F23-FK100', msg);
  return e.messageDecrypt();
};
const encFunc = (msg) => {
  let e = new Encrypt('F23-FK100', msg);
  return e.messageEncrypt();
};
let object = {};
class Login {
  constructor(form, fields) {
    this.form = form;
    this.fields = fields;
    this.validateOnSubmit();
  }

  //Main form validation
  validateOnSubmit() {
    let self = this;

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();

      let error = 0;

      self.fields.forEach((field) => {
        const input = document.getElementById(`${field}`);
        if (self.validaterFields(input) == false) {
          error++;
        }
        if (error == 0) {
          object[field] = document.getElementById(`${field}`).value;
        }
      });

      if (error == 0) {
        loader.classList.remove('hidden');
        fetch(`${usersApi}?username=${object.username}`)
          .then((res) => res.json())
          .then((data) => {
            loader.classList.add('hidden');
            if (data.length !== 0) {
              let decryptPass = dencFunc(data[0].password);
              if (decryptPass === object.password) {
                this.form.submit();
                sessionStorage.setItem('logger', object.username);
              } else {
                passError.innerText = 'Incorrect password';
                setTimeout(() => (passError.innerText = ''), 3000);
              }
            } else {
              userError.innerText = 'User name does not exist';
              setTimeout(() => (userError.innerText = ''), 3000);
            }
          });
      }
    });
  }

  //Form input validator
  validaterFields(field) {
    if (field.value.trim() == '') {
      this.setStatus(
        field,
        `${field.previousElementSibling.innerText} cannot be blank`,
        'error'
      );
      return false;
    } else {
      this.setStatus(field, null, 'success');
      return true;
    }
  }

  setStatus(field, msg, status) {
    const errorMessage = field.parentElement.querySelector('.error-message');

    if (status == 'success') {
      if (errorMessage) {
        errorMessage.innerText = '';
      }
    }

    if (status == 'error') {
      errorMessage.innerText = msg;
      setTimeout(() => (errorMessage.innerText = ''), 3000);
    }
  }
}

if (form) {
  const fields = ['username', 'password'];
  const validator = new Login(form, fields);
}

const forgetPassword = document.querySelector('.forget-link');
const overlay = document.querySelector('.overlay-log');
const confirmEmail = document.querySelector('.confirm-email');
const userName = document.getElementById('username-confirm');
const emailInput = document.getElementById('email');
const emailBtn = document.getElementById('verify-email');
const usernameError = document.querySelector('.users-error');
const emailError = document.querySelector('.email-error');
const changePassword = document.querySelector('.change-password');
const newPassword = document.getElementById('new-password');
const confirmNewPassword = document.getElementById('confirm-new-password');
const changeBtn = document.getElementById('change-btn');
const newPassError = document.querySelector('.newpass-error');
const confirmPassError = document.querySelector('.confirmpass-error');
const closeBtn1 = document.querySelector('.close-email');
const closeBtn2 = document.querySelector('.close-pass');

//function
const findTrue = (field) => {
  let compareNum = /[0-9]+/g;
  let compareLower = /[a-z]+/g;
  let compareUpper = /[A-Z]+/g;
  let compareSyb = /[^0-9a-zA-Z]+/g;
  let trues =
    compareNum.test(field) &&
    compareLower.test(field) &&
    compareUpper.test(field) &&
    compareSyb.test(field);

  return trues;
};

forgetPassword.addEventListener('click', (e) => {
  e.preventDefault();
  overlay.classList.remove('hidden');
  confirmEmail.classList.remove('hidden');
});

emailBtn.addEventListener('click', (e) => {
  fetch(`${usersApi}?username=${userName.value}`)
    .then((res) => res.json())
    .then((data) => {
      e.preventDefault();
      if (data.length === 0) {
        usernameError.innerText = 'wrong username';
        setTimeout(() => (usernameError.innerText = ''), 3000);
      } else if (emailInput.value !== data[0].email) {
        emailError.innerText = 'invalid email address';
        setTimeout(() => (emailError.innerText = ''), 3000);
      } else {
        confirmEmail.classList.add('hidden');
        changePassword.classList.remove('hidden');
      }
    });
});

closeBtn1.addEventListener('click', () => {
  overlay.classList.add('hidden');
  confirmEmail.classList.add('hidden');
});
closeBtn2.addEventListener('click', () => {
  overlay.classList.add('hidden');
  changePassword.classList.add('hidden');
});

changeBtn.addEventListener('click', () => {
  fetch(`${usersApi}?username=${userName.value}`)
    .then((res) => res.json())
    .then((data) => {
      if (newPassword.value.length < 8) {
        newPassError.innerText = 'must be at least 8 characters';
        setTimeout(() => (newPassError.innerText = ''), 3000);
      } else if (findTrue(newPassword.value) === false) {
        newPassError.innerText =
          'must include at least an uppercase letter, a lowercase letter, a number and a symbol.';
        setTimeout(() => (newPassError.innerText = ''), 3000);
      } else {
        if (confirmNewPassword.value !== newPassword.value) {
          confirmPassError.innerText = 'confirm password must equal password';
          setTimeout(() => (confirmPassError.innerText = ''), 3000);
        } else {
          let object = {
            password: `${encFunc(newPassword.value)}`,
            'confirm-password': `${encFunc(confirmNewPassword.value)}`,
          };
          fetch(`${usersApi}/${data[0].id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(object),
          });
        }
      }
    });
});
