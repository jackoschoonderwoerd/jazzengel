import { TaskScheduler } from '@angular-devkit/schematics';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, last, map, tap } from 'rxjs/operators';
import { Artist } from '../artist.model';
import { ArtistsService } from '../artists.service';

@Component({
  selector: 'app-create-artist',
  templateUrl: './create-artist.component.html',
  styleUrls: ['./create-artist.component.scss']
})
export class CreateArtistComponent implements OnInit {

  id: string;
  form: FormGroup;
  artist$: Observable<any>
  percentageChanges$: Observable<number>;
  imageUrl: string = null;
  artist: Artist;
  editMode: boolean = false
  

  constructor(
    private route: ActivatedRoute,
    private artistsService: ArtistsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private db: AngularFirestore,
    private storage: AngularFireStorage

  ) { }

  ngOnInit(): void {
    this.id = this.db.createId()
    this.initForm()

    this.route.paramMap.subscribe((paramMap: any) => {
      this.artist$ = this.artistsService.fetchArtistById(paramMap.params.id);
      this.artist$.subscribe((artist: Artist) => {
        this.imageUrl = artist.imageUrl;
        console.log(artist);
        if(artist.artistId !== undefined) {
          this.editMode = true;
          this.form.patchValue({
            artistId: artist.artistId,
            name: artist.name,
            instrument: artist.instrument,
            biography: artist.biography
          })
        }
      })
    })
  }
  
  initForm() {
    this.form = this.formBuilder.group({
      artistId: new FormControl(null),
      name: new FormControl('Victor de Boo', [Validators.required]),
      instrument: new FormControl('drums', [Validators.required]),
      biography: new FormControl('hi there', [])
    })
  }

  onCreateOrUpdateArtist() {
    if(!this.editMode) {
      this.artistsService.createArtist(this.form.value, this.imageUrl, this.id)
        .pipe(
          tap(artist => {
            console.log('created new artist', artist)
            this.router.navigate(['/artists'])
          }),
          catchError(err => {
            console.log(err)
            alert('could not create artist')
            return throwError(err)
          })
        )
        .subscribe()
    } else {
      console.log(this.editMode)
      this.artistsService.updateArtist(this.form.value, this.imageUrl)
        .pipe(
          tap(artist => {
            console.log('artist updated', artist);
            this.router.navigate(['/artists']);
          }),
          catchError(err => {
            console.log(err)
            alert('could not update artist')
            return throwError(err);
          })
        )
        .subscribe()
    }
  }


  uploadThumbnail(event) {
    const file: File = event.target.files[0]
    console.log(file.name);
    const filePath = `artists/${file.name}`
     const task = this.storage.upload( filePath, file, {
      cacheControl: 'max-age=2592000,public'
    });
    this.percentageChanges$ =  task.percentageChanges()
    task.snapshotChanges()
    .pipe(
      last(),
      concatMap(() => this.storage.ref(filePath).getDownloadURL()),
      tap(imageUrl => {
        this.imageUrl = imageUrl
      }),
      catchError(err => {
        console.log(err);
        alert('could not create thumbnail url');
        return throwError(err)
      })
    )
    .subscribe()
  }
}
