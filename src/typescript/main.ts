function calculateSum(num1: number, num2: number): number {
  return num1 + num2;
}
let sum: number;
let username: string;
calculateSum(2, 5);

let strArr: string[] = ["a", "c"];

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
    return this.brand + this.model + " Hästkrafter != " + this.horsePower;
  }
}

let car1 = new Car("Volvo ", "V60 Cross Country", 190);

console.log(car1.getCar());
