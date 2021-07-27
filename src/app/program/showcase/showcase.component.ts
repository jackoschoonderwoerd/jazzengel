import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router'
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Artist } from 'src/app/artists/artist.model';
import { ArtistsService } from 'src/app/artists/artists.service';
import { Booking } from '../program.models';
import * as fromRoot from './../../app.reducer'
import * as PROGRAM from './../program.actions'
@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
  styleUrls: ['./showcase.component.scss']
})
export class ShowcaseComponent implements OnInit {

  artist$: Observable<Artist>
  booking$: Observable<Booking>
  
  constructor(
    private store: Store<fromRoot.GlobalState>
  ) { }

  ngOnInit(): void {
    this.artist$ = this.store.select(fromRoot.getArtist);
    this.booking$ = this.store.select(fromRoot.getBooking);
  }

  onCloseShowcase() {
    this.store.dispatch(new PROGRAM.IsShowcaseOpen(false));
  }
}
