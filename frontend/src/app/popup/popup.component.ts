import { Component } from '@angular/core';
import { PopupService } from '../services/popup.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
})
export class PopupComponent {
  constructor(public popupService: PopupService) {}
}
