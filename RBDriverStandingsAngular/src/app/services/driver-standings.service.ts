import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DriverStandingsService {
  private apiUrl = 'http://localhost:5017/api/drivers';

  constructor(private http: HttpClient) {}

  getDriverStandings(season: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${season}`);
  }
}