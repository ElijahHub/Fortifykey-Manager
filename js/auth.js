const usersApi = 'https://fortifykey-server.onrender.com/user';

class Auth {
  constructor() {
    document.querySelector('body').style.display = 'none';
    const auth = sessionStorage.getItem('logger');
    this.validateAuth(auth);
  }

  validateAuth(auth) {
    if (!auth) {
      window.location.replace('../html/log.html');
    } else {
      const user = Object.values(auth).join('');
      fetch(`${usersApi}?username=${user}`)
        .then((res) => res.json())
        .then((data) => {
          if (auth !== `${data[0].username}`) {
            window.location.replace('../html/log.html');
          } else {
            document.querySelector('body').style.display = 'block';
          }
        });
    }
  }

  logOut() {
    sessionStorage.clear('logger');
    window.location.replace('../html/log.html');
  }
}

const auth = new Auth();

document.querySelector('.logout').addEventListener('click', (e) => {
  auth.logOut();
});
