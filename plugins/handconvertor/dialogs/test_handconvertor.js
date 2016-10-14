CKEDITOR =
{
	dialog : {
		add : function(){}
	}
};

var handconvertor = require('./handconvertor.js');

var psOmahaHistory = 'PokerStars Zoom Hand #159780720453:  Omaha Pot Limit ($0.05/$0.10) - 2016/10/11 22:21:36 JST [2016/10/11 9:21:36 ET] \n'+
'Table \'Eulalia\' 6-max Seat #1 is the button \n \n'+
'Seat 1: Odintsov Spb ($10 in chips)  \n'+
'Seat 2: bengozoli ($3.75 in chips)  \n'+
'Seat 3: liketaehoon ($11.24 in chips)  \n'+
'Seat 4: gordo chuno ($28.31 in chips)  \n'+
'Seat 5: ARMPOKER ($10 in chips) \n'+
'Seat 6: justtme ($3.82 in chips) \n'+
'bengozoli: posts small blind $0.05 \n'+
'liketaehoon: posts big blind $0.10 \n'+
'*** HOLE CARDS *** \n'+
'Dealt to liketaehoon [4c 3d 6s 5d] \n'+
'gordo chuno: raises $0.25 to $0.35 \n'+
'ARMPOKER: folds \n'+
'justtme: calls $0.35 \n'+
'Odintsov Spb: folds \n'+
'bengozoli: folds \n'+
'liketaehoon: calls $0.25 \n'+
'*** FLOP *** [Ad 7d 3c] \n'+
'liketaehoon: checks \n'+
'gordo chuno: bets $0.40 \n'+
'justtme: calls $0.40 \n'+
'liketaehoon: calls $0.40 \n'+
'*** TURN *** [Ad 7d 3c] [6h] \n'+
'liketaehoon: bets $2.20 \n'+
'gordo chuno: calls $2.20 \n'+
'justtme: folds \n'+
'*** RIVER *** [Ad 7d 3c 6h] [9d] \n'+
'liketaehoon: checks \n'+
'gordo chuno: bets $6.42 \n'+
'liketaehoon: calls $6.42 \n'+
'*** SHOW DOWN *** \n'+
'gordo chuno: shows [As 9h Ah 4s] (three of a kind, Aces) \n'+
'liketaehoon: shows [4c 3d 6s 5d] (a flush, Ace high) \n'+
'liketaehoon collected $18.71 from pot \n'+
'*** SUMMARY *** \n'+
'Total pot $19.54 | Rake $0.83 \n'+
'Board [Ad 7d 3c 6h 9d] \n'+
'Seat 1: Odintsov Spb (button) folded before Flop (didn\'t bet) \n'+
'Seat 2: bengozoli (small blind) folded before Flop \n'+
'Seat 3: liketaehoon (big blind) showed [4c 3d 6s 5d] and won ($18.71) with a flush, Ace high \n'+
'Seat 4: gordo chuno showed [As 9h Ah 4s] and lost with three of a kind, Aces \n'+
'Seat 5: ARMPOKER folded before Flop (didn\'t bet) \n'+
'Seat 6: justtme folded on the Turn ';

module.exports = {
	setUp : function(callback) {
		callback();
	},
	tearDown : function(callback) {
		this.detector = handconvertor.detector;
		callback();
	},
	testPokerStarsPLO : function(test) {
		var parser = handconvertor.detector.detect(psOmahaHistory);
		test.ok(parser !== null);
		test.equal(parser.name , 'Pokerstars');
		var result = parser.parse(psOmahaHistory);

		test.equal(result.info.blinds, '$0.05/$0.10');
		test.equal(result.info.player_number, 6);
		test.equal(result.players.length,6);

		test.equal(result.players[0].name, 'Odintsov Spb');
		test.equal(result.players[0].stack, '$10');
		test.equal(result.players[0].position, 'BN');
		test.equal(result.players[0].is_hero, false);
		test.equal(result.players[0].has_action, false);

		test.equal(result.players[1].name, 'bengozoli');
		test.equal(result.players[1].stack, '$3.75');
		test.equal(result.players[1].position, 'SB');
		test.equal(result.players[1].is_hero, false);
		test.equal(result.players[1].has_action, false);

		test.equal(result.players[2].name, 'liketaehoon');
		test.equal(result.players[2].stack, '$11.24');
		test.equal(result.players[2].position, 'BB');
		test.equal(result.players[2].is_hero, true);
		test.equal(result.players[2].has_action, true);

		test.equal(result.players[3].name, 'gordo chuno');
		test.equal(result.players[3].stack, '$28.31');
		test.equal(result.players[3].position, 'UTG');
		test.equal(result.players[3].is_hero, false);
		test.equal(result.players[3].has_action, true);

		test.equal(result.players[4].name, 'ARMPOKER');
		test.equal(result.players[4].stack, '$10');
		test.equal(result.players[4].position, 'MP');
		test.equal(result.players[4].is_hero, false);
		test.equal(result.players[4].has_action, false);

		test.equal(result.players[5].name, 'justtme');
		test.equal(result.players[5].stack, '$3.82');
		test.equal(result.players[5].position, 'CO');
		test.equal(result.players[5].is_hero, false);
		test.equal(result.players[5].has_action, true);

		test.done();
	}
};
