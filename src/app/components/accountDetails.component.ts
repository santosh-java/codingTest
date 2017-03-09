import {Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AccountDetails, AccountDetailsFactory, AuthorizationDetails, Transaction, Balance } from '../model';
import { AccountDetailsService } from '../services';

@Component({
    selector: 'account-details',
    templateUrl: '../htmls/accountDetails.component.html'
})
export class AccountDetailsComponent implements OnInit, OnDestroy{
  accountDetails: AccountDetails;
  initialLoadComplete: boolean = false;
  private authDetails: AuthorizationDetails;
  private transactions: Transaction[];
  private balance: Balance;
  private accountDetailsService: AccountDetailsService;
  private tabs: any[];
  private loginSubscription: Subscription;
  private balanceSubscription: Subscription;
  private accountDetailsSubscription: Subscription;

  constructor(accountDetailsService: AccountDetailsService, private cdRef: ChangeDetectorRef) {
      console.log('AccountDetails Constructor');
      this.accountDetailsService = accountDetailsService;
  }

  ngOnInit() {
      console.log('Initializing AccountDetails');
      this.initialLogin();
      this.tabs = [
        {title: 'Transactions', active: true},
        {title: 'Spend'}
      ];
      this.accountDetailsSubscription = this.accountDetailsService.getAccountDetails().subscribe(
          (accDetails: AccountDetails)=>{
            this.accountDetails = accDetails;
            console.log('After initial load complete and before detectChanges call');
            this.cdRef.detectChanges();
          }
      );
  }

  private initialLogin() {
    //First login to get the auth token which needs to be used for remaining REST API calls 
    console.log('Before login request');
    this.loginSubscription = this.accountDetailsService
        .login()
        .subscribe(
            (authDetails: AuthorizationDetails) => { 
                console.log('Succefully completed login: NextObserver');
                this.authDetails = authDetails;
                console.log('authtoken :'+this.authDetails.getToken());
            },
            (error: any) => { 
                console.log('Error in init of account details component during Login: '+error); 
            },
            () => {
                console.log('Successfully completed login: CompletionObserver');
                this.accountDetails = AccountDetailsFactory.createAccountDetails(this.authDetails, this.balance, this.transactions);
                this.init(this.authDetails);
            }
        );
  }

  private init(authDetails: AuthorizationDetails) {
    console.log('Before balance request');
    this.balanceSubscription = this.accountDetailsService
        .balance(this.authDetails.getToken())
        .subscribe(
            (balance: Balance) => { this.balance = balance },
            (error: any) => { console.log('Error in init of account details component while fetching balance'); },
            () => {
                console.log('Successfully fetched balance');
                this.accountDetails.balance = this.balance;
                this.initialLoadComplete = true;
                this.accountDetailsService.setAccountDetails(this.accountDetails);
            }
        );
  }

  public setActiveTab(index: number): void {
    this.tabs[index].active = true;
  }
 
  public removeTabHandler(/*tab:any*/): void {
    console.log('Remove Tab handler');
  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
    this.balanceSubscription.unsubscribe();
    this.accountDetailsSubscription.unsubscribe();
  }
}