import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-university-stream-edit',
  templateUrl: './edit.component.html',
})
export class UniversityStreamEditComponent implements OnInit {
  record: any = {};
  i: any;
  schema: SFSchema = {
    properties: {
      stream_name: { type: 'string', title: 'Stream Name', maxLength: 15 },
      description: { type: 'string', title: 'description', maxLength: 140 },
    },
    required: ['stream_name', 'year'],
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
  }
  save(value: any) {
    if (!this.record._id) {

      this.http.post(`${environment.PREFIX}/university/${this.i.universityId}/courses/${this.i.courseId}/stream/new`, value).subscribe(res => {
        this.msgSrv.success('Created successfully');
        this.modal.close(true);
      });
    } else {
      this.http.put(`${environment.PREFIX}/university/${this.record.universityId}/courses/${this.record.courseId}/stream/${this.record._id}`, value).subscribe(res => {
        this.msgSrv.success('Updated successfully');
        this.modal.close(true);
      });
    }
  }

  close() {
    this.modal.destroy();
  }
}
