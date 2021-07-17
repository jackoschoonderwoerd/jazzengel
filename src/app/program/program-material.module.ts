import { NgModule } from "@angular/core";
import { MatInputModule } from "@angular/material/input";
import {MatFormFieldModule} from '@angular/material/form-field';

import { MatButtonModule } from "@angular/material/button";
import { MatExpansionModule } from "@angular/material/expansion";

import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";






@NgModule({
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSidenavModule,
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSidenavModule,
  ]
})

export class ProgramMaterialModule { }