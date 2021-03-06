import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Place } from '../models/place.model';

@Injectable({
  providedIn: 'root'
})
export class LocalDataService {

  private _places$ = new BehaviorSubject<Place[]>([]);
  private places$ = this._places$.asObservable();

  constructor(
    private http: HttpClient,
  ) { }

  getPlaces() {
    return this.http.get('../../assets/resources/places_dataset.json')
      .subscribe((places: any) => {
        this._places$.next(JSON.parse(places.data.listPlacesString2));
      });
  }

  get places(): Observable<Place[]> {
    this.getPlaces();

    return this.places$;
  }
}
