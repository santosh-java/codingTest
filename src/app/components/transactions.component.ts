import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AccountDetails, Transaction } from '../model';
import { AccountDetailsService } from '../services';

@Component({
    moduleId: module.id,
    selector: 'transactions',
    templateUrl: '../htmls/transactions.component.html',
    styleUrls: ['../styles/transactions.component.css']
})
export class TransactionsComponent implements OnInit, OnDestroy{
    trans: Transaction[];
    private accountDetailsService: AccountDetailsService;
    private accountDetails: AccountDetails;
    private authToken: string;

    private transSubscription: Subscription;
    private accDetailsSubscription: Subscription;

    constructor(accountDetailsService: AccountDetailsService, private cdRef: ChangeDetectorRef) {
        this.accountDetailsService = accountDetailsService;
        this.accountDetails = this.accountDetailsService.accountDetails;
        this.authToken = this.accountDetailsService.accountDetails.accountToken;
        this.trans = this.accountDetailsService.accountDetails.transactions;
        this.fetchLatestTransactionsData();
    }

    ngOnInit() {
        this.accDetailsSubscription = this.accountDetailsService.getAccountDetails().subscribe(
            (accDetails: AccountDetails)=>{
                this.accountDetails = accDetails;
                this.authToken = accDetails.accountToken;
                this.trans = accDetails.transactions;
            }
        );
    }

    public fetchLatestTransactionsData(): void {
        this.transSubscription = this.accountDetailsService
            .transactions(this.authToken)
            .subscribe(
                (trans: Transaction[]) => { 
                    console.log('Succefully fetched transactions: NextObserver');
                    this.updateTransactions(trans);
                },
                (error: any) => { console.log('Error in transactions component while fetching transactions'); },
                () => {
                        console.log('Successfully fetched transactions: CompletionObserver');
                        this.accountDetails.transactions = this.trans;
                        this.accountDetailsService.setAccountDetails(this.accountDetails);
                    }
            );           
    }

    public updateTransactions(trans: Transaction[]) {
        this.trans = trans;
    }

    ngOnDestroy() {
        this.transSubscription.unsubscribe();
        this.accDetailsSubscription.unsubscribe();
    }
}
