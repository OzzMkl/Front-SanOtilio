import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Message {
  severity: string;
  summary: string;
  detail: string;
}

@Injectable({
  providedIn: 'root'
})

export class SharedMessage {

  private messageSubject = new BehaviorSubject<Message[]>([]);

  messages$ = this.messageSubject.asObservable();

  constructor() { }

  addMessages(message:Message){
    this.messageSubject.next([message]);
  }

  clearMessages(){
    this.messageSubject.next([]);
  }

}
