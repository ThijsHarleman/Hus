import { Pit } from "./pit";
import { Play } from "./play";
import { Player } from "./player";

export interface GameVariables {
    allowClick: boolean;
    boardBackup: number[];
    boardWidth: string;
    calculatingPlay: boolean;
    gameOver: boolean;
    lastPlay: Play | undefined;
    playHistory: Play[];
    previousPits: Pit[];
    seedsToSow: number;
    turnNumber: number;
    winner: Player | undefined;
}