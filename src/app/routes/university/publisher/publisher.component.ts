import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { UniversityPublisherEditComponent } from './edit/edit.component';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-university-publisher',
  templateUrl: './publisher.component.html',
})
export class UniversityPublisherComponent implements OnInit {
  url = ``;
  searchSchema: SFSchema = {
    properties: {
      publisher_name: {
        type: 'string',
        title: 'Publisher Name'
      }
    }
  };
  @ViewChild('st', { static: false }) st: STComponent;
  columns: STColumn[] = [
    { title: 'University Name', index: 'publisher_name' },
    { title: 'Description', index: 'description', default: '---' },
    { title: 'time', type: 'date', index: 'createdAt' },
    {
      title: 'Actions',
      buttons: [
        { text: 'View', click: (item: any) => { this._router.navigate([`/university/${this.params.universityId}/publisher/${item._id}`]) } },
        {
          text: 'edit',
          type: 'modal',
          modal: {
            component: UniversityPublisherEditComponent,
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
      .createStatic(UniversityPublisherEditComponent, { i: { id: 0, university: this.params.universityId } })
      .subscribe(() => this.st.reload());
  }

  delete(data: any, that: any) {
    console.log(`Accept ${data}`);
    this._http.put(`${environment.PREFIX}/university/delete/publisher/${data._id}`, { is_deleted: true })
      .subscribe(() => {
        this.msg.info(`University Deleted`);
        this.st.reload()
      });

  }

}
