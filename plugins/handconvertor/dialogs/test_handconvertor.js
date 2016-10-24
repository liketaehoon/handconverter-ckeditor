CKEDITOR =
{
	dialog : {
		add : function(){}
	}
};

var fs = require('fs');
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
'boards [Ad 7d 3c 6h 9d] \n'+
'Seat 1: Odintsov Spb (button) folded before Flop (didn\'t bet) \n'+
'Seat 2: bengozoli (small blind) folded before Flop \n'+
'Seat 3: liketaehoon (big blind) showed [4c 3d 6s 5d] and won ($18.71) with a flush, Ace high \n'+
'Seat 4: gordo chuno showed [As 9h Ah 4s] and lost with three of a kind, Aces \n'+
'Seat 5: ARMPOKER folded before Flop (didn\'t bet) \n'+
'Seat 6: justtme folded on the Turn ';

module.exports = {
	setUp : function(callback) {
		this.detector = handconvertor.detector;
		callback();
	},
	tearDown : function(callback) {
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

		test.equal(result.preflop.hero_position,'BB');
		test.equal(result.preflop.hero_holecard,'4c 3d 6s 5d');
		test.equal(result.preflop.actions.length,6);
		test.equal(result.preflop.actions[0].content, "UTG raises to $0.35");
		test.equal(result.preflop.actions[1].content, "MP folds");
		test.equal(result.preflop.actions[2].content, "CO calls $0.35");
		test.equal(result.preflop.actions[3].content, "BN folds");
		test.equal(result.preflop.actions[4].content, "SB folds");
		test.equal(result.preflop.actions[5].content, "Hero calls $0.25");

		test.equal(result.flop.actions.length,4);
		test.equal(result.flop.boards,'Ad 7d 3c');
		test.equal(result.flop.actions[0].content, "Hero checks");
		test.equal(result.flop.actions[1].content, "UTG bets $0.40");
		test.equal(result.flop.actions[2].content, "CO calls $0.40");
		test.equal(result.flop.actions[3].content, "Hero calls $0.40");

		test.equal(result.turn.actions.length,3);
		test.equal(result.turn.boards,'Ad 7d 3c 6h');
		test.equal(result.turn.actions[0].content, "Hero bets $2.20");
		test.equal(result.turn.actions[1].content, "UTG calls $2.20");
		test.equal(result.turn.actions[2].content, "CO folds");

		test.equal(result.river.actions.length,3);
		test.equal(result.river.boards,'Ad 7d 3c 6h 9d');
		test.equal(result.river.actions[0].content, "Hero checks");
		test.equal(result.river.actions[1].content, "UTG bets $6.42");
		test.equal(result.river.actions[2].content, "Hero calls $6.42");

		test.equal(result.summary.results.length,3);
		test.equal(result.summary.results[0].content, "Hero won ($18.71) with a flush, Ace high");
		test.equal(result.summary.results[1].content, "UTG lost with three of a kind, Aces");
		test.equal(result.summary.results[2].content, "Rake $0.83");
		test.done();
	},
	testPokerStarsPLOPot : function(test) {

		var parser = handconvertor.detector.detect(psOmahaHistory);
		test.ok(parser !== null);
		test.equal(parser.name , 'Pokerstars');
		var result = parser.parse(psOmahaHistory);
		test.equal(result.pots.length, 5);
		test.equal(result.pots[0], 0.15); // pre 0.95
		test.equal(result.pots[1], 1.10); // flop 1.2
		test.equal(result.pots[2], 2.30); // turn 4.4
		test.equal(result.pots[3], 6.70); // river 12.84
		test.equal(result.pots[4], 19.54); // final
		test.done();
	},
	testPokerStarsHeadsUp : function(test) {
		var history = fs.readFileSync('./hands/headsup', 'utf-8');
		var parser = handconvertor.detector.detect(history);
		test.ok(parser !== null);
		test.equal(parser.name , 'Pokerstars');

		var result = parser.parse(history);
		test.equal(result.info.blinds, '$0.05/$0.10');
		test.equal(result.info.player_number, 2);
		test.equal(result.players.length,2);

		test.equal(result.players[0].name, 'TonySo999');
		test.equal(result.players[0].stack, '$11.31');
		test.equal(result.players[0].position, 'BN/SB');
		test.equal(result.players[0].is_hero, false);
		test.equal(result.players[0].has_action, true);

		test.equal(result.players[1].name, 'liketaehoon');
		test.equal(result.players[1].stack, '$10');
		test.equal(result.players[1].position, 'BB');
		test.equal(result.players[1].is_hero, true);
		test.equal(result.players[1].has_action, true);


		test.equal(result.preflop.hero_position,'BB');
		test.equal(result.preflop.hero_holecard,'4h 8c Ts Jd');
		test.equal(result.preflop.actions.length,2);
		test.equal(result.preflop.actions[0].content, "BN/SB calls $0.05");
		test.equal(result.preflop.actions[1].content, "Hero checks");

		test.equal(result.flop.actions.length,3);
		test.equal(result.flop.boards,'6h Kh Ks');
		test.equal(result.flop.actions[0].content, "Hero checks");
		test.equal(result.flop.actions[1].content, "BN/SB bets $0.10");
		test.equal(result.flop.actions[2].content, "Hero folds");

		test.equal(result.turn.actions, undefined );
		test.equal(result.riveractions, undefined);

		test.equal(result.summary.results.length,2);
		if(result.summary.results.length == 2) {
			test.equal(result.summary.results[0].content, "BN/SB collected ($0.19)");
			test.equal(result.summary.results[1].content, "Rake $0.01");
		}
		test.equal(result.pots.length, 5);
		if(result.pots.length == 5) {
			test.equal(result.pots[0], 0.15); // pre
			test.equal(result.pots[1], 0.20); // flop
			test.equal(result.pots[2], 0.20); // turn
			test.equal(result.pots[3], 0.20); // river
			test.equal(result.pots[4], 0.20); // final
		}
		test.done();
	},
	testPokerStarsFullingNLHE : function(test) {
		var history = fs.readFileSync('./hands/fullring_nlhe', 'utf-8');
		var parser = handconvertor.detector.detect(history);
		test.ok(parser !== null);
		test.equal(parser.name , 'Pokerstars');

		var result = parser.parse(history);

		test.equal(result.info.blinds, '$0.01/$0.02');
		test.equal(result.info.player_number, 9);
		test.equal(result.players.length,9);

		test.equal(result.players[0].name, 'PZR-W');
		test.equal(result.players[0].stack, '$2.60');
		test.equal(result.players[0].position, 'BN');
		test.equal(result.players[0].is_hero, false);
		test.equal(result.players[0].has_action, false);

		test.equal(result.players[1].name, 'liketaehoon');
		test.equal(result.players[1].stack, '$2');
		test.equal(result.players[1].position, 'SB');
		test.equal(result.players[1].is_hero, true);
		test.equal(result.players[1].has_action, true);


		test.equal(result.players[2].name, 'Jeime_Lan');
		test.equal(result.players[2].stack, '$2.07');
		test.equal(result.players[2].position, 'BB');
		test.equal(result.players[2].is_hero, false);
		test.equal(result.players[2].has_action, false);


		test.equal(result.players[3].name, 'Perez0107');
		test.equal(result.players[3].stack, '$2.28');
		test.equal(result.players[3].position, 'UTG');
		test.equal(result.players[3].is_hero, false);
		test.equal(result.players[3].has_action, false);

		test.equal(result.players[4].name, 'iGelly');
		test.equal(result.players[4].stack, '$2.59');
		test.equal(result.players[4].position, 'UTG+1');
		test.equal(result.players[4].is_hero, false);
		test.equal(result.players[4].has_action, true);


		test.equal(result.players[5].name, 'H!TM@N1989');
		test.equal(result.players[5].stack, '$2');
		test.equal(result.players[5].position, 'MP');
		test.equal(result.players[5].is_hero, false);
		test.equal(result.players[5].has_action, false);


		test.equal(result.players[6].name, 'Spoonerrull');
		test.equal(result.players[6].stack, '$1.32');
		test.equal(result.players[6].position, 'MP+1');
		test.equal(result.players[6].is_hero, false);
		test.equal(result.players[6].has_action, false);


		test.equal(result.players[7].name, 'gonzo799');
		test.equal(result.players[7].stack, '$1.77');
		test.equal(result.players[7].position, 'MP+2');
		test.equal(result.players[7].is_hero, false);
		test.equal(result.players[7].has_action, false);


		test.equal(result.players[8].name, 'puurwart');
		test.equal(result.players[8].stack, '$0.97');
		test.equal(result.players[8].position, 'CO');
		test.equal(result.players[8].is_hero, false);
		test.equal(result.players[8].has_action, false);


		test.equal(result.preflop.hero_position,'SB');
		test.equal(result.preflop.hero_holecard,'9c 7c');
		test.equal(result.preflop.actions.length,9);
		test.equal(result.preflop.actions[0].content, "UTG folds");
		test.equal(result.preflop.actions[1].content, "UTG+1 raises to $0.05");
		test.equal(result.preflop.actions[2].content, "MP folds");
		test.equal(result.preflop.actions[3].content, "MP+1 folds");
		test.equal(result.preflop.actions[4].content, "MP+2 folds");
		test.equal(result.preflop.actions[5].content, "CO folds");
		test.equal(result.preflop.actions[6].content, "BN folds");
		test.equal(result.preflop.actions[7].content, "Hero calls $0.04");
		test.equal(result.preflop.actions[8].content, "BB folds");

		test.equal(result.flop.actions.length,3);
		test.equal(result.flop.boards,'5d Jc Ac');
		test.equal(result.flop.actions[0].content, "Hero checks");
		test.equal(result.flop.actions[1].content, "UTG+1 bets $0.08");
		test.equal(result.flop.actions[2].content, "Hero calls $0.08");

		test.equal(result.turn.actions.length,3);
		test.equal(result.turn.boards,'5d Jc Ac 5c');
		test.equal(result.turn.actions[0].content, "Hero checks");
		test.equal(result.turn.actions[1].content, "UTG+1 bets $0.20");
		test.equal(result.turn.actions[2].content, "Hero calls $0.20");

		test.equal(result.river.actions.length,2);
		test.equal(result.river.boards,'5d Jc Ac 5c Ts');
		test.equal(result.river.actions[0].content, "Hero checks");
		test.equal(result.river.actions[1].content, "UTG+1 checks");

		test.equal(result.summary.results.length,2);
		if(result.summary.results.length == 2) {
			test.equal(result.summary.results[0].content, "Hero won ($0.66) with a flush, Ace high");
			test.equal(result.summary.results[1].content, "Rake $0.02");
		}
		test.equal(result.pots.length, 5);
		if(result.pots.length == 5) {
			test.equal(result.pots[0], 0.03); // pre
			test.equal(result.pots[1], 0.12); // flop
			test.equal(result.pots[2], 0.28); // turn
			test.equal(result.pots[3], 0.68); // river
			test.equal(result.pots[4], 0.68); // final
		}
		test.done();
	},
	testPSFreeFold : function(test) {

			var history = fs.readFileSync('./hands/pokerstars_free_fold', 'utf-8');
			var parser = handconvertor.detector.detect(history);
			test.ok(parser !== null);
			test.equal(parser.name , 'Pokerstars');

			var result = parser.parse(history);

			test.equal(result.info.blinds, '$0.10/$0.25');
			test.equal(result.info.player_number, 6);
			test.equal(result.players.length,6);

			test.equal(result.players[0].name, 'geert89');
			test.equal(result.players[0].stack, '$64.68');
			test.equal(result.players[0].position, 'BN');
			test.equal(result.players[0].is_hero, false);
			test.equal(result.players[0].has_action, false);

			test.equal(result.players[1].name, 'liketaehoon');
			test.equal(result.players[1].stack, '$62.86');
			test.equal(result.players[1].position, 'SB');
			test.equal(result.players[1].is_hero, true);
			test.equal(result.players[1].has_action, false);


			test.equal(result.players[2].name, 'SSSciakalaka');
			test.equal(result.players[2].stack, '$54.21');
			test.equal(result.players[2].position, 'BB');
			test.equal(result.players[2].is_hero, false);
			test.equal(result.players[2].has_action, false);


			test.equal(result.players[3].name, 'WPROHU');
			test.equal(result.players[3].stack, '$13.05');
			test.equal(result.players[3].position, 'UTG');
			test.equal(result.players[3].is_hero, false);
			test.equal(result.players[3].has_action, false);

			test.equal(result.players[4].name, 'whiteh_awk87');
			test.equal(result.players[4].stack, '$14.33');
			test.equal(result.players[4].position, 'MP');
			test.equal(result.players[4].is_hero, false);
			test.equal(result.players[4].has_action, false);


			test.equal(result.players[5].name, 'tessuntiger');
			test.equal(result.players[5].stack, '$29.91');
			test.equal(result.players[5].position, 'CO');
			test.equal(result.players[5].is_hero, false);
			test.equal(result.players[5].has_action, false);


			test.equal(result.preflop.hero_position,'SB');
			test.equal(result.preflop.hero_holecard,'Jc Qh 8d 7h');
			test.equal(result.preflop.actions.length,6);
			test.equal(result.preflop.actions[0].content, "UTG folds");
			test.equal(result.preflop.actions[1].content, "MP folds");
			test.equal(result.preflop.actions[2].content, "CO folds");
			test.equal(result.preflop.actions[3].content, "BN raises to $0.85");
			test.equal(result.preflop.actions[4].content, "Hero folds");
			test.equal(result.preflop.actions[5].content, "BB folds");

			test.equal(result.flop.actions, undefined );
			test.equal(result.turn.actions, undefined );
			test.equal(result.river.actions, undefined );

			test.equal(result.summary.results.length,2);
			if(result.summary.results.length == 2) {
				test.equal(result.summary.results[0].content, "BN collected ($0.60)");
				test.equal(result.summary.results[1].content, "Rake $0");
			}
			test.equal(result.pots.length, 5);
			if(result.pots.length == 5) {
				test.equal(result.pots[0], 0.35); // pre
				test.equal(result.pots[1], 0.35); // flop
				test.equal(result.pots[2], 0.35); // turn
				test.equal(result.pots[3], 0.35); // river
				test.equal(result.pots[4], 0.35); // final
			}
			test.done();
	},
	testPartialExpectError : function(test) {
			var history = fs.readFileSync('./hands/pokerstars_partial', 'utf-8');
			var parser = handconvertor.detector.detect(history);
			test.ok(parser !== null);
			test.equal(parser.name , 'Pokerstars');

			var result = null;
			try {
				result = parser.parse(history);
			}
			catch (e1) {
			}
			test.equal(result,null);
			test.done();
	},
	testPartialNoSummary : function(test) {
			var history = fs.readFileSync('./hands/pokerstars_partial_no_summary', 'utf-8');
			var parser = handconvertor.detector.detect(history);
			test.ok(parser !== null);
			test.equal(parser.name , 'Pokerstars');

			var result = null;
			try {
				result = parser.parse(history);
			}
			catch (e1) {
				console.log(e1);
			}
			test.ok(result !== null);
			test.done();
	},
	testPokerStarsAnteGame : function(test) {
			var history = fs.readFileSync('./hands/pokerstars_with_ante', 'utf-8');
			var parser = handconvertor.detector.detect(history);
			test.ok(parser !== null);
			test.equal(parser.name , 'Pokerstars');

			var result = null;
			try {
				result = parser.parse(history);
			}
			catch (e1) {
				console.log(e1);
			}
			test.ok(result !== null);
			test.done();
	},
	testPokerStarsMTT : function(test) {
			var history = fs.readFileSync('./hands/pokerstars/mtt', 'utf-8');
			var parser = handconvertor.detector.detect(history);
			test.ok(parser !== null);
			test.equal(parser.name , 'Pokerstars');

			var result = null;
			try {
				result = parser.parse(history);
			}
			catch (e1) {
				console.log(e1);
			}
			test.ok(result !== null);
			test.done();
	},
	// testACRNLHE : function(test) {
	// 			var history = fs.readFileSync('./hands/wpn_acr', 'utf-8');
	// 			var parser = handconvertor.detector.detect(history);
	// 			test.ok(parser !== null);
	// 			test.equal(parser.name , 'WPN');
	//
	// 			var result = parser.parse(history);
	//
	// 			test.equal(result.info.blinds, '$0.05/$0.10');
	// 			test.equal(result.info.player_number, 4);
	// 			test.equal(result.players.length,4);
	//
	// 			test.equal(result.players[0].name, 'slivy');
	// 			test.equal(result.players[0].stack, '$9.51');
	// 			test.equal(result.players[0].position, 'BN');
	// 			test.equal(result.players[0].is_hero, false);
	// 			test.equal(result.players[0].has_action, true);
	//
	// 			test.equal(result.players[1].name, 'CrunkPro');
	// 			test.equal(result.players[1].stack, '$10.24');
	// 			test.equal(result.players[1].position, 'SB');
	// 			test.equal(result.players[1].is_hero, false);
	// 			test.equal(result.players[1].has_action, false);
	//
	//
	// 			test.equal(result.players[2].name, 'IOPCHAN');
	// 			test.equal(result.players[2].stack, '$10');
	// 			test.equal(result.players[2].position, 'BB');
	// 			test.equal(result.players[2].is_hero, true);
	// 			test.equal(result.players[2].has_action, true);
	//
	//
	// 			test.equal(result.players[3].name, 'AlwaysNutted');
	// 			test.equal(result.players[3].stack, '$23.30');
	// 			test.equal(result.players[3].position, 'CO');
	// 			test.equal(result.players[3].is_hero, false);
	// 			test.equal(result.players[3].has_action, false);
	//
	// 			test.equal(result.preflop.hero_position,'BB');
	// 			test.equal(result.preflop.hero_holecard,'Kd As');
	// 			test.equal(result.preflop.actions.length,5);
	// 			test.equal(result.preflop.actions[0].content, "CO folds");
	// 			test.equal(result.preflop.actions[1].content, "BN raises ($0.30)");
	// 			test.equal(result.preflop.actions[2].content, "SB folds");
	// 			test.equal(result.preflop.actions[3].content, "Hero raises ($0.95)");
	// 			test.equal(result.preflop.actions[4].content, "BN calls");
	//
	// 			test.equal(result.flop.boards,"5h Kh 10d");
	// 			test.equal(result.flop.actions.length,2);
	// 			test.equal(result.flop.actions[0].content, "Hero bets ($1.20)");
	// 			test.equal(result.flop.actions[1].content, "BN calls ($1.20)");
	//
	//
	// 			test.equal(result.turn.boards,"5h Kh 10d Ah");
	// 			test.equal(result.turn.actions.length,2);
	// 			test.equal(result.turn.actions[0].content, "Hero bets ($2.20)");
	// 			test.equal(result.turn.actions[1].content, "BN calls ($2.20)");
	//
	//
	// 			test.equal(result.river.boards,"5h Kh 10d Ah Ks");
	// 			test.equal(result.river.actions.length,2);
	// 			test.equal(result.river.actions[0].content, "Hero allin ($5.55)");
	// 			test.equal(result.river.actions[1].content, "BN folds");
	//
	// 			test.equal(result.summary.results.length,2);
	// 			if(result.summary.results.length == 2) {
	// 				test.equal(result.summary.results[0].content, "BN Loeses ($4.45)");
	// 				test.equal(result.summary.results[0].content, "Hero collected ($4.06)");
	// 				test.equal(result.summary.results[1].content, "Rake $0.30.");
	// 			}
	// 			test.equal(result.pots.length, 5);
	// 			if(result.pots.length == 5) {
	// 				test.equal(result.pots[0], 0.15); // pre
	// 				test.equal(result.pots[1], 1.95); // flop
	// 				test.equal(result.pots[2], 4.35); // turn
	// 				test.equal(result.pots[3], 8.75); // river
	// 				test.equal(result.pots[4], 8.75); // final
	// 			}
	// 			test.done();
	// },
};
