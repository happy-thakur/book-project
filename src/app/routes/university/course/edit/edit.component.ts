import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-university-course-edit',
  templateUrl: './edit.component.html',
})
export class UniversityCourseEditComponent implements OnInit {
  @Input() record;

  i: any;
  schema: SFSchema = {
    properties: {
      course_name: { type: 'string', title: 'Course Name', maxLength: 15 },
      year: { type: 'number', title: 'Year' },
      description: { type: 'string', title: 'description', maxLength: 140 },
    },
    required: ['course_name', 'year'],
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
  params: any;

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

      this.http.post(`${environment.PREFIX}/university/${this.i.universityId}/courses/new`, value).subscribe(res => {
        this.msgSrv.success('Created successfully');
        this.modal.close(true);
      });
    } else {
      this.http.put(`${environment.PREFIX}/university/${this.record.universityId}/courses/${this.record._id}`, value).subscribe(res => {
        this.msgSrv.success('Updated successfully');
        this.modal.close(true);
      });
    }
  }
  close() {
    this.modal.destroy();
  }
}
