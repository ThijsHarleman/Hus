import { GameRow } from "./gameRow";
import { GameVariables } from "./gameVariables";
import { Player } from "./player";

export interface GameBoard {
    gameRows: GameRow[];
    gameVariables: GameVariables;
    player1: Player;
    player2: Player;
}