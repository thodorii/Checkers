import { Component, OnInit, } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent implements OnInit {
  turnState=this.game.whoseTurn;
  restart():void{
    this.game.restart();
  }

  constructor(
    public game: GameService,
  ) { }

  ngOnInit(): void {
  }

}
