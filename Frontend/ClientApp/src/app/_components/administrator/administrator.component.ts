import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Guid } from "guid-typescript";
import { first } from 'rxjs/operators';

import { AlertService } from "../../_services/alert";
import { AuthenticationService } from "../../_services/authentication";
import { Account, Role } from "../../_models/Account";
import { AccountService } from "../../_services/account";
import { PagedData } from "../../_models/PagedData";

@Component({ templateUrl: 'administrator.component.html' })
export class AdministratorComponent implements OnInit {
  accounts: PagedData<Account>;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) {

  }


  ngOnInit(): void {
    if (this.authenticationService.currentUserValue.role !== Role.Administrator) {
      this.router.navigate(['/']);
      this.alertService.error("You are not authorized to visit this page.");
      return;
    }

    this.accountService.getAll("", 100, 0)
      .subscribe(data => {
          this.accounts = data;
        },
        error => {
          this.accounts = null;
        });
  }
}
