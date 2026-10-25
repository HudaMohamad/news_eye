import { Component } from '@angular/core';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear: string;

  constructor() {
    const tz = 'Asia/Damascus';
    this.currentYear = moment.tz(tz).format('YYYY'); // الحصول على السنة الحالية بتوقيت دمشق
  }
}
