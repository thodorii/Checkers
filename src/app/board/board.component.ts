import { Component, OnInit } from '@angular/core';
import { ChipComponent} from '../../app/chip/chip.component';
import { TileComponent} from '../../app/tile/tile.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
