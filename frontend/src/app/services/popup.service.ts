import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  message: string | null = null;
  type: 'info' | 'error' | null = null;

  showingLogoutRequest: boolean = false;
  constructor() {}

  showError(error: any) {
    this.type = 'error';
    this.message = error.error ?? error.message ?? error;
    setTimeout(() => this.close(), 4000);
  }
  showInfo(message: string) {
    this.type = 'info';
    this.message = message;
    setTimeout(() => this.close(), 4000);
  }

  showLogoutRequest() {
    this.showingLogoutRequest = true;
  }
  hideLogoutRequest() {
    this.showingLogoutRequest = false;
  }

  close() {
    this.type = null;
    this.message = null;
  }
  orderComplete(message: string) {
    this.type = 'info';
    this.message = message;
    setTimeout(() => this.close(), 4000);
  }
}
