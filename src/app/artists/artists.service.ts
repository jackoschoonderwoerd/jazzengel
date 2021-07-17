import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { convertSnaps } from '../shared/db-utils';
import { Artist } from './artist.model';

@Injectable({
  providedIn: 'root'
})
export class ArtistsService {

  artist: Artist;

  constructor(
    private db: AngularFirestore
  ) { }

  fetchArtists(): Observable<Artist[]> {
    return this.db
      .collection('artists',
        ref => ref.orderBy('name'))
      .snapshotChanges()
      .pipe(
        map(docArray => {
          return docArray.map((doc: any) => {
            return {
              id: doc.payload.doc.id,
              name: doc.payload.doc.data().name,
              instrument: doc.payload.doc.data().instrument,
              imageUrl: doc.payload.doc.data().imageUrl,
              biography: doc.payload.doc.data().biography
            }
          })
        })
      )
  }

  fetchDocumentById(id) {
    
    this.db.collection('artists').doc(id).get().subscribe((snapshot) => {
      
      this.artist = {
        artistId: id,
        name: snapshot.get('name'),
        instrument: snapshot.get('instrument')
      } 
    })
    console.log(this.artist);
    return this.artist
  }

  fetchArtistById(id) {
    console.log(id);
    // return this.db.doc(`artists/${id}`)
    return this.db
      .collection('artists')
      .doc(id)
      .snapshotChanges()
      .pipe(
        map(snaps => {
          const artist: Artist = {
            artistId: id,
            name : snaps.payload.get('name'),
            instrument: snaps.payload.get('instrument'),
            imageUrl: snaps.payload.get('imageUrl'),
            biography: snaps.payload.get('biography')
          }
          return artist
        }
        ),
        first()
      );
  }

  createArtist(artist: Artist, imageUrl: string, id?: string): Observable<any> {
    console.log(artist)
    artist.imageUrl = imageUrl;
    return from(this.db.collection('artists').add(artist))
  }
  updateArtist(artist: Artist, imageUrl: string): Observable<any> {
    console.log(artist)
    artist.imageUrl = imageUrl;
    return from(this.db.doc(`artists/${artist.artistId}`).update(artist))
    // console.log(artist);
  }

  deleteArtist(id) {
    return this.db.doc(`artists/${id}`).delete()
  }
}
