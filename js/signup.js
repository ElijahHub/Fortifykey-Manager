const form = document.getElementById('login-form');
const userError = document.querySelector('.user-error');
const form_btn = document.getElementById('form-btn');
const userApi = 'https://fortifykey-server.onrender.com/user';

const encFunc = (msg) => {
  let e = new Encrypt('F23-FK100', msg);
  return e.messageEncrypt();
};

class Signup {
  constructor(form, fields) {
    this.form = form;
    this.fields = fields;
    this.validateOnSubmit();
  }
  object = {};
  //Main form validation
  validateOnSubmit() {
    let self = this;

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      form_btn.setAttribute('disabled', 'true');

      let error = 0;

      self.fields.forEach((field) => {
        const input = document.getElementById(`${field}`);
        if (self.validaterFields(input) == false) {
          error++;
        }
        if (error == 0) {
          if (field == 'password' || field == 'confirm-password') {
            this.object[field] = encFunc(
              document.getElementById(`${field}`).value
            );
          } else {
            this.object[field] = document.getElementById(`${field}`).value;
          }
        }
      });

      if (error == 0) {
        fetch(`${userApi}?username=${this.object.username}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.length !== 0) {
              userError.innerText = 'User name already exist';
              setTimeout(() => (userError.innerText = ''), 3000);
            } else {
              fetch(`${userApi}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.object),
              })
                .then((res) => res.json())
                .then((data) => {
                  if (data) {
                    sessionStorage.setItem('logger', this.object.username);
                    this.form.submit();
                  }
                })
                .catch((err) => console.log(err));
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
      return this.passValiator(field);
    }
  }

  passValiator(field) {
    if (field.id == 'password') {
      if (field.value.length < 8) {
        this.setStatus(
          field,
          `${field.previousElementSibling.innerText} must be at least 8 characters`,
          'error'
        );
        return false;
      } else if (this.findTrue(field) == false) {
        this.setStatus(
          field,
          `${field.previousElementSibling.innerText} must include at least an uppercase letter, a lowercase letter, a number and a symbol.`,
          'error'
        );
        return false;
      }
    } else if (field.id == 'username') {
      const symbol = /[^a-zA-Z0-9]/g;
      if (symbol.test(field.value.slice(0))) {
        this.setStatus(
          field,
          `${field.previousElementSibling.innerText} can not start with a symbol`,
          'error'
        );
        return false;
      }
    } else if (field.id == 'confirm-password') {
      const pass = document.getElementById('password');
      if (field.value !== pass.value) {
        this.setStatus(
          field,
          `${field.previousElementSibling.innerText} must match ${pass.previousElementSibling.innerText}`,
          'error'
        );
        return false;
      }
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

  findTrue(field) {
    let compareNum = /[0-9]+/g;
    let compareLower = /[a-z]+/g;
    let compareUpper = /[A-Z]+/g;
    let compareSyb = /[^0-9a-zA-Z]+/g;
    let trues =
      compareNum.test(field.value) &&
      compareLower.test(field.value) &&
      compareUpper.test(field.value) &&
      compareSyb.test(field.value);

    return trues;
  }
}

if (form) {
  const fields = ['username', 'email', 'password', 'confirm-password'];
  const validator = new Signup(form, fields);
}
