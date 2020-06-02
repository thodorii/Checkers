import { Component, OnInit, Input, ElementRef,ViewContainerRef, ViewChild } 
from '@angular/core';

import {GameService} from '../../app/game.service';
@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css']
})
export class TileComponent implements OnInit {
  constructor(
    private el: ElementRef, //allows us to access this native element DOM level
    public game: GameService,
  ) {
    this.state=this.game.returnState(this.id[0],this.id[1]);
   }
  @Input() setColor;
  id='00';
  tileColor:string;
  state:number
  moveable=false;
  attackable=false;
  turn=false;

  returnState(){
    this.state=this.game.returnState(this.id[0],this.id[1]);
    alert(this.state);
  }

  clickHandler(){
    this.game.checkMove(this.id);
  }
  move(){
    this.game.move(this.id);
  }
  attack(){
    this.game.attack(this.id);
  }

  parseColor(tileNumber:number): void{
    if (tileNumber%16 <8){
      switch(tileNumber%2){
        case 0:
          this.tileColor="#b0582c";
          break;
        case 1:
          this.tileColor="#db9f81";
      }
    }
    if (tileNumber%16 >=8){
      switch(tileNumber%2){
        case 0:
          this.tileColor="#db9f81";
          break;
        case 1:
          this.tileColor="#b0582c";
      }
    }
  }

  setID(tileNumber:number): string{
    this.id=''+Math.floor(tileNumber/8)+tileNumber%8;
    return this.id;
    //a8-->h8
    //...
    //a1-->h8
  }


  ngOnInit(): void {
    this.parseColor(this.setColor);
    this.el.nativeElement.id=this.setID(this.setColor);
  }

}
