import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { AuthService } from '../auth.service';
import { Store } from '@ngrx/store';
import * as fromApp from './../../app.reducer'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isAuth$: Observable<boolean>;
  isLoading$: Observable<boolean>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private store: Store<fromApp.GlobalState>
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.isLoading$ = this.store.select(fromApp.getIsLoading);
    this.isAuth$ = this.store.select(fromApp.getIsAuth);
    
    
  }

  initForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('jackoboes@gmail.com', {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('123456', { 
        validators: [Validators.required] })
    });
  }
  onSubmitLoginForm() {
    this.authService.login(this.loginForm.value)
  }
}
