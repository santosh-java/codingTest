import { Balance } from '../model';

export class BalanceFactory {
    public static createBalance(data: any) : Balance {
        let balance = new Balance(data.balance, data.currency);
        return balance;
    }
}