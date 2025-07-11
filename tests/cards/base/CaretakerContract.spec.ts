import {expect} from 'chai';
import {CaretakerContract} from '../../../src/server/cards/base/CaretakerContract';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {Phase} from '../../../src/common/Phase';
import {Greens} from '../../../src/server/turmoil/parties/Greens';
import {Reds} from '../../../src/server/turmoil/parties/Reds';
import {PoliticalAgendas} from '../../../src/server/turmoil/PoliticalAgendas';
import {Helion} from '../../../src/server/cards/corporation/Helion';
import {StormCraftIncorporated} from '../../../src/server/cards/colonies/StormCraftIncorporated';
import {testGame} from '../../TestGame';
import {setTemperature} from '../../TestingUtils';

describe('CaretakerContract', () => {
  let card: CaretakerContract;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new CaretakerContract();
    [game, player] = testGame(2);
  });

  it('Cannot play or act', () => {
    expect(card.canPlay(player)).is.not.true;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should play', () => {
    setTemperature(game, 0);
    expect(card.canPlay(player)).is.true;
  });

  it('Cannot act', () => {
    player.heat = 7;
    expect(card.canAct(player)).is.false;
    player.heat = 8;
    expect(card.canAct(player)).is.true;
  });
  it('Should act', () => {
    player.heat = 8;
    card.action(player);
    expect(player.heat).to.eq(0);
    expect(player.terraformRating).to.eq(21);
  });

  it('Cannot act if cannot afford reds tax', () => {
    [game, player] = testGame(1, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    game.phase = Phase.ACTION;

    turmoil.rulingParty = new Greens();
    player.heat = 8;
    PoliticalAgendas.setNextAgenda(turmoil, game);
    expect(card.canAct(player)).is.true;

    turmoil.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(turmoil, game);
    expect(card.canAct(player)).is.false;

    player.megaCredits = 2;
    expect(card.canAct(player)).is.false;
    player.megaCredits = 3;
    expect(card.canAct(player)).is.true;
  });

  it('Do not double-account heat with Helion using Reds tax', () => {
    const [game, player] = testGame(1, {turmoilExtension: true});
    const helion = new Helion();
    player.corporations.push(helion);
    helion.play(player);
    const turmoil = game.turmoil!;
    game.phase = Phase.ACTION;

    turmoil.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(turmoil, game);

    player.megaCredits = 3;
    player.heat = 8;
    expect(card.canAct(player)).is.true;

    player.megaCredits = 0;
    player.heat = 11;
    expect(card.canAct(player)).is.true;

    player.megaCredits = 0;
    player.heat = 8;
    expect(card.canAct(player)).is.false;
  });

  it('Can use Stormcraft Incorporated', () => {
    const stormcraft = new StormCraftIncorporated();
    player.corporations.push(stormcraft);
    stormcraft.play(player);
    stormcraft.resourceCount = 3;
    player.heat = 1;
    expect(card.canAct(player)).is.false;
    player.heat = 2;
    expect(card.canAct(player)).is.true;
  });
});
