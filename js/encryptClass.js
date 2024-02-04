class Encrypt {
  constructor(key, pass) {
    this.key = key;
    this.pass = pass;
  }

  messageEncrypt() {
    return this.encrypt(this.pass, this.key);
  }

  messageDecrypt() {
    return this.decrypt(this.pass, this.key);
  }

  encrypt(message, key) {
    const isSymbol = /[^A-Za-z0-9]/;
    const symbol = '!].,@#}$<%[^&*+>_-=:( {;?/\'")';
    const listLetters = [];
    this.generateCharacter(listLetters, symbol);
    const keyValue = this.getKeyValue(key);
    let newText = '';
    for (let letter of message) {
      if (!listLetters.includes(letter)) continue;
      const indexLetter = listLetters.findIndex((item) => item === letter);
      let indexNewLetter = indexLetter + keyValue;
      let changeIndex = indexLetter - 30;

      if (changeIndex < 0) changeIndex += 51;
      if (indexNewLetter > listLetters.length - 1)
        indexNewLetter -= listLetters.length;

      if (isSymbol.test(letter)) {
        newText += listLetters[changeIndex];
      }
      newText += listLetters[indexNewLetter];
    }
    return newText;
  }

  decrypt(message, key) {
    const symbol = '!].,@#}$<%[^&*+>_-=:( {;?/\'")';
    const listLetters = [];
    this.generateCharacter(listLetters, symbol);
    const keyValue = this.getKeyValue(key);
    let newText = '';
    for (let letter of message) {
      if (!listLetters.includes(letter)) continue;
      const indexLetter = listLetters.findIndex((item) => item === letter);
      let indexNewLetter = indexLetter - keyValue;

      if (indexNewLetter < 0) indexNewLetter += listLetters.length;
      newText += listLetters[indexNewLetter];
    }

    const decryptText = this.removeBUpper(newText.split('')).join('');
    return decryptText;
  }

  generateCharacter(listLetters, symbol) {
    for (let i = 0; i < 26; i++) {
      const listLetterUpper = String.fromCharCode(65 + i);
      listLetters.push(listLetterUpper);
    }
    for (let i = 0; i < 26; i++) {
      const listLetter = String.fromCharCode(97 + i);
      listLetters.push(listLetter);
    }
    for (let i = 0; i < symbol.length; i++) {
      listLetters.push(symbol[i]);
    }

    for (let i = 0; i < 10; i++) {
      const listLetterNum = String.fromCharCode(48 + i);
      listLetters.push(listLetterNum);
    }
  }

  getKeyValue(key) {
    let a = +key.slice(1, 3);
    let b = +key.slice(-3);

    return Math.floor((b / a / 2) * 10);
  }

  removeBUpper(arr) {
    const isSymbol = /[^a-zA-Z0-9]/;

    for (let i = 1; i < arr.length; i++) {
      if (isSymbol.test(arr[i])) {
        arr.splice(i - 1, 1);
      }
    }

    return arr;
  }
}
