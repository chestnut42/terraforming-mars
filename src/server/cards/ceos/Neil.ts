import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {all} from '../Options';
import {Tag} from '../../../common/cards/Tag';
import {ICard} from '../ICard';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {Resource} from '../../../common/Resource';

export class Neil extends CeoCard {
  constructor() {
    super({
      name: CardName.NEIL,
      metadata: {
        cardNumber: 'L34',
        renderData: CardRenderer.builder((b) => {
          b.effect('Gain 1 M€ when any player plays a Moon tag.', (eb) => eb.tag(Tag.MOON, {all}).startEffect.megacredits(1));
          b.br.br;
          b.opgArrow().production((pb) => pb.megacredits(1, {text: '?'})).asterix();
        }),
        description: 'Once per game, increase your M€ production by the value of the LOWEST Moon rate.',
      },
    });
  }

  public onCardPlayedByAnyPlayer(thisCardOwner: IPlayer, card: ICard) {
    for (const tag of card.tags) {
      if (tag === Tag.MOON) {
        thisCardOwner.game.getCardPlayerOrThrow(this.name).stock.add(Resource.MEGACREDITS, 1, {log: true});
      }
    }
    return undefined;
  }

  public action(player: IPlayer): PlayerInput | undefined {
    this.isDisabled = true;
    const game = player.game;
    MoonExpansion.ifMoon(game, (moonData) => {
      const lowestRate = Math.min(moonData.habitatRate, moonData.logisticRate, moonData.miningRate);

      if (lowestRate > 0) {
        player.production.add(Resource.MEGACREDITS, lowestRate, {log: true});
      }
    });

    return undefined;
  }
}
