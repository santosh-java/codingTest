import { Injectable, OnDestroy } from '@angular/core';
import { Http, Headers, Response, Request, RequestOptionsArgs } from '@angular/http';
import { Subject, Observable, Subscription } from 'rxjs/Rx';
import { Balance, BalanceFactory, Transaction, TransactionJSON, TransactionFactory, AuthorizationDetails, AuthorizationDetailsFactory, AccountDetails, AccountDetailsFactory } from '../model';

@Injectable()
export class AccountDetailsService implements OnDestroy{
    accountDetails: AccountDetails;

    private corsIssueFix: string = 'https://cors-anywhere.herokuapp.com/';
    private baseUrl: string = 'https://interviewer-api.herokuapp.com';
    private http: Http;
    private accDetailsSub: Subject<AccountDetails> = new Subject<AccountDetails>();
    private balSubscription: Subscription;
    private transSubscription: Subscription;

    constructor(http : Http) {
        this.http = http;
    }

    public login(): Observable<AuthorizationDetails> {
        return this.http
            .post(this.corsIssueFix+this.baseUrl+'/login','', this.getRequestOptionsArgs('login', null, null)) 
            .map(mapAuthDetails);
    } 

    public transactions(accountToken: string) : Observable<Transaction[]> {
        return this.http
            .get(this.corsIssueFix+this.baseUrl+'/transactions', this.getRequestOptionsArgs('transactions', accountToken, null))
            .map(mapTransactions);
    }

    public balance(accountToken: string) : Observable<Balance> {
        return this.http
            .get(this.corsIssueFix+this.baseUrl+'/balance', this.getRequestOptionsArgs('balance', accountToken, null))
            .map(mapBalance);
    }

    public spend(accountToken: string, transaction: Transaction) : Observable<Response> {
        // return this.http.post(this.corsIssueFix+this.baseUrl+'/spend', this.getRequestOptionsArgs('spend', accountToken, transaction.toJSON()));
        return this.http
            .post(this.corsIssueFix+this.baseUrl+'/spend', transaction, this.getRequestOptionsArgs('spend', accountToken, transaction.toJSON()));
    }

    private getRequestOptionsArgs(type: string, accountToken: string, body: TransactionJSON) : RequestOptionsArgs{
        let reqOptionArgs;
        
        switch(type) {
            case 'login':
                reqOptionArgs = {
                    headers: new Headers({'Accept':'application/json', 'Content-Type':'application/json', 'Cache-Control':'no-cache', 'Postman-Token':'4b0dcedc-635c-4128-9f64-d4777feb1395'}),
                    body: body
                };
                break;
            case 'transactions':
            case 'balance':
                reqOptionArgs = {
                    headers: new Headers({'Authorization':'Bearer '+accountToken, 'Accept':'application/json', 'Cache-Control':'no-cache', 'Postman-Token':'4b0dcedc-635c-4128-9f64-d4777feb1395'}),
                    body: body
                };
                break;
            case 'spend':
                reqOptionArgs = {
                    headers: new Headers({'Authorization':'Bearer '+accountToken, 'Accept':'application/json', 'Content-Type':'application/json', 'Cache-Control':'no-cache', 'Postman-Token':'4b0dcedc-635c-4128-9f64-d4777feb1395'}),
                    body: body
                };            
                break;
        }
         
        return reqOptionArgs;
    }

    public setAccountDetails(accountDetails: AccountDetails): void {
        this.accountDetails = accountDetails;
        this.accDetailsSub.next(accountDetails);
    }

    public getAccountDetails() : Observable<AccountDetails> {
        return this.accDetailsSub.asObservable();
    }

    public updateBalanceAndTransactions(authToken: string) : void {
        let allDataFetchedSuccessfully = true;
        this.balSubscription = this.balance(authToken).subscribe(
            (bal: Balance) => {
                this.accountDetails.balance = bal;
            },
            (error: Error) => {
                allDataFetchedSuccessfully = false;
            },
            () => {
                this.setAccountDetails(this.accountDetails);
            }
        );

        this.transSubscription = this.transactions(authToken).subscribe(
            (trans: Transaction[]) => {
                this.accountDetails.transactions = trans;
            },
            (error: Error) => {
                allDataFetchedSuccessfully = false;
            },
            () => {
                 this.setAccountDetails(this.accountDetails);
            }
        );
    }

    ngOnDestroy() {
        this.balSubscription.unsubscribe();
        this.transSubscription.unsubscribe();
    }
}

function mapAuthDetails(response: Response) : AuthorizationDetails {
    return toAuthDetails(response.json());
}

function toAuthDetails(res: any) : AuthorizationDetails {
    return AuthorizationDetailsFactory.createAuthorizationDetails(res);
}

function mapTransactions(response: Response) : Transaction[] {
    return toTransactions(response.json());
}

function toTransactions(res: any) :Transaction[]{
    let _trans: Transaction[] = [];
    for(var i=0; i<res.length; i++) {
        _trans.push(TransactionFactory.createTransaction(res[i]));
    }
    return _trans;
}

function mapBalance(response: Response) : Balance {
    return toBalance(response.json());
}

function toBalance(res: any) : Balance {
    return BalanceFactory.createBalance(res);
}