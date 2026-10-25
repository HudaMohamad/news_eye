import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isSwinging = false;

  startSwing() {
    if (!this.isSwinging) {
      this.isSwinging = true;

      // 4 هزات × 1 ثانية = 4 ثواني
      setTimeout(() => {
        this.isSwinging = false;
      }, 4000);
    }
  }
}

