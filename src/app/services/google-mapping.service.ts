import { Injectable, NgZone, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

declare var google: any;

export interface MapOptions {
  zoom?: number;
  tilt?: number;
  center?: {lat: number, lng: number};
  disableDefaultUI?: boolean;
  zoomControl?: boolean;
  mapTypeControl?: boolean;
  scaleControl?: boolean;
  streetViewControl?: boolean;
  rotateControl?: boolean;
  fullscreenControl?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GoogleMappingService {
  private environment = environment;

  constructor(
    private httpClient: HttpClient,
    private ngZone: NgZone,
  ) {}

  getGeocodedAddress(address: string): Observable<any> {
    const { googleMapKey, googleGeocodeUrl } = this.environment;
    const url = `${googleGeocodeUrl}?address=${address}&key=${googleMapKey}`;
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');

    return this.httpClient.get(url, { headers, responseType: 'json', observe: 'body' });
  }

  async initializeMap(containerElement: ElementRef, address: string, mapOptions: MapOptions) {
    this.getGeocodedAddress(address)
      .subscribe(response => {
        if (google) {
          const map = this.ngZone.runOutsideAngular(() => {
            return new google.maps.Map(
              containerElement.nativeElement,
              mapOptions
            );
          });

          const location = response.results[0].geometry.location;
          map.setCenter(location);

          // tslint:disable-next-line: no-unused-expression
          new google.maps.Marker({
            position: location,
            map,
            title: address
          });
        }
      }, error => {
        console.error(`Error fetching map! Err: ${error}`);
      });
  }
}
