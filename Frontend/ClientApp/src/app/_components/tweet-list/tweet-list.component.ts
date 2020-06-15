import { Component, Input } from '@angular/core';
import { first } from 'rxjs/operators';
import { Guid } from "guid-typescript";

import { AlertService } from "../../_services/alert";
import { Tweet } from "../../_models/Tweet";
import { TimedData } from "../../_models/TimedData";

@Component({
  selector: 'tweet-list',
  templateUrl: 'tweet-list.component.html'
})
export class TweetListComponent {
  private next?: Guid;

  @Input()
  getTimedTweets: (count: number, from?: Guid) => Promise<TimedData<Tweet>>;

  tweets: Tweet[];
  isLoading: boolean;
  isEnded: boolean;

  constructor(private readonly alertService: AlertService) {
    this.tweets = [];
    this.isLoading = false;
    this.isEnded = false;
  }

  loadMore() {
    if (this.isEnded) {
      return;
    }

    this.isLoading = true;
    const count = 2;
    this.getTimedTweets(count, this.next).then(x => {
        this.next = x.next;
        this.tweets.push(...x.data);
        if (x.data.length != count) {
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
}
