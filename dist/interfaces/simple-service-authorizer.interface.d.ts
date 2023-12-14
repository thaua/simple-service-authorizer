export interface ISimpleServiceAuthorizer {
    generateToken(): string;
    validateToken(token: string): boolean;
}
