import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
import { SnomedService } from './snomed-service.service';

interface Coding {
  system: string;
  code: string;
  display: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'snomed-vitalis';

  results: Coding[] = [];

  url: string = "";

  entryForm = this.formBuilder.group({
    search: '',
    ecl: '',
    lang: ''
  });

  constructor(
    private snomedService: SnomedService,
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const typeahead = this.entryForm.get('search')?.valueChanges.pipe(
      filter(text => text.length > 2),
      debounceTime(10),
      distinctUntilChanged(),
      tap(() => {
        const ecl = this.entryForm.get('ecl')?.value;
        const term = this.entryForm.get('search')?.value;
        this.url = '/snowstorm/snomed-ct/fhir/ValueSet/$expand?url=http://snomed.info/sct/45991000052106?fhir_vs=ecl/' +
          ((ecl && ecl.length > 0) ? ecl : '*') + '&filter=' + term + '&offset=0&count=10'
      }),
      switchMap(text => this.snomedService.search(
        text,
        this.entryForm.get('ecl')?.value,
        'http://snomed.info/sct/45991000052106',
        this.entryForm.get('lang')?.value
        ))
    ).subscribe((response) => {
      const expansion: Coding[] = response.expansion.contains;
      console.log(expansion);
      this.results = expansion;
    })
  }


}
