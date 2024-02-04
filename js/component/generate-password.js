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
