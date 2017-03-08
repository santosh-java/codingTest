import { AccountDetails, Transaction, Balance, AuthorizationDetails } from '../model';

export class AccountDetailsFactory {
    public static createAccountDetails (authDetails: AuthorizationDetails, balance: Balance, transactions: Transaction[]) : AccountDetails {
        return new AccountDetails(authDetails.getToken(), transactions, balance);
    }
}