import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SnomedService {

  readonly baseUrl: string = '/snowstorm/snomed-ct/fhir/';

  constructor(private http: HttpClient) { }

  search(term: string, ecl: string, url: string, lang: string): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type':  'application/json',
        'Accept': 'application/json',
        'Accept-Language': lang || 'en',
      })
    };
    if (term && term.length > 0) {
        return this.http.get(this.baseUrl + 'ValueSet/$expand?url=' + url + '?fhir_vs=ecl/' +
          ((ecl && ecl.length > 0) ? encodeURIComponent(ecl) : '*') + // default to all concepts
          '&filter=' + encodeURIComponent(term) + '&offset=0&count=10', httpOptions);
    } else {
        return from([]);
    }
  }
}
