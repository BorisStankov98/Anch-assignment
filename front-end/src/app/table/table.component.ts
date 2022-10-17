import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { map, Observable, of, tap, combineLatestWith } from 'rxjs';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  data$: Observable<any> = of();
  organizations: string[] = [
    'Sales',
    'Legal',
    'Human Resources',
    'Engineering',
    'Business Development',
    'Support',
  ];
  jobTitle: string[] = [
    'Contact person',
    'Recruiter',
    'Researcher',
    'Responder',
    'Designer',
    'Result receiver',
    '	System Architect',
    'Product Manager',
  ];
  rolesForFilter: { [key: string]: number } = {};
  roles: { [key: string]: number } = {};
  constructor(private http: HttpService, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    const dataSubscribtion = this.http.getData();
    this.data$ = dataSubscribtion;
    /* the description of the task said to use the data so im
      using it as is altough I noticed some weird duplication of data because of formating
    */
    dataSubscribtion
      .pipe(
        map((item: any[]) => {
          item.forEach((item) => {
            if (!(item.Role in this.roles)) this.roles[item.Role] = 0;
            if (item.Role in this.roles) {
              this.roles[item.Role] += 1;
            }
          });
        }),
        tap(
          () =>
            (this.rolesForFilter = {
              ...this.roles,
            })
        )
      )
      .subscribe();
    this.filterForm.valueChanges.subscribe((form) => {
      this.roles = {};
      this.data$ = dataSubscribtion.pipe(
        combineLatestWith(of(form)),
        map(([users, form]) => {
          const { nameOrEmail, organization, job_title, role } = form;
          console.log(users);

          return users.filter((user: any) => {
            return (
              (user["First Name"].includes(nameOrEmail) || user['Last name'].includes(nameOrEmail) || user['Email'].includes(nameOrEmail) || nameOrEmail === '') &&
              (user['Organisation Unit'] === organization ||
                organization === null) &&
              (user['Job title'] === job_title || job_title === null) &&
              (user['Role'] === role || role === null)
            );
          });
        })
      );
      this.data$
        .pipe(
          map((item: any[]) => {
            item.forEach((item) => {
              if (!(item.Role in this.roles)) this.roles[item.Role] = 0;
              if (item.Role in this.roles) {
                this.roles[item.Role] += 1;
              }
            });
          })
        )
        .subscribe();
    });
  }
  filterForm = this.formBuilder.group({
    nameOrEmail: [''],
    organization: [],
    job_title: [],
    role: [],
  });
  displayedColumns: string[] = [
    'user',
    'job_title',
    'organisation_unit',
    'role',
  ];
}
