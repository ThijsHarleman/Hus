import { Pit } from "./pit";
import { Player } from "./player";

export interface GameRow {
    player: Player;
    frontRow: boolean;
    pits: Pit[];
}