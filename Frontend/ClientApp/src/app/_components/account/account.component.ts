import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService } from "../../_services/alert";
import { AuthenticationService } from "../../_services/authentication";
import { UserResult as User } from "../../_models/UserResult";

@Component({ templateUrl: 'account.component.html' })
export class AccountComponent {
  user: User;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) {
    // redirect to login if not logged in
    if (!this.authenticationService.currentUserValue) {
      this.router.navigate(['/login']);
    }

    this.user = this.authenticationService.currentUserValue;
  }
}
