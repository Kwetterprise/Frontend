import { Component, OnInit, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Guid } from "guid-typescript";

import { AlertService } from "../../_services/alert";
import { AuthenticationService } from "../../_services/authentication";
import { Account } from "../../_models/Account";
import { AccountService } from "../../_services/account";
import { TweetService } from "../../_services/tweet";
import { TweetListComponent } from "../tweet-list/tweet-list.component";
import { PostTweetComponent } from "../post-tweet/post-tweet.component";

@Component({ templateUrl: 'account.component.html' })
export class AccountComponent implements OnInit, AfterViewInit {
  account: Account;
  isLoading: boolean;
  accountPromise: Promise<void | Account> = new Promise(() => { });
  isCurrentUser: boolean = true; // TODO: Good fix.

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private tweetService: TweetService
  ) {
    this.isLoading = true;
  }

  @ViewChildren(TweetListComponent)
  tweetList: QueryList<TweetListComponent>;

  @ViewChildren(PostTweetComponent)
  postTweet: QueryList<PostTweetComponent>;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get("id");

      if (!Guid.isGuid(id)) {
        if (!this.authenticationService.isLoggedIn) {
          this.router.navigate(['/login']);
        }

        this.router.navigate(['/account', this.authenticationService.currentUserValue.id]);
        return;
      }

      const guid = Guid.parse(params.get("id"));
      this.accountPromise = this.accountService.getById(guid).toPromise()
        .then(x => {
          this.account = x;
          this.isCurrentUser = this.authenticationService.isCurrentUser(x.id);
          this.isLoading = false;
          return x;
        })
        .catch(x => {
          this.account = null;
          this.alertService.error(x);
          this.isLoading = false;
        });
    });
  }

  public ngAfterViewInit(): void {
    this.postTweet.first.onTweetPosted.subscribe(newTweet => newTweet && this.tweetList.first.appendTop(newTweet));
  }

  async getNextTweets(count: number, from?: Guid) {
    const acc = await this.accountPromise;
    return await this.tweetService.getByUser((acc as Account).id, false, count, from).toPromise();
  }
}
