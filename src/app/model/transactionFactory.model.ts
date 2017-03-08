import { Transaction } from '../model';

export class TransactionFactory {
    public static createTransaction(data: any):Transaction {
        let transaction: Transaction = new Transaction(data.id, data.date, data.description, data.amount, data.currency);
        return transaction;
    }
}