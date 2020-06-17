import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from "../../_services/authentication";
import { AccountService } from "../../_services/account";
import { AlertService } from "../../_services/alert";

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  submitted = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authenticationService: AuthenticationService,
    private readonly accountService: AccountService,
    private readonly alertService: AlertService
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      // firstName: ['', Validators.required],
      // lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]]
    });


    // redirect to home if already logged in
    if (this.authenticationService.isLoggedIn) {
      this.router.navigate([this.route.snapshot.queryParams['returnUrl'] || '/']);
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.accountService.register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.success('Registration successful.', true);
          this.authenticationService.setUserData(data);
          this.router.navigate(['/account/my']);
        },
        error => {
          this.alertService.error(error);
          this.isLoading = false;
        });
  }
}
