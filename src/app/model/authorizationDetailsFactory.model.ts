import { AuthorizationDetails } from '../model';

export class AuthorizationDetailsFactory {
    public static createAuthorizationDetails(data: any) : AuthorizationDetails {
        let authDetails = new AuthorizationDetails(data.token);
        return authDetails;
    }
}