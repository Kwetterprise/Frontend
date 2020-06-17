import { Component, ViewChildren, QueryList, AfterViewInit, OnInit } from '@angular/core';
import { Guid } from "guid-typescript";

import { TweetService } from "../../_services/tweet";
import { TweetListComponent } from "../tweet-list/tweet-list.component";
import { PostTweetComponent } from "../post-tweet/post-tweet.component";
import { AuthenticationService } from "../../_services/authentication";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChildren(TweetListComponent)
  tweetList: QueryList<TweetListComponent>;

  @ViewChildren(PostTweetComponent)
  postTweet: QueryList<PostTweetComponent>;

  isLoggedIn: boolean;

  constructor(private tweetService: TweetService, private authenticationService: AuthenticationService) {

  }

  public ngOnInit(): void {
    this.authenticationService.currentUser.subscribe(x => {
      this.isLoggedIn = x !== null;
    });
  }

  public ngAfterViewInit(): void {
    this.postTweet.first.onTweetPosted.subscribe(newTweet => newTweet && this.tweetList.first.appendTop(newTweet));
  }

  public getNextTweets(count: number, from?: Guid) {
    return this.tweetService.getAll(false, count, from).toPromise();
  }
}
