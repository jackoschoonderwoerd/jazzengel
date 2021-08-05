import { Component, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GlobalState } from '../app.reducer';
import * as fromApp from './../app.reducer'
import * as fromProgram from './../program/program.reducer'
import * as PROGRAM from './../program/program.actions';
import { Booking, Year } from './program.models';
import { ProgramService } from './program.service';
import { ArtistsService } from '../artists/artists.service';
import { Artist } from '../artists/artist.model';
import { relative } from '@angular/compiler-cli/src/ngtsc/file_system';
import { transform } from 'typescript';

@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProgramComponent implements OnInit {

  @ViewChild('target') target: HTMLElement

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
  showcaseOpen$: Observable<boolean>;
  // bookedYears: Year[];
  test: boolean = true;
  pageY: number;

  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event) {
    console.log(event)
  }

  constructor(
    private router: Router,
    private store: Store<GlobalState>,
    private programService: ProgramService,
    private artistService: ArtistsService
  ) { }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scroll, true);
    
    this.dateOpen$ = this.store.select(fromApp.getDate);
    this.isAuthenticated$ = this.store.select(fromApp.getIsAuth);
    // this.years$ = this.programService.fetchBookings()
    this.store.subscribe(storeContent => {
      console.log(storeContent);
      this.isAuthenticated = storeContent.auth.isAuthenticated
    })
    this.store.subscribe(storeContent => {
      this.showcaseOpen = storeContent.program.isShowcaseOpen
      console.log('this.showcaseOpen', this.showcaseOpen);
    })
    this.showcaseOpen$ = this.store.select(fromApp.isShowcaseOpen)
    
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

  scroll(event: Event): void {
    // console.log(event);
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

  openedChange(e) {
    console.log(e)
  }

  bookingSelected(booking: Booking) {
    console.log(booking.artist.artistId);
    this.artistService.fetchArtistById(booking.artist.artistId)
    .subscribe((artist: Artist) => {
      console.log(artist);
      this.store.dispatch(new PROGRAM.SetArtist(artist));
      this.store.dispatch(new PROGRAM.IsShowcaseOpen(true));
    })
    // const originalUrl = 'https://firebasestorage.googleapis.com/v0/b/jazzengel-ff7bc.appspot.com/o/Barend-Middelhoff.jpg?alt=media&token=0fd6bd65-2779-4a39-baf0-befcc5c46fb2';
    // const originalUrlArray = originalUrl.split('/o/')

    // const resampldUrl = 'https://firebasestorage.googleapis.com/v0/b/jazzengel-ff7bc.appspot.com/o/artist-image-640%2FBarend-Middelhoff_640x640.jpeg?alt=media&token=ee082df2-67ea-492e-bcd3-3ee7ab4cd12d';
    
    this.store.dispatch(new PROGRAM.SetDate(booking.date));
    // this.store.dispatch(new PROGRAM.)
    // this.showcaseOpen = true;
    this.store.dispatch(new PROGRAM.SetArtistId(booking.artist.artistId));
    // this.store.dispatch(new PROGRAM.SetArtist(booking.artist));
    this.store.dispatch(new PROGRAM.SetBooking(booking))
  }

  onDeleteBooking(id) {
    if(this.isAuthenticated) {
      this.programService.removeBookingFromDb(id);
    } else {
      alert ('you have to be logged in')
    }
  }
  gigExpansionPanelSelected(e) {
    console.log(e);
  }
  getColor() {
    return 'yellow';
  }
  monthPanelSelected(e) {
    // console.log(e);
    // window.scroll(0, e.srcElement.offsetTop)
    window.scroll(0, 500)
  }


  gigPanelSelected(e) {
    // console.log(e);
    // console.log(e.srcElement.offsetTop);
    // var x = e.pageX 
    // var y = e.pageY
    // this.pageY = e.pageY
    // console.log('pageX:', x)
    // console.log('pageY:', y)
    // console.log('e.srcElement.offsetTop: ', e.srcElement.offsetTop)
    // console.log('e.srcElement.parentElement.offsetTop: ', e.srcElement.parentElement.offsetTop)
    // window.scrollTo(0, 100);
    // window.scroll(0, 100);
    // window.scroll(0, e.srcElement.offsetTop)
  }

  monthPanelExpanded() {
    return {
      // top: -this.pageY + 100 + 'px'
      // top: '-100px'
      backgroundColor: 'var(--jazz-red)',
      
      padding: '0.5em'
    }
  }
  monthPanelClosed() {
    return {
      backgroundColor: 'var(--jazz-white)',
      // top: null
    }
  }
  monthTitleExpanded () {
    return {
      color: 'var(--jazz-black)',
      textTransform: 'uppercase',
      fontSize: '1.5rem',
      fontWeight: '500'
    }
  }
  monthTitleClosed () {

  }


 
  gigTitleExpanded() {
    return {
      color: 'var(--jazz-black)',
      fontSize: '1.5rem',
      fontWeight: '500'
    }
  }
  gigPanelExpanded() {
    return {
      backgroundColor: 'var(--jazz-red)',
      color: 'var(--jazz-black)',
      // top: -this.pageY + 100 + 'px'
    }
  }
  gigPanelClosed() {
    return {
      backgroundColor: 'var(--jazz-white)',
      // position: 'static'
    }
  }
  gigTitleClosed () {

  }
  gigDescriptionExpanded () {
    return {
      color: 'var(--jazz-black)',
      textTransform: 'uppercase',
      
    }
  }
  gigDescriptionClosed () {

  }
  gigListItemExpanded() {
    return {
      fontWeight: '900'
    }
  }
  gigListItemTitleClosed() {

  }
}
