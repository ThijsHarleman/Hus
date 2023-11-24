import { GameRow } from "./gameRow";
import { Pit } from "./pit";
import { Player } from "./player";

export interface Play {
    player: Player;
    turn: number;
    pickedGameRow: GameRow;
    pickedPit: Pit;
    scoreTurnStart: number;
    scoreTurnEnd: number;
    boardTurnEnd: number[];
}