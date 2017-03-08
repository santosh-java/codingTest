import { Component, ChangeDetectionStrategy } from '@angular/core';

import { AccountDetailsService } from '../services';


@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: '../htmls/app.component.html',
  styleUrls: ['../styles/app.component.css'],
  providers: [ AccountDetailsService ]
})
export class AppComponent {
  public currentBalance = 100;
  public currencyCode = 'USD';
}
