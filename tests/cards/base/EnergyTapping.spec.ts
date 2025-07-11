import {expect} from 'chai';
import {EnergyTapping} from '../../../src/server/cards/base/EnergyTapping';
import {IGame} from '../../../src/server/IGame';
import {SelectPlayer} from '../../../src/server/inputs/SelectPlayer';
import {TestPlayer} from '../../TestPlayer';
import {Resource} from '../../../src/common/Resource';
import {runAllActions, cast} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {PowerPlant} from '../../../src/server/cards/base/PowerPlant';

describe('EnergyTapping', () => {
  let card: EnergyTapping;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new EnergyTapping();
    [game, player, player2] = testGame(2);
  });

  it('play - no targets', () => {
    player.playedCards.push(card, new PowerPlant());
    expect(card.canPlay(player)).is.true;

    card.play(player);
    runAllActions(game);

    expect(player.production.energy).to.eq(1);

    const selectPlayer = cast(player.popWaitingFor(), SelectPlayer);
    expect(selectPlayer.players).deep.eq([player]);
    selectPlayer.cb(player);
    runAllActions(game);
    expect(player.production.energy).to.eq(0);
    expect(player2.production.energy).to.eq(0);
  });

  it('play - auto select if single target', () => {
    player2.production.override({energy: 1});

    card.play(player);

    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
    expect(player.production.energy).to.eq(1);
    expect(player2.production.energy).to.eq(0);
  });

  it('play - multiple targets', () => {
    player.production.add(Resource.ENERGY, 2);
    player2.production.add(Resource.ENERGY, 3);

    card.play(player);

    runAllActions(game);
    const selectPlayer = cast(player.popWaitingFor(), SelectPlayer);
    selectPlayer.cb(player2);

    runAllActions(game);

    expect(player.production.energy).to.eq(3);
    expect(player2.production.energy).to.eq(2);
  });

  it('Playable in solo mode', () => {
    [game, player] = testGame(1);
    card.play(player);

    runAllActions(game);
    cast(player.popWaitingFor(), undefined);

    expect(player.production.energy).to.eq(1);
    expect(card.getVictoryPoints(player)).to.eq(-1);
  });
});
