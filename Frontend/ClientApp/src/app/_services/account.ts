import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Guid } from "guid-typescript";
import { RegisterRequest } from "../_models/RegisterRequest";
import { HttpErrorResponse } from "@angular/common/http/http";
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Account, AccountWithToken } from "../_models/Account";
import { Option } from "../_models/Option";
import { AuthenticationService } from "./authentication";

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly baseUrl: string;
  private readonly authenticationService: AuthenticationService;

  constructor(private readonly http: HttpClient, authenticationService: AuthenticationService, @Inject('BASE_URL') baseUrl: string) {
    this.authenticationService = authenticationService;
    this.baseUrl = baseUrl;
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

  register(user: RegisterRequest) {
    return this.http.post<Option<AccountWithToken>>(`${this.baseUrl}Account/Register`, user)
      .pipe(catchError(this.handleError),
        map(data => {
          if (data.hasFailed) {
            throw new Error(data.error);
          }

          this.authenticationService.setUserData(data.value);
          return data.value;
        }));
  }

  getById(id: Guid) {
    return this.http.get<Option<Account>>(`${this.baseUrl}Account/GetById?id=${id}`)
      .pipe(catchError(this.handleError),
        map(data => {
          if (data.hasFailed) {
            throw new Error(data.error);
          }

          return data.value;
        }));
  }

  update(user: Account) {
    return this.http.post(`${this.baseUrl}Account/Update`, user);
  }

  delete(id: Guid) {
    return this.http.delete(`${this.baseUrl}Account/${id}`);
  }
}
