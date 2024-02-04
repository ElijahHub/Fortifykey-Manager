//* Dashboard nav elemeent variables
const close = document.getElementById('close');
const container = document.querySelector('.container');
const logo = document.getElementById('logo-container');
const sidebar = document.getElementById('sidebar');
const links = document.querySelectorAll('.dashboard-links');
const menu = document.getElementById('menu');
const text = document.querySelector('.text-content');
// *Dashboard links
const accountLink = document.getElementById('account-link');
const dashboardLink = document.getElementById('dashboard-link');
const generatePasswordLink = document.getElementById('generate-password-link');
const helpLink = document.getElementById('help-link');
const keyManagerLink = document.getElementById('key-manager-link');
const passwordSaveLink = document.getElementById('password-save-link');
const settingLink = document.getElementById('setting-link');
//* Main component
const account = document.getElementById('account');
const dashboard = document.getElementById('dashboard');
const generatePassword = document.getElementById('generate-password');
const help = document.getElementById('help');
const keyManager = document.getElementById('key-manager');
const passwordSave = document.getElementById('password-save');
const setting = document.getElementById('setting');
const username = sessionStorage.getItem('logger');
const notifyBell = document.getElementById('notify-bell');
//*Api
const userApi = 'https://fortifykey-server.onrender.com/user';
const passwordApi = 'https://fortifykey-server.onrender.com/passwords';
const keysApi = 'https://fortifykey-server.onrender.com/keys';

// Functions
//*toogle menu functions
const toogleMenu = () => {
  logo.classList.toggle('invisible');
  sidebar.classList.toggle('hidden');
  container.classList.toggle('container-grid-2');
  container.classList.toggle('container-grid-1');
};
//* Dashboard addhidden function
const addHidden = () => {
  document
    .querySelectorAll('.main-element')
    .forEach((e) => e.classList.add('hidden'));
};
//* Dashboard display function
const display = (link, element) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    addHidden();
    element.classList.remove('hidden');
    if (link == notifyBell) {
      text.textContent = 'Dashboard';
    } else {
      text.textContent = link.innerText;
    }
  });
};

//* fetch Function
const fetchElement = async (element, container) => {
  const res = await fetch(`${element}`);
  const data = await res.text();
  container.innerHTML = data;
};

if (window.screen.width <= 1024) {
  links.forEach((link) => {
    link.addEventListener('click', () => {
      toogleMenu();
    });
  });
}

menu.addEventListener('click', () => {
  toogleMenu();
});

close.addEventListener('click', () => {
  toogleMenu();
});

//* Dashboards links navigations
const link = () => {
  display(accountLink, account);
  display(dashboardLink, dashboard);
  display(notifyBell, dashboard);
  display(generatePasswordLink, generatePassword);
  display(helpLink, help);
  display(keyManagerLink, keyManager);
  display(passwordSaveLink, passwordSave);
  display(settingLink, setting);
};
link();

//* Main Element
fetchElement('../html/component/help.html', help);

//* Class function
const generate = new Gene();

//? Encryption and Decrpytion functions
const encFunc = (key, msg) => {
  let e = new Encrypt(key, msg);
  return e.messageEncrypt();
};
const dencFunc = (key, msg) => {
  let e = new Encrypt(key, msg);
  return e.messageDecrypt();
};

//* Dashboard function
const dashboardFunc = async () => {
  //?Awaiting dashboard to data to be fetch before varaible declaration
  await fetchElement('../html/component/dashboard.html', dashboard);

  //? Variables unique to dashboard
  const savedValue = document.getElementById('saved-value');
  const generatedValue = document.getElementById('generate-value');
  const strongValue = document.getElementById('strong-value');
  const weakValue = document.getElementById('weak-value');
  const notify = document.getElementById('notify-set');
  const notifyCount = document.getElementById('notify-count');

  //?Fetching data from server to initialize dashboard datas
  fetch(`${passwordApi}?useridentity=${username}`)
    .then((res) => res.json())
    .then((data) => {
      let weak = 0;
      let strong = 0;
      let gen = data.filter((d) => d.type === 'generated');
      let count = 0;
      savedValue.innerText = data.length;
      notifyCount.classList.add('hidden');

      //? Calcultaing the strength of passwords
      data.forEach((d) => {
        const len = d.password.length;
        len > 8 ? strong++ : weak++;

        //? Notifiction maeesage if password is weak
        if (d.password.length <= 8) {
          notifyCount.classList.remove('hidden');
          notify.innerHTML += `
        <li>
         <i class="bi bi-exclamation-triangle"></i>
         <p>Password with title ${d.title} is weak.</p>
        </li>
        `;
          count++;
          notifyCount.innerText = count;
        }
      });

      //? Setting Values to Dom
      strongValue.innerText = strong;
      weakValue.innerText = weak;
      generatedValue.innerText = gen.length;

      //* Chart function
      var options = {
        series: [strong, weak],
        colors: ['rgb(16, 147, 16)', 'rgb(236, 167, 38)'],
        chart: {
          width: 600,
          type: 'donut',
          fill: {
            colors: ['#F44336', '#E91E63'],
          },
          dropShadow: {
            enabled: false,
          },
        },
        stroke: {
          width: 0,
        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                total: {
                  showAlways: true,
                  show: true,
                },
              },
            },
          },
        },

        labels: ['Strong', 'Weak'],
        dataLabels: {
          style: {
            colors: ['#fff', '#fff'],
          },
        },
        states: {
          hover: {
            filter: 'none',
          },
        },
        theme: {
          palette: 'palette',
        },
        title: {
          text: 'Password Strength',
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: '100%',
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
      };

      var chart = new ApexCharts(document.querySelector('.chart'), options);
      chart.render();
    })
    .catch((err) => console.log(err));
};
dashboardFunc();

//* Generate password function
const generatePass = async () => {
  //? Awaiting data to be fetch before variable declaration
  await fetchElement(
    '../html/component/generate-password.html',
    generatePassword
  );

  //?Varaiables
  //?Password generator form variables
  const screen = document.getElementById('screen');
  const len = document.getElementById('length');
  const lowerCase = document.getElementById('lowercase');
  const upperCase = document.getElementById('uppercase');
  const number = document.getElementById('number');
  const symbol = document.getElementById('symbol');
  const btn = document.querySelector('.btn-gen');
  const copyPassword = document.getElementById('copyPassword');
  const copySuccess = document.querySelector('.copy-success');
  const passStrength = document.querySelector('.strength');

  //? Save Form Variables
  const overlay = document.querySelector('.overlay-gen');
  const saveForm = document.querySelector('.save-gen');
  const closeSave = document.querySelector('.close-gen');
  const generror = document.querySelector('.generate-error');
  const saveBtn = document.querySelector('.btn-save');
  const genPassword = document.getElementById('generated-password');
  const regenerateBtn = document.getElementById('regenerate-btn');
  const title = document.getElementById('title');
  const titleError = document.querySelector('.title-error');
  const buttonSavePass = document.getElementById('save-btn');

  //? Encryption key variables
  const key = document.getElementById('encrypt-key');
  const keyBtn = document.getElementById('key-btn');
  const keyError = document.querySelector('.key-error');

  //?User generated password object
  let pObject = {
    useridentity: username,
  };

  //? Generating passwor on button click
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

    //? Checking password genrated stregnth
    let lenCharacter = screen.value.length;
    let lenValue =
      lenCharacter > 14
        ? 59
        : lenCharacter < 8 && lenCharacter > 4
        ? 29
        : lenCharacter < 5
        ? 17
        : 48;
    let charcters = generate.findTrue(screen.value);
    let strength = lenValue + charcters;
    let strengthColor =
      strength > 70
        ? 'rgb(16, 147, 16)'
        : strength > 40
        ? 'rgb(254, 170, 14)'
        : 'rgb(254, 9, 9)';

    //? password stregnth meter
    passStrength.style.width = `${strength}%`;
    passStrength.style.backgroundColor = strengthColor;
  });

  //? Copying passwored to clip board
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

  //? Generator save button event
  saveBtn.addEventListener('click', () => {
    if (screen.value == '') {
      generror.classList.remove('hidden');
      setTimeout(() => generror.classList.add('hidden'), 3000);
    } else {
      overlay.classList.toggle('hidden');
      saveForm.classList.toggle('hidden');
      genPassword.value = screen.value;
      keyBtn.removeAttribute('disabled');
    }
  });

  //? Closing password save rquest
  closeSave.addEventListener('click', () => {
    overlay.classList.toggle('hidden');
    saveForm.classList.toggle('hidden');
  });

  //? Password regeneration reques
  regenerateBtn.addEventListener('click', () => {
    overlay.classList.toggle('hidden');
    saveForm.classList.toggle('hidden');
  });

  //? Checking if user have generated key & key authentication
  keyBtn.addEventListener('click', () => {
    fetch(`${keysApi}?identity=${username}`)
      .then((res) => {
        if (!res) {
          throw new Error('No internet Access');
        }
        return res.json();
      })
      .then((data) => {
        if (data.length === 0 || key.value === '') {
          keyError.innerText = 'Key have not been generated';
          setTimeout(() => (keyError.innerText = ''), 3000);
        } else {
          if (
            key.value !== dencFunc('F30-FK110', data[0].key) &&
            key.value !== dencFunc('F30-FK110', data[1].key)
          ) {
            keyError.innerText = 'Invalid key';
            setTimeout(() => (keyError.innerText = ''), 3000);
          } else {
            title.value = title.value;
            genPassword.value = encFunc(key.value, genPassword.value);
            pObject['decrypted'] = true;
            keyBtn.setAttribute('disabled', '');
          }
        }
      });
  });

  //? Storing genrated passwor to server
  buttonSavePass.addEventListener('submit', (e) => {
    e.preventDefault();
    if (title.value === '') {
      titleError.innerText = 'title cannot be blank';
      setTimeout(() => (titleError.innerText = ''), 3000);
    } else {
      pObject['title'] = title.value;
      pObject['password'] = genPassword.value;
      pObject['type'] = 'generated';
      fetch(`${passwordApi}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pObject),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then((data) => {
          if (data) {
            buttonSavePass.submit();
          }
        });
      overlay.classList.add('hidden');
      saveForm.classList.add('hidden');
    }
  });
};
generatePass();

//*Password save
const saveBox = async () => {
  //? Awaiting fetch data
  await fetchElement('../html/component/password-save.html', passwordSave);

  //? Add Password form variable
  const addBtn = document.getElementById('add-btn');
  const overlay = document.querySelector('.overlay-box');
  const saveForm = document.querySelector('.box-form');
  const closeSave = document.querySelector('.close-box');
  const closeShow = document.querySelector('.close-show');
  const saveBtn = document.querySelector('.save-box');
  const title = document.getElementById('title-save');
  const passwordSaved = document.getElementById('password-saved');
  const titleError = document.querySelector('.save-error-title');
  const passError = document.querySelector('.save-error-pass');
  const keyError = document.querySelectorAll('.key-error-save');
  //? Encryption key var
  const key = document.getElementById('encrypt-key-save');
  const keyBtn = document.getElementById('key-btn-save');

  //? Table variable
  const tableBody = document.querySelector('.table-body');
  const cpFormShow = document.querySelector('#view-btn');
  const cpFormInput = document.querySelector('#delete-pass');

  //? Show password variables
  const showForm = document.querySelector('.show-box');
  const showTitle = document.getElementById('title-show');
  const showPassword = document.getElementById('password-show');
  const cpErrorShow = document.querySelector('.cp-error-show');
  const cpCancelShow = document.querySelector('.cancel-form-show');
  const cpBox = document.querySelector('.confirm-password');
  const cpBoxShow = document.querySelector('.confirm-password-show');
  const decryptBox = document.getElementById('decrypt-box');
  //? Decryption key var
  const keyBtnDecrypt = document.getElementById('key-btn-show');
  const key2 = document.getElementById('decrypt-key-show');

  //? Delete password var
  const warnBox = document.querySelector('.warning');
  const warnBoxCancel = document.getElementById('warning-cancel');
  const warnBoxOkay = document.getElementById('warning-okay');
  const cpCancel = document.querySelector('.cancel-form');
  const cpError = document.querySelector('.cp-error');
  const cpFormInputShow = document.querySelector('#delete-pass-show');
  const cpForm = document.querySelector('.confirm-pass-form');

  //? User password object
  let pObject = {
    useridentity: username,
  };

  //?Fetching keys elements
  const keyUser = async () => {
    const res = await fetch(`${keysApi}?identity=${username}`);
    if (!res) {
      throw new Error('Network is not ok');
    }
    const data = await res.json();
    return data;
  };

  //? Fetching user elements
  const userData = async () => {
    const res = await fetch(`${userApi}?username=${username}`);
    if (!res) {
      throw new Error('Network is not ok');
    }
    const data = await res.json();
    return data;
  };

  //? Add password button event
  addBtn.addEventListener('click', () => {
    overlay.classList.remove('hidden');
    saveForm.classList.remove('hidden');
    keyBtn.removeAttribute('disabled');
  });

  //? Add Encryption key Authentication
  keyBtn.addEventListener('click', async () => {
    let data = await keyUser();
    if (data.length === 0 || key.value === '') {
      keyError.forEach((err) => {
        err.innerText = 'Key have not been generated';
        setTimeout(() => (err.innerText = ''), 3000);
      });
    } else {
      if (
        key.value !== dencFunc('F30-FK110', data[0].key) &&
        key.value !== dencFunc('F30-FK110', data[1].key)
      ) {
        keyError.forEach((err) => {
          err.innerText = 'Invalid key';
          setTimeout(() => (err.innerText = ''), 3000);
        });
      } else {
        title.value = title.value;
        passwordSaved.value = encFunc(key.value, passwordSaved.value);
        pObject['decrypted'] = true;
        keyBtn.setAttribute('disabled', '');
      }
    }
  });

  //? Add password valiation and submittion
  saveBtn.addEventListener('submit', (e) => {
    e.preventDefault();
    if (title.value === '' || passwordSaved.value === '') {
      title.value === ''
        ? (titleError.innerText = 'Please enter a title')
        : (titleError.innerText = '');
      passwordSaved.value === ''
        ? (passError.innerText = 'Please enter a password')
        : (passError.innerText = '');
      setTimeout(() => {
        titleError.innerText = '';
        passError.innerText = '';
      }, 3000);
    } else {
      pObject['title'] = title.value;
      pObject['password'] = passwordSaved.value;
      pObject['type'] = 'inputed';

      fetch(`${passwordApi}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pObject),
      })
        .then((res) => {
          if (!res) {
            throw new Error('Network not ok');
          }
          return res.json();
        })
        .then((data) => {
          if (data) {
            saveBtn.submit();
            overlay.classList.add('hidden');
            saveForm.classList.add('hidden');
          }
        });
    }
  });

  //? Close add password form
  closeSave.addEventListener('click', () => {
    overlay.classList.add('hidden');
    saveForm.classList.add('hidden');
  });

  //? Initializing Save password Dom
  fetch(`${passwordApi}?useridentity=${username}`)
    .then((res) => res.json())
    .then((data) => {
      let i = 0;
      while (i < data.length) {
        tableBody.innerHTML += `
         <tr>
           <td class='table-id'>${i + 1}</td>
           <td>${data[i].title}</td>
           <td>***********</td>
           <td><i class="bi bi-trash-fill table-delete"></i> <button class="table-btn">veiw</button> </td>
         </tr>
        `;
        i++;
      }
    });

  //! Setting a delay to await password fetching from server beefor declaring variables

  setTimeout(() => {
    const tableBtn = document.querySelectorAll('.table-btn');
    const tableId = document.querySelectorAll('.table-id');
    const tableDelete = document.querySelectorAll('.table-delete');
    const rows = tableBody.getElementsByTagName('tr');
    const searchInput = document.getElementById('searchInput');

    //? Password search filter
    searchInput.addEventListener('input', () => {
      const searchTerms = searchInput.value.toLowerCase();
      for (let i = 0; i < rows.length; i++) {
        const cellText = rows[i]
          .getElementsByTagName('td')[1]
          .textContent.toLowerCase();

        if (cellText.includes(searchTerms)) {
          rows[i].style.display = 'table-row';
        } else {
          rows[i].style.display = 'none';
        }
      }
    });

    //? Geting the index of each view btn and storing the value to view
    let view = 0;
    tableBtn.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        overlay.classList.remove('hidden');
        cpBoxShow.classList.remove('hidden');
        view = i;
      });
    });

    //? Show Saved Password Event
    cpFormShow.addEventListener('click', async (e) => {
      e.preventDefault();
      let data = await userData();
      if (cpFormInputShow.value !== dencFunc('F23-FK100', data[0].password)) {
        cpErrorShow.innerText = 'Incorrect password';
        setTimeout(() => (cpErrorShow.innerText = ''), 3000);
      } else {
        cpBoxShow.classList.add('hidden');
        showForm.classList.remove('hidden');
        fetch(`${passwordApi}/${tableId[view].innerText}`)
          .then((res) => res.json())
          .then((data) => {
            showTitle.value = data.title;
            showPassword.value = data.password;
            if (data.decrypted) {
              decryptBox.children[0].classList.remove('hidden');
              decryptBox.children[1].classList.remove('hidden');
            } else {
              decryptBox.children[0].classList.add('hidden');
              decryptBox.children[1].classList.add('hidden');
            }
          });
        cpFormInputShow.value = '';
      }
    });

    //? Getting the index of crrent table row to delete and storing it to current
    let current = 0;
    tableDelete.forEach((del, i) => {
      del.addEventListener('click', () => {
        warnBox.classList.remove('hidden');
        overlay.classList.remove('hidden');
        keyBtnDecrypt.removeAttribute('disabled');
        current = i;
      });
    });

    //? Delete Request
    cpForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      let data = await userData();
      if (cpFormInput.value !== dencFunc('F23-FK100', data[0].password)) {
        cpError.innerText = 'Incorrect password';
        setTimeout(() => (cpError.innerText = ''), 3000);
      } else {
        fetch(`${passwordApi}/${tableId[current].innerText}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((res) => {
            if (!res) {
              throw new Error('Network not ok');
            }
            return res.json();
          })
          .then((data) => {
            cpFormInput.value = '';
            cpBox.classList.add('hidden');
            overlay.classList.add('hidden');
            cpForm.submit();
          });
      }
    });
  }, 3000);

  //? Decrption key authentication and validation
  keyBtnDecrypt.addEventListener('click', async () => {
    let data = await keyUser();
    if (data.length === 0 || key2.value === '') {
      keyError.forEach((err) => {
        err.innerText = 'Key have not be geneated';
        setTimeout(() => (err.innerText = ''), 3000);
      });
    } else {
      if (
        key2.value !== dencFunc('F30-FK110', data[0].key) &&
        key2.value !== dencFunc('F30-FK110', data[1].key)
      ) {
        keyError.forEach((err) => {
          err.innerText = 'Invalid key';
          setTimeout(() => (err.innerText = ''), 3000);
        });
      } else {
        showPassword.value = dencFunc(key2.value, showPassword.value);
        keyBtnDecrypt.setAttribute('disabled', '');
      }
    }
  });

  //? Close password view
  closeShow.addEventListener('click', () => {
    overlay.classList.add('hidden');
    showForm.classList.add('hidden');
  });

  //? Deletion warning message utton events
  warnBoxCancel.addEventListener('click', () => {
    warnBox.classList.add('hidden');
    overlay.classList.add('hidden');
  });

  warnBoxOkay.addEventListener('click', () => {
    cpBox.classList.remove('hidden');
    warnBox.classList.add('hidden');
  });

  cpCancel.addEventListener('click', () => {
    cpBox.classList.add('hidden');
    overlay.classList.add('hidden');
  });
  cpCancelShow.addEventListener('click', () => {
    cpBoxShow.classList.add('hidden');
    overlay.classList.add('hidden');
  });
};
saveBox();

//* Key Managerr Function
const keyManagerFunc = async () => {
  //?Awaiting data
  await fetchElement('../html/component/key-manager.html', keyManager);

  //?Varaibles declaration
  const keyUser = document.getElementById('key-user');
  const keyBtn = document.querySelector('.keyBtn');
  const keyContainer = document.getElementById('generate-key-container');
  const keyGenerator = document.querySelector('.key');
  const keyPass = document.getElementById('key-pass');
  const keyError = document.querySelector('.key-error');
  const keyCancel = document.getElementById('key-cancel');
  const keyGenerate = document.getElementById('key-generate');
  const keyGeneratorMain = document.querySelector('.key-main');
  const keyPassMain = document.getElementById('key-pass-main');
  const keyErrorMain = document.querySelector('.key-error-main');
  const keyCancelMain = document.getElementById('key-cancel-main');
  const keyGenerateMain = document.getElementById('key-generate-main');
  const showKey = document.querySelector('.show-key');
  const displayKey = document.querySelector('.key-display');
  const cancelKey = document.querySelector('.unshow-key');
  const showKeyMain = document.querySelector('.show-key-main');
  const displayKeyMain = document.querySelector('.key-display-main');
  const cancelKeyMain = document.querySelector('.unshow-key-main');
  const overlay = document.querySelector('.overlay-key');
  const genKeyError = document.querySelector('.genkey-error');

  //? User name
  keyUser.innerHTML = username;

  //? Key Generation function
  const generateKey = (name) => {
    const num = Math.round(Math.random() * 40) + 10;
    const num2 = Math.round(Math.random() * 100) + 10;
    const key = `F${num}-${name.slice(0, 2).toUpperCase()}${
      num2 < 100 ? `0${num2}` : num2
    }`;
    return key;
  };

  //?Fetching keys elements
  const userKeyData = async () => {
    const res = await fetch(`${keysApi}?identity=${username}`);
    if (!res) {
      throw new Error('Network is not ok');
    }
    const data = await res.json();
    return data;
  };

  //? Key manager dom initialization
  const keysDisplay = async () => {
    let data = await userKeyData();
    let i = 0;
    while (i < data.length) {
      keyContainer.innerHTML += `
      <li>
       <i class="bi bi-key"></i>
       <p>**********</p>
       <button type="button" class="key-view">view</button>
      </li>
        `;
      i++;
    }
  };
  keysDisplay();

  //? Key Geneation Event
  keyBtn.addEventListener('click', async () => {
    let data = await userKeyData();
    if (data.length >= 2) {
      genKeyError.innerText = 'maximum number of key generated';
      setTimeout(() => (genKeyError.innerText = ''), 3000);
    } else {
      overlay.classList.remove('hidden');
      keyGenerator.classList.remove('hidden');
    }
  });

  //? Cancel key Generation Button Event
  keyCancel.addEventListener('click', () => {
    overlay.classList.add('hidden');
    keyGenerator.classList.add('hidden');
  });

  //? User password validation and key generation
  keyGenerate.addEventListener('click', (e) => {
    fetch(`${userApi}?username=${username}`)
      .then((res) => res.json())
      .then((data) => {
        if (keyPass.value !== dencFunc('F23-FK100', data[0].password)) {
          keyError.innerText = 'Incorrect password';
          setTimeout(() => (keyError.innerText = ''), 3000);
        } else {
          showKey.classList.remove('hidden');
          displayKey.innerHTML = generateKey(username);
          keyPass.value = '';
          keyGenerator.classList.add('hidden');
        }
      });
  });

  //? Storing generated key
  cancelKey.addEventListener('click', (e) => {
    e.preventDefault();
    fetch(`${keysApi}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identity: `${username}`,
        key: `${encFunc('F30-FK110', displayKey.innerHTML)}`,
      }),
    })
      .then((res) => {
        if (!res) {
          throw new Error('Network is not ok');
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          overlay.classList.add('hidden');
          showKey.classList.add('hidden');
          keysDisplay();
        }
      });
  });

  //? Close view key request event
  keyCancelMain.addEventListener('click', () => {
    overlay.classList.add('hidden');
    keyGeneratorMain.classList.add('hidden');
  });

  cancelKeyMain.addEventListener('click', () => {
    overlay.classList.add('hidden');
    showKeyMain.classList.add('hidden');
  });

  //! Setting time delay to awiat keys to be printe to the dom before variable declarations
  setTimeout(() => {
    const keyView = document.querySelectorAll('.key-view');

    //?Getting the index of clicked veiw btn and storing to index
    let index = 0;
    keyView.forEach((key, i) => {
      key.addEventListener('click', () => {
        overlay.classList.remove('hidden');
        keyGeneratorMain.classList.remove('hidden');
        index = i;
      });
    });

    //?Fetching key for display
    keyGenerateMain.addEventListener('click', (e) => {
      e.preventDefault();
      fetch(`${userApi}?username=${username}`)
        .then((res) => res.json())
        .then((data) => {
          if (keyPassMain.value !== dencFunc('F23-FK100', data[0].password)) {
            keyErrorMain.innerText = 'Incorrect password';
            setTimeout(() => (keyErrorMain.innerText = ''), 3000);
          } else {
            fetch(`${keysApi}?identity=${username}`)
              .then((res) => res.json())
              .then((dat) => {
                showKeyMain.classList.remove('hidden');
                keyGeneratorMain.classList.add('hidden');
                displayKeyMain.innerHTML = dencFunc(
                  'F30-FK110',
                  dat[index].key
                );
                keyPassMain.value = '';
              });
          }
        });
    });
  }, 3000);
};
keyManagerFunc();

//*Account
const accountFunc = async () => {
  await fetchElement('../html/component/account.html', account);

  //? Varaibles
  const userName = document.querySelector('.account-user-name');
  const savedPass = document.querySelector('.account-saved-password');
  const generatedPass = document.querySelector('.account-generated-password');
  const weakPass = document.querySelector('.account-weak-password');
  const strongPass = document.querySelector('.account-strong-password');
  const safety = document.querySelector('.account-safety');

  userName.innerHTML = `${username}`;

  //?Fetching user passsword data
  fetch(`${passwordApi}?useridentity=${username}`)
    .then((res) => res.json())
    .then((data) => {
      savedPass.innerText = data.length;
      let weak = 0;
      let strong = 0;
      let gen = data.filter((d) => d.type === 'generated');

      data.forEach((d) => {
        const len = d.password.length;
        len > 8 ? strong++ : weak++;
      });

      strongPass.innerText = strong;
      weakPass.innerText = weak;
      generatedPass.innerText = gen.length;

      let total = `${(strong / data?.length || 0) * 100}`.slice(0, 5);
      safety.innerText = total + '%';
    });
};
accountFunc();

//*Setting
const settingFunc = async () => {
  await fetchElement('../html/component/setting.html', setting);

  //? Setting variables
  const user = document.querySelector('.setting-username');
  const userEmail = document.querySelector('.setting-email');
  const btn = document.getElementById('btn-change');
  const overlay = document.querySelector('.overlay-setting');

  //? Change password variables
  const changePasswordBox = document.querySelector('.change-password');
  const oldPassword = document.getElementById('old-password');
  const newPassword = document.getElementById('new-password');
  const confirmNewPassword = document.getElementById('confirm-new-password');
  const changeCancel = document.querySelector('.change-cancel');
  const changeBtn = document.querySelector('.change-btn');
  const oldPassError = document.querySelector('.oldpass-error');
  const newPassError = document.querySelector('.newpass-error');
  const confirmPassError = document.querySelector('.confirmpass-error');

  //? delete account varaibles
  const deleteAccBtn = document.getElementById('delete-account');
  const deleteAccWarning = document.querySelector('.delete-account-warning');
  const deleteAccAproveBtn = document.getElementById('delete-warning-okay');
  const deletAccCancelBtn = document.getElementById('delete-warning-cancel');
  const deleteAccConfirm = document.querySelector('.confirm-delete');
  const deleteAccConfirmForm = document.querySelector('.confirm-delete-form');
  const deleteAccConfirmCancel = document.querySelector('.cancel-delete-form');
  const passwordConfirm = document.getElementById('delete-account-pass');
  const passwordConfirmError = document.querySelector('.delete-account-error');

  //? Fetching user elements
  const userData = async () => {
    const res = await fetch(`${userApi}?username=${username}`);
    if (!res) {
      throw new Error('Network is not ok');
    }
    const data = await res.json();
    return data;
  };

  let data = await userData();

  //? Function to check if a password contain required variable
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

  //? Setting user data to dom
  user.innerHTML = data[0].username;
  userEmail.innerHTML = data[0].email;

  //? Change password request function
  btn.addEventListener('click', () => {
    overlay.classList.remove('hidden');
    changePasswordBox.classList.remove('hidden');
  });

  //? Cancel change password request
  changeCancel.addEventListener('click', () => {
    overlay.classList.add('hidden');
    changePasswordBox.classList.add('hidden');
  });

  //? Change password Event
  changeBtn.addEventListener('submit', (e) => {
    e.preventDefault();
    if (oldPassword.value !== dencFunc('F23-FK100', data[0].password)) {
      oldPassError.innerText = 'incorrect password';
      setTimeout(() => (oldPassError.innerText = ''), 3000);
    } else {
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
            password: `${encFunc('F23-FK100', newPassword.value)}`,
            'confirm-password': `${encFunc(
              'F23-FK100',
              confirmNewPassword.value
            )}`,
          };
          fetch(`${userApi}/${data[0].id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(object),
          })
            .then((res) => {
              if (!res) throw new Error('Network not okay');
              return res.json();
            })
            .then((data) => {
              if (data) {
                changeBtn.submit();
              }
            });
        }
      }
    }
  });

  //?Delete request warning message
  deleteAccBtn.addEventListener('click', () => {
    overlay.classList.remove('hidden');
    deleteAccWarning.classList.remove('hidden');
  });

  //?Cancel delete request
  deletAccCancelBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
    deleteAccWarning.classList.add('hidden');
  });

  //Delete request approval
  deleteAccAproveBtn.addEventListener('click', () => {
    deleteAccWarning.classList.add('hidden');
    deleteAccConfirm.classList.remove('hidden');
  });

  deleteAccConfirmCancel.addEventListener('click', () => {
    overlay.classList.add('hidden');
    deleteAccConfirm.classList.add('hidden');
  });

  //? Delete request Function
  const deleteFunc = async () => {
    await fetch(`${keysApi}?identity=${username}`)
      .then((res) => res.json())
      .then((data) => {
        data.forEach((el) => {
          fetch(`${keysApi}/${el.id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
        });
      });

    await fetch(`${passwordApi}?useridentity=${username}`)
      .then((res) => res.json())
      .then((data) => {
        data.forEach((pass) => {
          fetch(`${passwordApi}/${pass.id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
        });
      });

    await fetch(`${userApi}/${data[0].id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    sessionStorage.clear('logger');
    window.location.replace('../html/log.html');
  };

  //?Delete request Event
  deleteAccConfirmForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (passwordConfirm.value !== dencFunc('F23-FK100', data[0].password)) {
      passwordConfirmError.innerText = 'incorrect password';
      setTimeout(() => (passwordConfirmError.innerText = ''), 3000);
    } else {
      deleteFunc();
    }
  });
};
settingFunc();
