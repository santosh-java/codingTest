export class Balance {
    balance: Number;
    currency: string;

    constructor(balance: Number, currenct: string) {
        this.balance = balance;
        this.currency = currenct;
    }

    public getBalance(): Number {
        return this.balance;
    }

    public getCurrenct(): string {
        return this.currency;
    }
}