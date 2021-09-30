function calculateSum(num1: number, num2: number): number {
  return num1 + num2;
}
let sum: number;
let username: string;
calculateSum(2, 5);
console.log(calculateSum(2, 5));

function mashName(name1: string, name2: string): string {
  return name1 + " " + name2;
}

console.log(mashName("Lars", "Svensson"));

let hatArr = ["keps", "hatt", "mössa"];

class Car {
  private brand: string;
  private model: string;
  private horsePower: number;

  constructor(brand: string, model: string, horsePower: number) {
    this.brand = brand;
    this.model = model;
    this.horsePower = horsePower;
  }

  public getCar() {
    return this.brand + " " + this.model + " Hästkrafter = " + this.horsePower;
  }
}

let car1 = new Car("Volvo", "V60 Cross Country", 190);
let car2 = new Car("Audi", "A4 cross country", 180);

console.log(car1.getCar());
console.log(car2.getCar());

interface IsPerson {
  name: string;
  age: number;
  speak(a: string): void;
  spend(a: number): number;
}
