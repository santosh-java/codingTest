import { Transaction, Balance } from '../model';

export class AccountDetails {
    accountToken:string;
    transactions: Transaction[];
    balance: Balance;
    
    constructor(accountToken: string, transactions: Transaction[], balance: Balance) {
        this.accountToken = accountToken;
        this.transactions = transactions;
        this.balance = balance;
    }
}