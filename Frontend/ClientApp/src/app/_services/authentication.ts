import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Guid } from "guid-typescript";

import { AccountWithToken, Role } from "../_models/Account";
import { Option } from "src/app/_models/Option";

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private readonly currentUserSubject: BehaviorSubject<AccountWithToken>;
  private readonly baseUrl: string;
  public currentUser: Observable<AccountWithToken>;

  constructor(private readonly http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.baseUrl = baseUrl;
    this.currentUserSubject = new BehaviorSubject<AccountWithToken>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): AccountWithToken {
    return this.currentUserSubject.value;
  }

  public get isLoggedIn(): boolean {
    return this.currentUserValue !== null;
  }

  public get isAdministrator(): boolean {
    return this.currentUserValue !== null && this.currentUserValue.role === Role.Administrator;
  }

  public isCurrentUser(id: Guid): boolean {
    return this.isLoggedIn && this.currentUserValue.id === id;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something went wrong. Please try again later.');
  };

  login(username, password) {
    return this.http.post<Option<AccountWithToken>>(`${this.baseUrl}Authentication/Authenticate`, { username, password })
      .pipe(
        catchError(this.handleError),
        map(result => {
          if (result.hasFailed) {
            throw new Error(result.error);
          }

          this.setUserData(result.value);

          return result.value;
        }));
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  setUserData(result: AccountWithToken) {
    // store user details and jwt token in local storage to keep user logged in between page refreshes
    localStorage.setItem('currentUser', JSON.stringify(result));
    this.currentUserSubject.next(result);
  }
}
