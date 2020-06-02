import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.css']
})
export class ChipComponent implements OnInit {
  @Input() team;
  bodyColor:string;
  constructor() { }

  ngOnInit(): void {
    if (this.team==1) this.bodyColor="#d5d5d5"
    if (this.team==2) this.bodyColor="#333333"

  }

}
