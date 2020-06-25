import { Component, Input, AfterContentInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Guid } from "guid-typescript";
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService } from "../../_services/alert";
import { Tweet } from "../../_models/Tweet";
import { TimedData } from "../../_models/TimedData";
import { AuthenticationService } from "../../_services/authentication";
import { TweetService } from "../../_services/tweet";

@Component({
  selector: 'tweet-list',
  templateUrl: 'tweet-list.component.html'
})
export class TweetListComponent implements AfterContentInit {
  private next?: Guid;

  @Input()
  getTimedTweets: (count: number, from?: Guid) => Promise<TimedData<Tweet>>;

  tweets: Tweet[];
  isLoading: boolean;
  isEnded: boolean;

  constructor(
    private alertService: AlertService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private tweetService: TweetService) {
    this.tweets = [];
    this.isLoading = false;
    this.isEnded = false;
  }

  public ngAfterContentInit(): void {
    this.loadMore();
  }

  public loadMore() {
    if (this.isEnded) {
      return;
    }

    this.isLoading = true;
    const count = 10;
    this.getTimedTweets(count, this.next).then(x => {
      this.next = x.next;
      this.tweets.push(...x.data);
      if (x.next === null) {
        this.isEnded = true;
      }
      this.isLoading = false;
    })
      .catch(error => {
        this.alertService.error(error);
        this.isLoading = false;
      });
  }

  appendTop(tweet: Tweet) {
    this.tweets.splice(0, 0, tweet);
  }

  goToProfile(id: Guid) {
    this.router.navigate(['/account', id]);
  }

  isCurrentUser(id: Guid) {
    return this.authenticationService.isCurrentUser(id);
  }

  async deleteTweet(id: Guid) {
    try {
      await this.tweetService.delete(id).toPromise();
      for (let i = 0; i < this.tweets.length; i++) {
        if (this.tweets[i].id === id) {
          this.tweets.splice(i, 1);
        }
      }
    } catch (err) {
      this.alertService.error(err);
    }
  }
}
