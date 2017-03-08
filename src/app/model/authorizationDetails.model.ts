export class AuthorizationDetails {
    private token: string;

    constructor(token: string){
        this.token = token;
    }

    public getToken() : string {
        return this.token;
    }
}