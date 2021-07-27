import { TaskScheduler } from '@angular-devkit/schematics';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Console } from 'console';
import { Observable, throwError } from 'rxjs';
import { catchError, concatMap, delay, last, map, tap } from 'rxjs/operators';
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
  // imageUrl: string = null;
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
      this.artist$ = this.artistsService.fetchArtistById(paramMap.params.artistId);
      this.artist$.subscribe((artist: Artist) => {
        // this.imageUrl = artist.imageUrl;
        console.log(artist);
        if(artist.artistId !== undefined) {
          this.editMode = true;
          this.form.patchValue({
            artistId: artist.artistId,
            name: artist.name,
            instrument: artist.instrument,
            biography: artist.biography,
            filePath: artist.filePath,
            imageUrl: artist.imageUrl
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
      biography: new FormControl('hi there', []),
      filePath: new FormControl(null),
      imageUrl: new FormControl(null)
    })
  }

  onCreateOrUpdateArtist() {
    // ? NEW ENTRY
    if(!this.editMode) {
      console.log(this.form.value);
      this.artistsService.createArtist(this.form.value)
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
      // ? EDIT ENTRY
      console.log(this.editMode)
      console.log(this.form.value)
      this.artistsService.updateArtist(this.form.value)
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
    if(this.editMode) {
      console.log('this.editMode', this.editMode)
      if(this.form.value.filePath) {
        console.log(this.form.value.filePath);
        this.storage.ref(this.form.value.filePath).delete().subscribe(data => console.log(data));
      }
    }
    console.log(event.target.files[0].name);
    const file: File = event.target.files[0];
    const filePath = file.name
     const task = this.storage.upload( filePath, file, {
      cacheControl: 'max-age=2592000,public'
    });
    this.percentageChanges$ = task.percentageChanges()
    task.snapshotChanges()
    .pipe(
      last(),
      concatMap(() => this.storage.ref(filePath).getDownloadURL()),
      tap(imageUrl => {
        // console.log(imageUrl)
        // this.form.patchValue({
        //   imageUrl: imageUrl
        // })
        // console.log(this.form.value)
        // if(imageUrl) {
        //   this.getResizedUrl(filePath);
        // }
        this.keepTrying(10, filePath)
      }),
      catchError(err => {
        console.log(err);
        alert('could not create thumbnail url');
        return throwError(err)
      })
    )
    .subscribe();
  }



  
  // getResizedUrl(filePath) {
    //   setTimeout(() => {
      //     const newFilePath = filePath.split('.')[0] + '_640x640.jpeg'
      //     const storageRef = this.storage.storage.ref().child(newFilePath);
      //     return storageRef.getDownloadURL().then((newUrl: string) => {
        //       console.log(newUrl);
        //       this.imageUrl = newUrl;
        //     })
        //   }, 5000)
        // }

  // https://www.py4u.net/discuss/315114

  keepTrying(triesRemaining, filePath) {
    if(triesRemaining < 0) {
      return Promise.reject('out of tries')
    }
    const newFilePath = filePath.split('.')[0] + '_640x640.jpeg'
   
    // this.artist.filePath = filePath.split('.')[0] + '_640x640.jpeg'
    const storageRef = this.storage.storage.ref().child(newFilePath);
    return storageRef.getDownloadURL()
      .then((newUrl: string) => {
        console.log(newUrl);
        this.form.patchValue({
          filePath: newFilePath,
          imageUrl: newUrl
        })
        console.log('NEWURL', newUrl);
    }).catch((error) => {
      switch(error.code) {
        case 'storage/object-not-found':
          console.log(error.code);
          return setTimeout(() => {
            return this.keepTrying(triesRemaining - 1, filePath)
          }, 2000);
        default: {
          console.log(error);
          return Promise.reject(error)
        }
      }
    })
  }
}
