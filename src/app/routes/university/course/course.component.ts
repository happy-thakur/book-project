import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { UniversityCourseEditComponent } from './edit/edit.component';
import { Router, ActivatedRoute } from '@angular/router';
import { UniversityStreamComponent } from '../stream/stream.component';
import { environment } from '../../../../environments/environment';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-university-course',
  templateUrl: './course.component.html',
})
export class UniversityCourseComponent implements OnInit {
  params;
  url = '';
  searchSchema: SFSchema = {
    properties: {
      no: {
        type: 'string',
        title: 'Numbering'
      }
    }
  };
  @ViewChild('st', { static: false }) st: STComponent;
  columns: STColumn[] = [
    { title: 'Course Name', index: "course_name" },
    { title: 'Year', type: 'number', index: 'year' },
    { title: 'time', type: 'date', index: 'updatedAt' },
    {
      title: '',
      buttons: [
        { text: 'View', click: (item: any) => { this._router.navigate([`/university/${this.params.universityId}/course/${item._id}/stream`]) } },
        {
          text: 'edit',
          type: 'modal',
          modal: {
            component: UniversityCourseEditComponent,
          },
          click: (_record, modal) => this.msg.success(`Reload the page and return the value:${JSON.stringify(modal)}`),
        },
        {
          text: 'Delete',
          type: "del",
          pop: {
            title: 'Are you sure you want to Delete?',
            okType: 'danger'
          },
          icon: {
            type: "close",
            theme: "outline"
          },
          click: (info: any) => this.delete(info, this),
        }
      ]
    }
  ];

  constructor(
    private _http: _HttpClient,
    private modal: ModalHelper,
    private _router: Router,
    private _route: ActivatedRoute,
    public msg: NzMessageService,

  ) { }

  ngOnInit() {
    this.params = this._route.snapshot.params;
    this.url = `${environment.PREFIX}/university/${this.params.universityId}/course/list`;

  }

  add() {
    this.modal
      .createStatic(UniversityCourseEditComponent, { i: { id: 0, universityId: this.params.universityId } })
      .subscribe(() => this.st.reload());
  }


  delete(data: any, that: any) {
    console.log(`Accept ${data}`);
    this._http.put(`${environment.PREFIX}/university/delete/course/${data._id}`, { is_deleted: true })
      .subscribe(() => {
        this.msg.info(`University Deleted`);
      });

  }
}
