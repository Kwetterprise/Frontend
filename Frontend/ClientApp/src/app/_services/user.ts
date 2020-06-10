import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Guid } from "guid-typescript";
import { UserInfo } from "../_models/UserInfo";
import { RegisterRequest } from "../_models/RegisterRequest";
import { RegisterResponse } from "../_models/RegisterResponse";
import { HttpErrorResponse } from "@angular/common/http/http";
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { UserResult } from "../_models/UserResult";

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl: string;

  constructor(private readonly http: HttpClient, @Inject('BASE_URL') baseUrl: string) { this.baseUrl = baseUrl; }

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
    return this.http.post<RegisterResponse>(`${this.baseUrl}Account/Register`, user)
      .pipe(catchError(this.handleError), map(data => {
        if (data.error !== null) {
          throw new Error(data.error);
        }

        return data.createdUser;
      }));
  }

  update(user: UserInfo) {
    return this.http.post(`${this.baseUrl}Account/Update`, user);
  }

  delete(id: Guid) {
    return this.http.delete(`${this.baseUrl}Account/${id}`);
  }
}
