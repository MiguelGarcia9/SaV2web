import { Component } from '@angular/core';
import $ from 'jquery';
declare var $: $;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent {
  title = 'app';
  infoLegacy: any;

  constructor () {
  }
}
