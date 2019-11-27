import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UniversityPublisherComponent } from './publisher/publisher.component';
import { UniversityBookComponent } from './book/book.component';

const routes: Routes = [

  { path: 'publisher', component: UniversityPublisherComponent },
  { path: 'book', component: UniversityBookComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UniversityRoutingModule { }
