import { Injectable } from '@angular/core';
import { PouchDB }  from 'pouchdb-browser'

@Injectable({
  providedIn: 'root'
})
export class DbPwaService {

  private db: any;

  constructor() { 
    this.db = new PouchDB('ventas');
  }

  public addTask = (dataScheme: { _id: any; }) =>{
    this.db.get(dataScheme._id)
      .then( (doc: any) => {
          delete dataScheme._id;
          doc = Object.assign(doc, dataScheme);
          this.db.put(doc);
      }).catch(() => {
          this.db.put(dataScheme);
      });
  }
}
