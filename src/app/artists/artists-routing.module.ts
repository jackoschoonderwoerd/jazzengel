import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArtistsComponent } from './artists.component';
import { CreateArtistComponent } from './create-artist/create-artist.component';




const routes: Routes = [
  { path: '', component: ArtistsComponent },
  { path: 'create-artist', component: CreateArtistComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArtistsRoutingModule { }
