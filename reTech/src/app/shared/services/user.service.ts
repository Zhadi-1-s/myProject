import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn:'root'
})
export class UserService{

    private apiUrl = 'http://localhost:3000/users';

    constructor(
        private http:HttpClient
    ){}

    addFavorite(userId: string, pawnshopId: string): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${userId}/favorites/${pawnshopId}`, {});
    }

    removeFavorite(userId: string, pawnshopId: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${userId}/favorites/${pawnshopId}`);
    }
    
    getFavorites(userId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/${userId}/favorites`);
    }

}
