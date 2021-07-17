import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Artist } from './artist.model';
import { ArtistsService } from './artists.service';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss']
})
export class ArtistsComponent implements OnInit {

  artists$: Observable<any>

  constructor(
    private router: Router,
    private artistsService: ArtistsService
  ) { }

  ngOnInit(): void {


    this.artists$ = this.artistsService.fetchArtists()
    
  }
  onRoute(route) {
    this.router.navigate(['artists/' + route]);
  }
  onEditArtist(id) {
    console.log(id)
    this.router.navigate(['artists/create-artist', {id: id}]);
  }
  onDeleteArtist(id) {
    if(confirm('this will delete the artist-entry')) {
      this.artistsService.deleteArtist(id);
    }
    return;
  }
}
