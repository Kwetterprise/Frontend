import { Component } from '@angular/core';
import { AuthenticationService } from "../../_services/authentication";

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  private readonly authenticationService: AuthenticationService;
  isLoggedIn = false;
  isExpanded = false;

  constructor(authenticationService: AuthenticationService) {
    this.authenticationService = authenticationService;
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
