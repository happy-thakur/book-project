import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-university-university-edit',
  templateUrl: './edit.component.html',
})
export class UniversityUniversityEditComponent implements OnInit {
  @Input() record;

  schema: SFSchema = {
    properties: {
      university_name: { type: 'string', title: 'Name', maxLength: 15 },
      description: { type: 'string', title: 'description', maxLength: 140 },
    },
    required: ['university_name'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
    },
    $no: {
      widget: 'text'
    },
    $href: {
      widget: 'string',
    },
    $description: {
      widget: 'textarea',
      grid: { span: 24 },
    },
  };


  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) { }

  ngOnInit(): void {
    this.record = this.record || {};

  }

  save(value: any) {
    if (!this.record._id) {

      this.http.post(`${environment.PREFIX}/university/new`, value).subscribe(res => {
        this.msgSrv.success('Created successfully');
        this.modal.close(true);
      });
    } else {
      this.http.put(`${environment.PREFIX}/university/${this.record._id}`, value).subscribe(res => {
        this.msgSrv.success('Updated successfully');
        this.modal.close(true);
      });
    }
  }

  close() {
    this.modal.destroy();
  }
}
