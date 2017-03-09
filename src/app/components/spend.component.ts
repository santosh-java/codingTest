import { Component, OnDestroy, ViewChild } from '@angular/core';
import { AlertModule } from 'ng2-bootstrap' 
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
    alerts: any = [];
    balance: Number;
    @ViewChild('spendForm') spendForm;

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
        this.balance = this.accountDetails.balance.balance;
    }

    doSpend(){
        console.log('Spending started...');
        this.spendSubscription = this.accountDetailsService
            .spend(this.authToken, this.transaction)
            .subscribe(
                () => { this.submitted=true; },
                (error: any) => { 
                    console.log('Error occurred during spending. Details: ' + error); 
                    this.alerts.push({
                        type:'danger',
                        message: 'Failed to spend ' + this.transaction.getAmount() + ' on ' + this.transaction.getDescription() + ' due to ' + error,
                        timeout: 3000
                    });
                },
                () => {
                    console.log('Successfully submitted spending.');                    
                    this.alerts.push({
                        type:'success',
                        message: 'Successfully spent ' + this.transaction.getAmount() + ' on ' + this.transaction.getDescription(),
                        timeout: 3000
                    });
                    this.spendForm.reset();
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