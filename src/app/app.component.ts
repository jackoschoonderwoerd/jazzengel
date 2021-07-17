import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

import { Store } from '@ngrx/store'
import * as fromRoot from './app.reducer';
import { AuthService } from './auth/auth.service';
import * as UI from './shared/ui.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'jazzengel';
  
  constructor(
    private authService: AuthService,
    private swUpdate: SwUpdate
    
  ) {}

  ngOnInit() {
    this.authService.initAuthListener();
    
    if(this.swUpdate.isEnabled) {
      console.log('swUpdate enabled')
      this.swUpdate.available.subscribe(() => {
        if(confirm('New version available. Load new version?')) {
          window.location.reload();
        }
      });
    }
  }
}

