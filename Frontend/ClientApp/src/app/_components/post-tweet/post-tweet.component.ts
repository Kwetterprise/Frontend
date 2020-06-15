import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

import { AlertService } from "../../_services/alert";
import { TweetService } from "../../_services/tweet";
import { Tweet } from "../../_models/Tweet";

@Component({
  selector: 'post-tweet',
  templateUrl: 'post-tweet.component.html'
})
export class PostTweetComponent implements OnInit {
  tweetForm: FormGroup;
  isLoading = false;
  submitted = false;

  public onTweetPosted;

  constructor(
    private formBuilder: FormBuilder,
    private tweetService: TweetService,
    private alertService: AlertService
  ) {
    this.onTweetPosted = new BehaviorSubject<Tweet>(null);
  }

  ngOnInit() {
    this.tweetForm = this.formBuilder.group({
      content: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(280)]],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.tweetForm.controls; }


  async onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.tweetForm.invalid) {
      return;
    }

    this.isLoading = true;

    try {
      this.onTweetPosted.next(await this.tweetService.post(this.f.content.value, null).toPromise());
      this.alertService.success("Your tweet has been posted! It will appear on your profile soon.");
    }
    catch (error) {
      this.alertService.error(error);
    }

    this.isLoading = false;
  }
}
