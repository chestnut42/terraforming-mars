
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";

export class LagrangeObservatory implements IProjectCard {
    public cardType: CardType = CardType.AUTOMATED;
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.SPACE];
    public name: string = "Lagrange Observatory";
    public text: string = "Draw 1 card. Gain 1 victory point.";
    public description: string = "In a stationary orbit far from the planet, enabling very precise measurements.";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, game: Game) {
        player.cardsInHand.push(game.dealer.dealCard());
        player.victoryPoints++;
        return undefined;
    }
}
