import { NgModule } from "@angular/core";

import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatButtonModule } from "@angular/material/button";


import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatIconModule } from "@angular/material/icon";
import { MatExpansionModule } from "@angular/material/expansion";


import {MatToolbarModule} from '@angular/material/toolbar'; 
import {MatListModule} from '@angular/material/list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSnackBarModule} from '@angular/material/snack-bar';





@NgModule({
  imports: [
    
    MatButtonModule,
    MatFormFieldModule,
    MatCheckboxModule,
    
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatToolbarModule,
  ],
  exports: [
    MatButtonModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatToolbarModule,
  ]
})

export class AppMaterialModule { }