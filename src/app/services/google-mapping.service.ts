import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

declare const google: any;

export interface MapOptions {
  zoom?: number;
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
  ) { }

  getGeocodedAddress(address: string): Observable<any> {
    const { googleMapKey, googleGeocodeUrl } = this.environment;
    const url = `${googleGeocodeUrl}?address=${address}&key=${googleMapKey}`;
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');

    return this.httpClient.get(url, { headers, responseType: 'json', observe: 'body' });
  }

  async initializeMap(containerId: string, address: string, mapOptions: MapOptions) {
    this.getGeocodedAddress(address)
      .subscribe(response => {
        const map = this.ngZone.runOutsideAngular(() => {
          return new google.maps.Map(
            document.getElementById(containerId),
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


      }, error => {
        console.error(`Error fetching map! Err: ${error}`);
      });
  }
}
