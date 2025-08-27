function algoritm(callback) {
    callback(3, 4);
}

function calculate(num1, num2) {
    num1 = num1 + num2;
    console.log("num=", num1);
}

algoritm(calculate);