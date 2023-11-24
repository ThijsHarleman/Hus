import { Injectable } from '@angular/core';
import * as saveAs from 'file-saver';
import { GameBoard } from 'src/model/gameBoard';
import { Play } from 'src/model/play';

@Injectable({
  providedIn: 'root'
})
export class FileDownloadService {

  constructor() { }

  download(games: GameBoard[]) {
   let file = new Blob(this.buildCsv(games), {type: "text/plain;charset=utf-8"});
    saveAs(file, "simulationResults.csv");
  }

  buildCsv(games: GameBoard[]): string[] {
    var csv: string[] = [];
    var gameNumber: number = 1;

    csv.push(this.getHeader());
    games.forEach(game => {
      csv = this.getLines(game, gameNumber, csv);
      gameNumber++;
    })
    
    return csv;
  }

  getBoardString(play: Play): string {
    var board: string = "";

    play.boardTurnEnd.forEach(seeds => {
      board += seeds + "/"
    })

    return board;
  }

  getHeader(): string {
    return "Game,Winner,Turn,Player,PickedRow,PickedPit,ScoreTurnStart,ScoreTurnEnd,BoardTurnEnd\r\n"
  }

  getLines(game: GameBoard, gameNumber: number, csv: string[]): string[] {    
    game.gameVariables.playHistory.forEach(play => {
      var line: string = gameNumber.toString() + ",";
      line += (game.gameVariables.winner!.id + 1) + ",";
      line += play.turn + ",";
      line += (play.player.id + 1) + ",";
      line += play.pickedGameRow.frontRow ? "front" + ",": "back" + ",";
      line += play.pickedPit.id + ",";
      line += play.scoreTurnStart + ",";
      line += play.scoreTurnEnd + ",";
      line += this.getBoardString(play) + "\r\n"

      csv.push(line);
    })

    return csv;
  }
}
