import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { PopupService } from '../services/popup.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  constructor(
    public popUpService: PopupService,
    public authService: AuthService
  ) {}
}
