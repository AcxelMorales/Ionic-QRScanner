import { Component } from '@angular/core';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

import { DataLocalService } from '../../providers/data-local.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: []
})
export class Tab1Page {

  slideOpts: any = {
    allowSlidePrev: false,
    allowSlideNext: false
  };

  constructor(
    private barcodeScanner   : BarcodeScanner,
    private _dataLocalService: DataLocalService
  ) { }

  ionViewWillEnter(): void {
    this.scann();
  }

  scann(): void {
    this.barcodeScanner.scan().then(barcodeData => {
      if (!barcodeData.cancelled) {
        this._dataLocalService.saveRegistry(barcodeData.format, barcodeData.text);
      }
    }).catch(err => {
      console.log('Error', err);
      // this._dataLocalService.saveRegistry('geo', 'geo:40.73151796986687,-74.06087294062502');
    });
  }

}
