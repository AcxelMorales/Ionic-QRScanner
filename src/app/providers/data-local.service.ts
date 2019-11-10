import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { Registry } from '../models/registry.model';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  registrys: Registry[] = [];

  constructor(
    private storage      : Storage,
    private navController: NavController,
    private iab          : InAppBrowser,
  ) {
    this.getStorage();
  }

  async saveRegistry(format: string, text: string): Promise<void> {
    await this.getStorage();

    const registry: Registry = new Registry(format, text);
    this.registrys.unshift(registry);
    this.storage.set('registrys', this.registrys);

    this.openRegistry(registry);
  }

  async getStorage(): Promise<void> {
    this.registrys = (await this.storage.get('registrys')) || [];
  }

  delete(idx: number): void {
    this.registrys.splice(idx, 1);
    this.storage.set('registrys', this.registrys);
  }

  openRegistry(registry: Registry): void {
    this.navController.navigateForward('/tabs/tab2');

    switch (registry.type) {
      case 'http':
        this.iab.create(registry.text, '_system');
        break;
      case 'geo':
        this.navController.navigateForward(`/tabs/tab2/map/${registry.text}`);
        break;
    }
  }

}
