import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GlobalState } from '../app.reducer';
import * as fromApp from './../app.reducer'
import * as fromProgram from './../program/program.reducer'
import * as PROGRAM from './../program/program.actions';
import { Booking, Year } from './program.models';
import { ProgramService } from './program.service';

@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.scss']
})
export class ProgramComponent implements OnInit {

  isAdmin$: Observable<boolean>;
  condition: boolean = true;
  years: Year[];
  years$: Observable<Year[]>
  bookedYears$: Observable<Year[]>
  isAuthenticated
  isAuthenticated$
  yearOpen: number = 2022;
  monthOpen: number;
  dayOpen: number;
  dateOpen: number[] = [];
  dateOpen$: Observable<number[]>
  showcaseOpen: boolean = true;
  // bookedYears: Year[];

  constructor(
    private router: Router,
    private store: Store<GlobalState>,
    private programService: ProgramService
  ) { }

  ngOnInit(): void {
    
    this.dateOpen$ = this.store.select(fromApp.getDate);
    this.isAuthenticated$ = this.store.select(fromApp.getIsAuth);
    // this.years$ = this.programService.fetchBookings()
    this.store.subscribe(storeContent => {
      console.log(storeContent);
      this.isAuthenticated = storeContent.auth.isAuthenticated
    })
    this.store.subscribe(storeContent => {
      this.showcaseOpen = storeContent.program.isShowcaseOpen
    })
    
    // this.programService.yearsChanged.subscribe((years: Year[]) => {
    //   this.years = years;
    // })
    this.years = this.programService.getYears('6/1/2021', '5/31/2022');
    // this.bookedYears$ = this.store.select(fromApp.getYears);
    this.programService.removeAllArtistsFromAllGigs()
    this.isAdmin$ = this.store.select(fromApp.getIsAdmin);
    this.programService.fetchBookings();
    this.years$ = this.store.select(fromApp.getYears);
  }

  onGigDate(monthName: number, gigName: number, yearName: number) {
    // const selectedDate = new Date(yearName, monthName - 1, gigName);
    const selectedDateNames = [monthName, gigName, yearName]
    if(this.isAuthenticated) {
      this.router.navigate(['program/book-artist', {dateNames: selectedDateNames}])
    }
  }

  updateProgram() {
    // this.years = this.programService.getYears(new Date(), new Date('6/30/22'))
    this.programService.fetchBookings()
  }


  bookingSelected(booking: Booking) {
    this.store.dispatch(new PROGRAM.SetDate(booking.date));
    // this.showcaseOpen = true;
    this.store.dispatch(new PROGRAM.IsShowcaseOpen(true));
    this.store.dispatch(new PROGRAM.SetArtist(booking.artist));
    this.store.dispatch(new PROGRAM.SetBooking(booking))
  }

  onDeleteBooking(id) {
    if(this.isAuthenticated) {
      this.programService.removeBookingFromDb(id);
    } else {
      alert ('you have to be logged in')
    }
  }
}
