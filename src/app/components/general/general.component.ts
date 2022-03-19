import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {

  public typewriter_text: string = "Thank you for your interest";
  public typewriter_display: string = "";

  constructor() { }

  ngOnInit(): void {
    
    
  }
}
