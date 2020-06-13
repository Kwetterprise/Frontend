import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Guid } from "guid-typescript";
import { first } from 'rxjs/operators';

import { AlertService } from "../../_services/alert";
import { AuthenticationService } from "../../_services/authentication";
import { Account } from "../../_models/Account";
import { AccountService } from "../../_services/account";

@Component({ templateUrl: 'account.component.html' })
export class AccountComponent implements OnInit {
  account: Account;
  isLoading: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) {
    this.isLoading = true;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      const id = params.get("id");

      if (!Guid.isGuid(id)) {
        if (!this.authenticationService.isLoggedIn) {
          this.router.navigate(['/login']);
        }

        this.router.navigate(['/account', this.authenticationService.currentUserValue.id]);
        return;
      }

      const guid = Guid.parse(params.get("id"));
      try {
        this.account = await this.accountService.getById(guid).toPromise();
        console.log(this.account);
      } catch (err) {
        this.alertService.error(err);
      }
      this.isLoading = false;
    });
  }
}
