import { Component, OnDestroy } from '@angular/core';
import { Subscription }   from 'rxjs/Subscription';

import { AccountDetails, Transaction, TransactionFactory, Balance, BalanceFactory } from '../model';
import { AccountDetailsService } from '../services'; 

@Component({
    moduleId: module.id,
    selector: 'spend-form',
    templateUrl: '../htmls/spend-form.component.html',
    styleUrls: ['../styles/spend-form.component.css']
})
export class SpendComponent implements OnDestroy{
    transaction: Transaction = TransactionFactory.createTransaction({"id":"", "date":"", "description":"", "amount":"", "currency":""});
    submitted: boolean = false;

    private authToken: string;
    private currency: string;
    private accountDetails: AccountDetails;

    private spendSubscription: Subscription;
    private accDetailsSubscription: Subscription;

    constructor(private accountDetailsService: AccountDetailsService){
        console.log('AccountDetails Constructor');
        this.accountDetails = this.accountDetailsService.accountDetails;
        this.authToken = this.accountDetails.accountToken;
        this.currency = this.accountDetails.balance.currency;
        this.transaction.setCurrency(this.currency);
    }

    doSpend(){
        console.log('Spending started...');
        this.spendSubscription = this.accountDetailsService
            .spend(this.authToken, this.transaction)
            .subscribe(
                () => { this.submitted=true; },
                (error: any) => { console.log('Error in init of account details component while fetching balance'); },
                () => {
                    console.log('Successfully submitted spending.');
                    this.accountDetailsService.updateBalanceAndTransactions(this.authToken);
                }
            );
    }

    ngOnDestroy() {
        console.log('AccountDetails ngOnDestroy');
        this.spendSubscription.unsubscribe();
        this.accDetailsSubscription.unsubscribe();
    }

}