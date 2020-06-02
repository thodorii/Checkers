import {  
  Injectable,
  Component,
  ComponentFactoryResolver, Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import { ChipComponent} from '../app/chip/chip.component';

@Injectable({
  providedIn: 'root'
})

export class GameService {
  chipState=[ //STARTING STATE
    [0,2,0,2,0,2,0,2],
    [2,0,2,0,2,0,2,0],
    [0,2,0,2,0,2,0,2],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [1,0,1,0,1,0,1,0],
    [0,1,0,1,0,1,0,1],
    [1,0,1,0,1,0,1,0],
  ];

  moveState=[
    [false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false],
  ];

  attackState=[
    [false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false],
    [false,false,false,false,false,false,false,false],
  ];

  blackCount=12;
  whiteCount=12;
  whoseTurn=true;
  currentChip:string;
  moveAvailable=false; //used for when checking for chain jump
  choiceLocked=false; //used for chain jumping, if exist choice you cant switch.
  returnState(y,x): number{
    return this.chipState[y][x];
  }

//mode 0: Initial move
//mode 1: state after attack, check for more.
  checkMove(id:string, mode:number=0){
    //Activates when a tile with a chip is clicked on. This is why we check state. Depending on chip team and power, we decide which diagonals it can move on.
    if (this.choiceLocked==false){
    this.clearMoveStates();
    let state=this.returnState(id[0],id[1]);
    if ( (state==1) && this.whoseTurn==true){
      this.currentChip=id;
      try{
      this.checkDiag(id,0,mode);
      this.checkDiag(id,1,mode);
      } catch(error){
        alert(error);
      }
    };

    if ( (state==2) && this.whoseTurn==false){
      this.currentChip=id;
      try{
      this.checkDiag(id,3,mode);
      this.checkDiag(id,2,mode);
      } catch(error){
        alert(error);
      }
    }

    if ( (state==10) && this.whoseTurn==true){
      this.currentChip=id;
      this.checkDiag(id,2,mode);
      this.checkDiag(id,3,mode);
      this.checkDiag(id,0,mode);
      this.checkDiag(id,1,mode);
    };

    if ( (state==20) && this.whoseTurn==false){
      this.currentChip=id;
      this.checkDiag(id,0,mode);
      this.checkDiag(id,1,mode);
      this.checkDiag(id,2,mode);
      this.checkDiag(id,3,mode);
    }
    }
  };

//move to id. move already selected chip to that tile
  move(id:string){
    let from=this.currentChip;
    let to=id;
    let audio = <HTMLVideoElement> document.getElementById("moveSound");
    audio.play();

    if(this.chipState[from[0]][from[1]] == 1 && parseInt(to[0])==0) //white->top
      this.chipState[from[0]][from[1]] = 10; //to king

    if(this.chipState[from[0]][from[1]] == 2 && parseInt(to[0])==7) //black->bot
      this.chipState[from[0]][from[1]] = 20; //to king

    this.chipState[to[0]][to[1]]=this.chipState[from[0]][from[1]];
    this.chipState[from[0]][from[1]]=0;


    this.endTurn();
  }

  attack(id:string){
    this.moveAvailable=false;
    this.choiceLocked=false;
    let audio = <HTMLVideoElement> document.getElementById("moveSound");
    audio.play();

    let from=this.currentChip;
    let to= id;
    var becameKing=false; //to end early, no extra jump

    if(this.chipState[from[0]][from[1]] == 1 && parseInt(to[0])==0){//W->top
      this.chipState[from[0]][from[1]] = 10; //to king
      becameKing=true;
    }

    if(this.chipState[from[0]][from[1]] == 2 && parseInt(to[0])==7){ //B->bot
      this.chipState[from[0]][from[1]] = 20; //to king
      becameKing=true;
    }

    let team=this.chipState[from[0]][from[1]];


    let a=parseInt(from[0])-parseInt(id[0]);
    let b=parseInt(from[1])-parseInt(id[1]);
    //figuring out location of the captured piece
    if(a<0) a=parseInt(to[0])-1;
    else    a=parseInt(to[0])+1;
    if(b<0) b=parseInt(to[1])-1;
    else    b=parseInt(to[1])+1;

    let captured=a.toString()+b.toString();
    this.chipState[to[0]][to[1]]=team;//move piece
    this.chipState[from[0]][from[1]]=0;//delete original
    this.chipState[captured[0]][captured[1]]=0;//delete captured

    if(team==1 || team==10 ) this.blackCount--;
    else this.whiteCount--;    

    if(becameKing==true){ this.endTurn(); return;};

    let newId=to[0]+to[1]
    this.checkMove(newId,1)
  
    if(this.moveAvailable) this.choiceLocked=true;
    else this.endTurn();
  }

  //0 NW 1 NE 2 SW 3 SE
  checkDiag(id:string, direction:number, mode:number=0){
    let ver = parseInt(id[0]); 
    let hor = parseInt(id[1]);
    let team= this.chipState[ver][hor];

    switch(direction){ //this is a mess... i should rewrite this
      case 0: //NORTHWEST
        if((hor-1 != -1) && (ver-1 != -1)){ 
          let temp=this.chipState[ver-1][hor-1]
            if(team == temp) break;      

            if((hor-2 != -1) && (ver-2 != -1))
            if (temp!=0 && (team != temp && team!=temp*10 && team*10!=temp)){
              if(this.chipState[ver-2][hor-2]==0){
                this.attackState[ver-2][hor-2]=true;
                this.moveAvailable=true;
                break;
              }
            };

          if (mode==0)
            if(temp==0) this.moveState[ver-1][hor-1]=true;

          break;
        }
      break;

      case 1:   //NORTHEAST
      if((hor+1 != 8) && (ver-1 != -1)){
        let temp=this.chipState[ver-1][hor+1]

        if(team == temp) break;  
        
        if((hor+2 != -1) && (ver-2 != -1))
        if (temp!=0 && (team != temp && team!=temp*10 && team*10!=temp)){
            if(this.chipState[ver-2][hor+2]==0){
              this.attackState[ver-2][hor+2]=true;
              this.moveAvailable=true;
              break;
            }
          };

        if (mode==0)
          if(temp==0) this.moveState[ver-1][hor+1]=true;

        break;
      }
      break;

      case 2:   //SOUTHWEST
      if((hor-1 != -1) && (ver+1 != 8)){
        let temp=this.chipState[ver+1][hor-1]

        if(team == temp) break;  

        if((hor-2 != -1) && (ver+2 != 8))
          if (temp!=0 && (team != temp && team!=temp*10 && team*10!=temp)){
            if(this.chipState[ver+2][hor-2]==0){
              this.attackState[ver+2][hor-2]=true;
              this.moveAvailable=true;
              break;
            }
          };

        if (mode==0 && temp==0) {this.moveState[ver+1][hor-1]=true; break;}
      }
      break;

      case 3:   //SOUTHEAST
      if((hor+1 != 8) && (ver+1 != 8)){
       let temp = this.chipState[ver+1][hor+1]

        if(team == temp) break;  

        if((hor+2 != 8) && (ver+2 != 8))
          if (temp!=0 && (team != temp && team!=temp*10 && team*10!=temp)){
            if(this.chipState[ver+2][hor+2]==0){
              this.attackState[ver+2][hor+2]=true;
              this.moveAvailable=true;
              break;
            }
          };

        if (mode==0)
          if(temp==0) this.moveState[ver+1][hor+1]=true;
        break;
      }
      break;
    }
  }


  restart(): void{
    this.chipState=[ //STARTING STATE
      [0,2,0,2,0,2,0,2],
      [2,0,2,0,2,0,2,0],
      [0,2,0,2,0,2,0,2],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [1,0,1,0,1,0,1,0],
      [0,1,0,1,0,1,0,1],
      [1,0,1,0,1,0,1,0],
    ];
    this.moveState=[
      [false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false],
    ];
    this.attackState=[
      [false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false],
    ];
    this.whoseTurn=true;
    this.whiteCount=12;
    this.blackCount=12;
  }

  endTurn(): void{
    this.whoseTurn=!this.whoseTurn
    this.moveAvailable=false;
    this.choiceLocked=false;
    this.clearMoveStates();
  }

  clearMoveStates(): void{
    this.moveState=[
      [false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false],
    ];
    this.attackState=[
      [false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false],
      [false,false,false,false,false,false,false,false],
    ];
  }

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
  ) {

  }


  }
