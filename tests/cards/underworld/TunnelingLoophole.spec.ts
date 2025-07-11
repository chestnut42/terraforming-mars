import {expect} from 'chai';
import {TunnelingLoophole} from '../../../src/server/cards/underworld/TunnelingLoophole';
import {testGame} from '../../TestGame';
import {cast, forceGenerationEnd, runAllActions} from '../../TestingUtils';
import {assertIsExcavationAction} from '../../underworld/underworldAssertions';
import {UnderworldExpansion} from '../../../src/server/underworld/UnderworldExpansion';

describe('TunnelingLoophole', () => {
  it('Should play', () => {
    const card = new TunnelingLoophole();
    const [game, player] = testGame(2, {underworldExpansion: true});

    player.playedCards.push(card);

    // By giving player one excavated space, it narrows the set of excavatable spaces in the assertion below.
    UnderworldExpansion.excavatableSpaces(player)[0].excavator = player;

    expect(card.canPlay(player)).is.false;
    player.tagsForTest = {earth: 1};
    expect(card.canPlay(player)).is.true;

    cast(card.play(player), undefined);

    expect(player.underworldData.corruption).eq(1);

    runAllActions(game);

    assertIsExcavationAction(player, player.popWaitingFor(), true);

    expect(UnderworldExpansion.excavatableSpaces(player)).has.length(59);
    forceGenerationEnd(game);
    expect(UnderworldExpansion.excavatableSpaces(player)).has.length(4);
  });
});
