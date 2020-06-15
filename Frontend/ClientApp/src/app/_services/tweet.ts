import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Guid } from "guid-typescript";

import { AuthenticationService } from "./authentication";
import { Tweet, PostTweetRequest } from "../_models/Tweet";
import { Option } from "../_models/Option";
import { PagedData } from "../_models/PagedData";
import { TimedData } from "../_models/TimedData";


@Injectable({ providedIn: 'root' })
export class TweetService {
  private readonly baseUrl: string;

  constructor(
    private readonly http: HttpClient,
    private readonly authenticationService: AuthenticationService,
    @Inject('BASE_URL') baseUrl: string) {
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

  getByUser(id: Guid, ascending: boolean, count: number, from?: Guid) {
    let url = `${this.baseUrl}Tweet/GetFromUser?id=${id}&ascending=${ascending}&count=${count}`;

    if (from) {
      url += `&from=${from}`;
    }

    return this.http.get<Option<TimedData<Tweet>>>(url)
      .pipe(catchError(this.handleError),
        map(data => {
          if (data.hasFailed) {
            throw new Error(data.error);
          }

          return data.value;
        }));
  }

  post(content: string, parentTweet: Guid) {
    if (!this.authenticationService.isLoggedIn) {
      return throwError("You are not logged in.");
    }

    const postTweetRequest = new PostTweetRequest(this.authenticationService.currentUserValue.id, content, parentTweet);

    return this.http.post<Option<Tweet>>(`${this.baseUrl}Tweet`, postTweetRequest)
      .pipe(catchError(this.handleError),
        map(data => {
          if (data.hasFailed) {
            throw new Error(data.error);
          }

          return data.value;
        }));
  }
}
