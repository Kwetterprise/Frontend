import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from "../../_services/authentication";

@Component({ templateUrl: 'logout.component.html' })
export class LogoutComponent {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // if already logged out, we dont care
    if (this.authenticationService.isLoggedIn) {
        this.authenticationService.logout();
    }

    this.router.navigate([returnUrl]);
  }
}
