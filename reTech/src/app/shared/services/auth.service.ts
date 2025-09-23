import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { LoginDto, LoginResponse, RegisterDto, RegisterResponse } from "../interfaces/auth.interface";

import { User } from "../interfaces/user.interface";

@Injectable({
    providedIn: 'root'
})
export class AuthService{

    private apiUrl = 'http://localhost:3000/auth';

    constructor(private http: HttpClient) {}

    login(dto: LoginDto): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, dto).pipe(
        tap((response: LoginResponse) => {
            localStorage.setItem('access_token', response.access_token);
        })
        );
    }

    register(dto:RegisterDto):Observable<RegisterResponse>{
        return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, dto).pipe(
            tap((response:RegisterResponse) => {
                localStorage.setItem('access_token', response.access_token)
            })
        )
    }

    getUserProfile(): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/profile`);
    }

    resetPasswordRequest(email:string):Observable<{message:string}>{
        return this.http.post<{message:string}>(`${this.apiUrl}/request-reset`, {email})
    }
    
    resetPassword(token:string, newPassword:string):Observable<{message:string}>{
        return this.http.post<{message:string}>(`${this.apiUrl}/reset-password`, {token, newPassword})
    }

    logout(): void {
        localStorage.removeItem('loginToken');
    }

    getToken(): string | null {
        return localStorage.getItem('loginToken');
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
}