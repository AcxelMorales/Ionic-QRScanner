import { Component } from '@angular/core';

import { DataLocalService } from '../../providers/data-local.service';
import { Registry } from '../../models/registry.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: []
})
export class Tab2Page {

  constructor(public _dataLocalService: DataLocalService) {}

  sendEmail(): void {
    this._dataLocalService.sendEmail();
  }

  openRegistry(registry: Registry): void {
    this._dataLocalService.openRegistry(registry);
  }

  delete(idx: number): void {
    this._dataLocalService.delete(idx);
  }

}
