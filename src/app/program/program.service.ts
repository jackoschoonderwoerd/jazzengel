import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { ArtistsService } from '../artists/artists.service';
import { Booking, Gig, Month, Year } from './program.models';
import * as fromRoot from './../app.reducer';
import * as PROGRAM from './../program/program.actions'
import { BookArtistComponent } from './book-artist/book-artist.component';
import { Artist } from '../artists/artist.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteComponent } from '../shared/confirm-delete/confirm-delete.component';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {

  yearNames = [];
  monthNames = [];
  gigNames = [];
  years: Year[] = [];
  yearsChanged: Subject<Year[]>;
  openYears: Year[];
  bookedYears: Year[];
  bookings$: Observable<Booking[]>
  

  constructor(
    private db: AngularFirestore,
    private dialog: MatDialog
    ) { }



  fetchBookings() {
    console.log('fetching')
    this.db
      .collection('bookings', ref => ref.orderBy('booking.listPosition'))
      .snapshotChanges()
      .pipe(
        map(docArray => {
          return docArray.map((doc: any) => {
            return {
              bookingId: doc.payload.doc.id,
              booking: doc.payload.doc.data().booking
            }
          })
        })
      ).subscribe((res) => {
        // ? CLEAR !
        this.removeAllArtistsFromAllGigs();
        res.forEach(res => {
          // console.log(res);
          const booking: Booking = res.booking
          booking.bookingId = res.bookingId
          this.addBookingToGig(booking);
        })
      })
  }

  addBookingToDb(booking: Booking) {
    return this.db.collection('bookings').add({
      booking
    })
    .then(res => {
      return res;
    })
  }

  addBookingToGig(booking: Booking) { 
    this.years.forEach((year: Year) => {
      if (year.yearName === booking.date[2]) {
        year.months.forEach((month: Month) => {
          if (month.name === booking.date[0]) {
            month.gigs.forEach((gig: Gig) => {
              if (gig.name === booking.date[1]) {
                const bookingIds = []
                gig.bookings.forEach(booking => {
                  bookingIds.push(booking.bookingId);
                })
                if (bookingIds.includes(booking.bookingId)) {
                } else {
                  gig.bookings.push(booking);
                }
              }
            })
          }
        })
      }
    })
  }

  removeBookingFromDb(bookingId) {
    const message = 'This will remove the artist from the gig';
    const dialogRef = this.dialog.open(ConfirmDeleteComponent, {data: {message: message}});
    dialogRef.afterClosed().subscribe(data => {
      if(data) {
        return this.db
          .collection('bookings')
          .doc(bookingId)
          .delete()
          .then(res => {
            this.fetchBookings()
            return res;
          })
          .catch(err => {
            console.log(err);
          })
      }
      return;
    })
  }

  removeGigFromProgram(bookingId) {
    console.log(bookingId);
    this.years.forEach((year: Year) => {
      year.months.forEach((month: Month) => {
        month.gigs.forEach((gig: Gig) => {
          gig.bookings.forEach((booking: Booking) => {
            console.log(booking.bookingId, bookingId)
          })
          const index = gig.bookings.findIndex((booking: Booking) => {
            return booking.bookingId == bookingId
          })
          gig.bookings.splice(index, 1);
          
          // const index = gig.bookings.findIndex((booking: Booking) => {
          //   return (booking.bookingId === bookingId);
          // })
          // console.log(index);
        })
      } )
    })
  }

  removeGigsFromMonths() {
    this.years.forEach((year: Year) => {
      year.months.forEach((month: Month) => {
        month.gigs = []
      })
    })
  }

  onGetOrderedGigs(dateNamesArray) {
    console.log('onGetOrderedGigs');
    this.db.collection('bookings',
    ref => ref.orderBy('booking.listPosition')).get().subscribe(snaps => {
      snaps.forEach(snap => {
        console.log(snap.id);
      })
    });
  }

  getGig(dateNamesArray): Observable<any> {
    console.log(dateNamesArray);
    return this.db.collection('bookings', ref => ref.orderBy('booking.listPosition'))
    .snapshotChanges()
    .pipe(
      map(docArray => {
        return docArray.map((doc: any) => {
          return {
            bookingId: doc.payload.doc.id,
            date: doc.payload.doc.data().booking.date,
            isFeatured: doc.payload.doc.data().booking.isFeatured,
            artist: doc.payload.doc.data().booking.artist,
            listPosition: doc.payload.doc.data().booking.listPosition
          }
        })
      })
    )
  }



  removeAllArtistsFromAllGigs() {
    console.log('removing');
    this.years.forEach((year: Year) => {
      year.months.forEach((month: Month) => {
        month.gigs.forEach((gig: Gig) => {
          gig.bookings = []
        })
      })
    })
  }


  getYears(start, end) {
    this.removeGigsFromMonths();
    let sundays = []
    // ? GET ALL DATES AS A STRING
    const rawSundays = (this.getSundays(new Date(start), new Date(end)));
    // ? TURN THE STRING INTO AN ARRAY (MONTH-DATE-YEAR)
    rawSundays.forEach((sunday: string) => {
      sundays.push(sunday.split('/'))
    })
    sundays = this.cleanUpFirstSunday(sundays);
    sundays = this.sundaysToInt(sundays);

    // ? ADD YEARS 
    for (let i = 0; i < sundays.length; i++) {
      if (!this.yearNames.includes(sundays[i][2]) || this.years.length === 0) {
        this.yearNames.push(sundays[i][2]);
        this.years.push({
          yearName: sundays[i][2],
          months: []
        })
      }
    }
    // ? ADD MONTHS
    for (let i = 0; i < sundays.length; i++) {
      this.years.forEach((newYear: Year) => {
        if (sundays[i][2] === newYear.yearName) {
          if (!this.monthNames.includes(sundays[i][0]) || this.monthNames.length === 0) {
            this.monthNames.push(sundays[i][0]);
            newYear.months.push({
              name: sundays[i][0],
              gigs: []
            })
          }
        }
      })
    }
    // ? ADD GIGS
    // ALL SUNDAYS
    for (let i = 0; i < sundays.length; i++) {;
      // EVERY YEAR
      this.years.forEach((newYear: Year) => {
        // EVERY MONTH IN THAT YEAR
        newYear.months.forEach((month: Month) => {
          // IF THE FIRST ELEMENT IN THE SUNDAY-ARRAY CORRESPONDS WITH THE MONTH-NAME
          if (sundays[i][0] === month.name) {
            if (!this.gigNames.includes(sundays[i][1]) || this.gigNames.length === 0) {
              this.gigNames.push(sundays[i][1]);
              month.gigs.push({
                name: sundays[i][1],
                bookings: []
              })
            }
          }
        })
        this.gigNames = [];
      })
    }
    return this.years
  }

  private getSundays(startDate, endDate) {
    var Sundays = [];
    var day = startDate.getDay();
    if (day != 0) startDate.setDate(startDate.getDate() + (7 - day));
    Sundays[0] = startDate.toLocaleString('en-US');
    while (startDate) {
      startDate.setDate(startDate.getDate() + 7);
      if (startDate > endDate) {
        return Sundays
      };
      Sundays.push(startDate.toLocaleDateString('en-US'));
    }
  }

  private cleanUpFirstSunday(sundays) {
    sundays[0][2] = sundays[0][2].split(',')
    sundays[0][2] = sundays[0][2][0]
    return sundays;
  }

  private sundaysToInt(sundays) {
    sundays.forEach(sunday => {
      sunday[0] = parseInt(sunday[0])
      sunday[1] = parseInt(sunday[1])
      sunday[2] = parseInt(sunday[2])
    })
    return sundays;
  }
}
