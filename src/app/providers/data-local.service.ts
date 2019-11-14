import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from "@ionic-native/file/ngx";
import { EmailComposer } from '@ionic-native/email-composer/ngx';

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
    private file         : File,
    private emailComposer: EmailComposer
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
  
  sendEmail(): void {
    const arrTemp = [];
    const titles: string = 'Tipo, Formato, Creado en, Texto\n';

    arrTemp.push(titles);
    this.registrys.forEach(r => {
      const line = `${r.type}, ${r.format}, ${r.createdAt}, ${r.text.replace(',', ' ')}\n`;
      arrTemp.push(line);
    });

    console.log(arrTemp.join(' '));

    this.createFilePhysical(arrTemp.join(' '));
  }

  createFilePhysical(text: string): void {
    this.file.checkFile(this.file.dataDirectory, 'registrys.csv')
      .then(() => this.writeFile(text))
      .catch(err => this.file.createFile(this.file.dataDirectory, 'registrys.csv', false))
        .then(created => this.writeFile(text))
        .catch(err2 => console.log('No se creo el archivo', err2));
  }

  async writeFile(text: string): Promise<void> {
    await this.file.writeExistingFile(this.file.dataDirectory, 'registrys.csv', text);
    
    const archivo = `${this.file.dataDirectory}registrys.csv`;

    let email = {
      to: 'acxelmorales97@gmail.com',
      // cc: 'erika@mustermann.de',
      // bcc: ['john@doe.com', 'jane@doe.com'],
      attachments: [
        archivo
      ],
      subject: 'Backup de Scanns',
      body: 'Aquí tiene sus backups de los scanns - <i>Ionic QRScanner</i>',
      isHtml: true
    }
    
    // Send a text message using default options
    this.emailComposer.open(email);
  }

}
