import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { UniversityStreamEditComponent } from './edit/edit.component';

@Component({
  selector: 'app-university-stream',
  templateUrl: './stream.component.html',
})
export class UniversityStreamComponent implements OnInit {
  url = ``;
  searchSchema: SFSchema = {
    properties: {
      no: {
        type: 'string',
        title: 'Stream'
      }
    }
  };
  @ViewChild('st', { static: false }) st: STComponent;
  columns: STColumn[] = [
    { title: 'Stream Name', index: "stream_name" },
    { title: 'Year', type: 'number', index: 'year' },
    { title: 'time', type: 'date', index: 'updatedAt' },
    {
      title: '',
      buttons: [
        { text: 'View', click: (item: any) => { this._router.navigate([`/university/${this.params.universityId}/course/${this.params.courseId}/stream/${item._id}`]) } },
        {
          text: 'edit',
          type: 'modal',
          modal: {
            component: UniversityStreamEditComponent,
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
  params: any;

  constructor(
    private _http: _HttpClient,
    private modal: ModalHelper,
    private _route: ActivatedRoute,
    private _router: Router,
    public msg: NzMessageService,

  ) { }

  ngOnInit() {
    this.params = this._route.snapshot.params;
    this.url = `${environment.PREFIX}/university/${this.params.universityId}/course/${this.params.courseId}/stream/list`;
  }

  add() {
    this.modal
      .createStatic(UniversityStreamEditComponent, { i: { id: 0, universityId: this.params.universityId, courseId: this.params.courseId } })
      .subscribe(() => this.st.reload());
  }


  delete(data: any, that: any) {
    console.log(`Accept ${data}`);
    this._http.put(`${environment.PREFIX}/university/delete/course/${this.params.courseId}/stream/${data._id}`, { is_deleted: true })
      .subscribe(() => {
        this.msg.info(`Stream Deleted`);
        this.st.reload();
      });

  }

}
