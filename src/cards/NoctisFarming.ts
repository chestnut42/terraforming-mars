
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class NoctisFarming implements IProjectCard {
    public cost: number = 10;
    public tags: Array<Tags> = [Tags.PLANT, Tags.STEEL];
    public name: string = "Noctis Farming";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Requires -20C or warmer. Increase your mega credit production 1 step and gain 2 plants. Gain 1 victory point.";
    public description: string = "Utilizing the uniquely dense and moist atmosphere in the canyons of Noctis Labyrinthus";
    public canPlay(_player: Player, game: Game): boolean {
        return game.getTemperature() >= -20;
    }
    public play(player: Player, game: Game) {
        if (game.getTemperature() < -20) {
            throw "Requires -20C or warmer";
        }
        player.megaCreditProduction++;
        player.plants += 2;
        player.victoryPoints++;
        return undefined;
    }
}
