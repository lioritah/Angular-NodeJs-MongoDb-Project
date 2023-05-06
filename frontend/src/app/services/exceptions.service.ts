import { Injectable } from '@angular/core';
import { PopupService } from './popup.service';

@Injectable({
  providedIn: 'root',
})
export class ExceptionsService {
  constructor(private popupService: PopupService) {}

  handleError(error: any) {
    this.popupService.showError(error);
    return error;
  }
}
