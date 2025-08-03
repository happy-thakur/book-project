import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { UniversityRoutingModule } from './university-routing.module';
import { UniversityUniversityComponent } from './university/university.component';
import { UniversityUniversityEditComponent } from './university/edit/edit.component';
import { UniversityUniversityViewComponent } from './university/view/view.component';
import { UniversityCourseComponent } from './course/course.component';
import { UniversityCourseEditComponent } from './course/edit/edit.component';
import { UniversityCourseViewComponent } from './course/view/view.component';
import { UniversityStreamComponent } from './stream/stream.component';
import { UniversityStreamEditComponent } from './stream/edit/edit.component';
import { UniversityStreamViewComponent } from './stream/view/view.component';
import { UniversityPublisherComponent } from './publisher/publisher.component';
import { UniversityPublisherEditComponent } from './publisher/edit/edit.component';
import { UniversityPublisherViewComponent } from './publisher/view/view.component';
import { UniversityBookComponent } from './book/book.component';
import { UniversityBookEditComponent } from './book/edit/edit.component';
import { UniversityBookViewComponent } from './book/view/view.component';

const COMPONENTS = [
  UniversityUniversityComponent,
  UniversityCourseComponent,
  UniversityStreamComponent,
  UniversityPublisherComponent,
  UniversityBookComponent];
const COMPONENTS_NOROUNT = [
  UniversityUniversityEditComponent,
  UniversityUniversityViewComponent,
  UniversityCourseEditComponent,
  UniversityCourseViewComponent,
  UniversityStreamEditComponent,
  UniversityStreamViewComponent,
  UniversityPublisherEditComponent,
  UniversityPublisherViewComponent,
  UniversityBookEditComponent,
  UniversityBookViewComponent];

@NgModule({
  imports: [
    SharedModule,
    UniversityRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class UniversityModule { }
