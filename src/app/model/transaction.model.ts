export class Transaction {
    private id: string;
    private date: Date;
    private description: string;
    private amount: number;
    private currency: string;

    constructor(id:string, date: Date, description: string, amount: number, currency: string) {
        this.id = id;
        this.date = date;
        this.description = description;
        this.amount = amount;
        this.currency = currency;
    }

    public getDate() : Date {
        return this.date;
    }

    public setDate(date:Date):void {
        this.date = date;
    }

    public getDescription() : string {
        return this.description;
    }

    public setDescription(desc: string) : void {
        this.description = desc;
    }

    public getAmount() : number {
        return this.amount;
    }

    public setAmount(amount: number) {
        this.amount = amount;
    }

    public getCurrency() : string {
        return this.currency;
    }

    public setCurrency(currency: string) : void {
        this.currency = currency;
    }

    toJSON() : TransactionJSON {
        return Object.assign({}, this, {id: this.id, date: this.date.toString(), description: this.description, amount: this.amount, currency: this.currency});
    }

    static fromJSON(json: TransactionJSON|string): Transaction {
        if(typeof json === 'string'){
            return JSON.parse(json, Transaction.reviver);
        } else {
            let transaction = Object.create(Transaction.prototype);
            return Object.assign(transaction, json, {
                date: new Date(json.date)
            });
        }
    }

    static reviver(key: string, value: any) : any {
        return key==="" ? Transaction.fromJSON(value) : value;
    }
}

export interface TransactionJSON {
    id: string;
    date: string;
    description: string;
    amount: number;
    currency: string;
}