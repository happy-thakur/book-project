import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { UniversityUniversityEditComponent } from './edit/edit.component';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-university-university',
  templateUrl: './university.component.html',
})
export class UniversityUniversityComponent implements OnInit {
  url = `${environment.PREFIX}/university/list`;
  searchSchema: SFSchema = {
    properties: {
      university_name: {
        type: 'string',
        title: 'University'
      }
    }
  };
  @ViewChild('st', { static: false }) st: STComponent;
  columns: STColumn[] = [
    { title: 'University Name', index: 'university_name' },
    { title: 'Description', index: 'description', default: '---' },
    { title: 'time', type: 'date', index: 'createdAt' },
    {
      title: 'Actions',
      buttons: [
        { text: 'View', click: (item: any) => { console.log(`/university/${item._id}/course`); this._router.navigate([`/university/${item._id}/course`]) } },
        {
          text: 'edit',
          type: 'modal',
          modal: {
            component: UniversityUniversityEditComponent,
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
    public msg: NzMessageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() { }

  add() {
    this.modal
      .createStatic(UniversityUniversityEditComponent, { i: { id: 0 } })
      .subscribe(() => this.st.reload());
  }

  delete(data: any, that: any) {
    console.log(`Accept ${data}`);
    this._http.put(`${environment.PREFIX}/university/delete/${data._id}`, { is_deleted: true })
      .subscribe(() => {
        this.msg.info(`University Deleted`);
        this.st.reload()
      });

  }
}
