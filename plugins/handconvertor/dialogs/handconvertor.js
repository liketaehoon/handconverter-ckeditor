function createElement(editor, tagName, className, text, parent) {
  var element = editor.document.createElement(tagName);
  if(className){
    var classNames = className.split(' ');
    for (var idx in classNames) {
      element.addClass(classNames[idx]);
    }
  }
  if(text) {
    element.appendHtml(text);
  }
  if(parent) {
    parent.append(element);
  }
  return element;
}

function generateGameTitle(editor, history, mainDom) {

  console.log(history.raw);

  // step 1 find hero informations ( PlayeName )
  var rx = /Dealt to [A-Za-z0-9]*/g;
  var username= rx.exec(history.raw)[0].replace('Dealt to ','').trim();
  var blind =/\$[0-9.]*\/\$[0-9.]*/g.exec(history.raw)[0];
  console.log(username);
  console.log(blind);

  var seats = /Seat [1-9]:[ A-z($0-9.]*\)\n/g.exec(history.raw);
  console.log(/Seat [1-9]:[ A-z($0-9.]*\)\n/g.exec(history.raw));


  // var blinds = historyRows.rows[0];

}

CKEDITOR.dialog.add( 'hcDialog', function( editor ) {
  return {
    title: '포커투데이 핸드 컨버터',
    minWidth: 400,
    minHeight: 400,
    contents: [
      {
        id: 'main',
        elements: [
          {
            type: 'textarea',
            minHeight: 500,
            rows : 30,
            id: 'history',
            label: '핸드 히스토리를 써주세요.',
            validate: CKEDITOR.dialog.validate.notEmpty( "핸드를 입력해주세요." ),
            style:'height:500px',
          },
        ]
      },
    ],
    onOk: function() {
      var dialog = this;
      console.log(dialog);
      console.log(dialog.element);
      globalDialog = dialog;


      var main = createElement(editor, 'section', 'hand-content', null, null);
      var handHistory = createElement(editor, 'div', 'hand-history', null, main);
      var rawHistory = dialog.getValueOf( 'main', 'history' ).trim();
      var detector = new PokerRoomDetector();
      var parser = detector.detect(rawHistory);
      if(parser === null) {
        alert("해당 포커룸은 현재 지원하지 않습니다.\n자유게시판에 핸드히스토리를 남겨주시면 확인하겠습니다.");
        return;
      }
      try {
        var data = parser.parse(rawHistory);
        new Renderer().render(editor, main, data);
        editor.insertElement( main );
      }
      catch (e1) {
        console.error(e1);
        alert("핸드컨버팅중 오류가 발생했습니다.\n자유게시판에 핸드히스토리를 남겨주시면 확인하겠습니다.");
        return;
      }
    }
  };
});

var Renderer = function() {};
Renderer.prototype.renderCards = function(editor, dom, holecards) {

  var splits = holecards.split(' ');
  for(var idx in splits) {
    var card = splits[idx];
    switch(card[1]) {
      case 'c' :
        createElement(editor,'span', 'card-value club', card[0], dom);
        break;
      case 'd' :
        createElement(editor,'span', 'card-value diamond', card[0], dom);
        break;
      case 'h' :
        createElement(editor,'span', 'card-value heart', card[0], dom);
        break;
      case 's' :
        createElement(editor,'span', 'card-value spade', card[0], dom);
        break;
    }
  }
};

Renderer.prototype.renderStreet = function(editor, dom, is_tournament, pot, streetData, streetName) {
  var section = createElement(editor, 'div', 'section', null, dom);
  var street = createElement(editor, 'div', 'street', null, section);
  createElement(editor, 'span', 'street-title', streetName, street);
  if(is_tournament) {
    createElement(editor, 'span', 'street-money', "("+pot+")", street);
  }
  else {
    createElement(editor, 'span', 'street-money', "($"+pot+")", street);
  }

  if(streetData.hero_holecard) {
    var heroHoleCard =  createElement(editor, 'span', '', null, street);
    createElement(editor,'strong', '', 'Hero' , heroHoleCard);
    heroHoleCard.appendHtml(' is ' + streetData.hero_position+ ' with ');
    this.renderCards(editor,heroHoleCard, streetData.hero_holecard);
  }
  else if (streetData.boards) {
    this.renderCards(editor,street, streetData.boards);
  }
  this.renderActions(editor,street, streetData.actions);
  createElement(editor, 'br', '', null, dom);
};

Renderer.prototype.renderActions = function(editor, dom, actions) {
  var actionWrapper = createElement(editor, 'div', 'actions_wrapper', null, dom);
  var actionsDiv = createElement(editor, 'div', 'actions', null, actionWrapper);
  for(var idx in actions) {
    var action = actions[idx];
    var is_primary = false;
    var actionClass = 'street-action';
    if(action.content.indexOf('Hero') > -1) {
      actionClass = 'street-action';
    }
    else if(action.content.indexOf('bet') > -1) {
      actionClass = 'street-action primary';
    }
    else if(action.content.indexOf('raises') > -1) {
      actionClass = 'street-action primary';
    }
    var position = action.content.substring(0,action.content.indexOf(' '));
    var actionTxt = action.content.substring(action.content.indexOf(' '), action.content.length);

    var streetAction = createElement(editor,'span', actionClass, null, actionsDiv);
    var seatName = createElement(editor,'span', 'seat-name', null, streetAction);
    createElement(editor,'strong', '', position, seatName);
    createElement(editor,'span', 'value-container', actionTxt, streetAction);

    if(idx != actions.length-1) {
      createElement(editor,'span', 'seperator', ', ', streetAction);
    }
  }
};
Renderer.prototype.render = function(editor, mainDom, data) {
  var blindSection = createElement(editor, 'div', 'section', null, mainDom);
  var titleBlock = createElement(editor, 'div', 'title-block', null, blindSection);
  var gameTitle = createElement(editor, 'span', 'game-title', null, titleBlock);
  createElement(editor, 'span', 'game-blinds', 'Blinds: ' + data.info.blinds, gameTitle);
  gameTitle.appendText(' ('+data.info.player_number+' Players)');

  for (var idx in data.players) {
    var player = data.players[idx];

    var content = player.position+': '+player.stack;
    if(player.is_hero) {
      content += ' (Hero)';
    }

    if(player.is_hero || player.has_action) {
      content = '<strong>'+content+'</strong>';
    }

    createElement(editor, 'span', player.is_hero ? 'seat-name primary' : 'seat-name', content, titleBlock);
    if(idx != (data.players.length-1)) {
      createElement(editor, 'br', null, null, titleBlock);
    }
  }
  createElement(editor, 'br', '', null, mainDom);

  this.renderStreet(editor,mainDom, data.is_tournament, data.pots[0], data.preflop, 'PreFlop');
  if(data.flop.actions) {
    this.renderStreet(editor,mainDom, data.is_tournament, data.pots[1], data.flop, 'Flop');
  }
  if(data.turn.actions) {
    this.renderStreet(editor,mainDom, data.is_tournament,  data.pots[2], data.turn, 'Turn');
  }
  if(data.river.actions) {
    this.renderStreet(editor,mainDom, data.is_tournament, data.pots[3], data.river, 'River');
  }
  if(data.summary) {
    var section = createElement(editor, 'div', 'section', null, mainDom);
    var street = createElement(editor, 'div', 'street', null, section);
    createElement(editor, 'span', 'street-title', 'Final Pot', street);
    for(var summaryIdx in data.summary.results) {
      var result = data.summary.results[summaryIdx];
      createElement(editor,'span', 'street-action', result.content, street);
      createElement(editor,'br', '', null, street);
    }
  }
};

function CommonParser() {}
CommonParser.prototype.regExMultiple = function(regEx, contents) {
  var myArray;
  var results = [];
  while ((myArray = regEx.exec(contents)) !== null) {
    results.push(myArray[0]);
  }
  return results;
};
CommonParser.prototype.actionConvert = function(action, players) {
  var result = action.replace(':', '');
  result = this.replacePlayerName(result, players);
  if(result.indexOf('raises') > -1) {
    var splits = result.split(' ');
    result = result.replace(splits[2] + ' ', '');
  }
  return result.trim();
};

CommonParser.prototype.replacePlayerName = function(text, players) {
  for(var playerIdx in players) {
    var player = players[playerIdx];
    if(player.is_hero) {
      text = text.replace(player.name, 'Hero');
    }
    else {
      text = text.replace(player.name, player.position);
    }
  }
  return text;
};

var Pokerstars = function() { this.name  = 'Pokerstars'; };
Pokerstars.prototype = new CommonParser();
Pokerstars.prototype.parsePot = function(history, resultDic, players) {

  var result = [];
  var sum = 0.0;

  var splits = history.split('\n');
  var small_blind;
  var big_blind;

  for(var idx in splits) {
    var row = splits[idx];
    var moneys;
    // player 이름에 check/bet 등이 있는 경우를 대비해서 치환.
    row = this.replacePlayerName(row, players);

    if (row.indexOf('posts small blind') > -1) {
      moneys = this.regExMultiple(/[0-9.]+/g, row);
      moneys = moneys[moneys.length-1];
      small_blind = moneys;
      sum += parseFloat(moneys.replace('$',''));
    }
    else if (row.indexOf('posts big blind') > -1) {
      moneys = this.regExMultiple(/[0-9.]+/g, row);
      moneys = moneys[moneys.length-1];
      big_blind = moneys;
      sum += parseFloat(moneys.replace('$',''));
    }
    else if(row.indexOf('posts the ante') > -1) {
      moneys = this.regExMultiple(/[0-9.]+/g, row);
      moneys = moneys[moneys.length-1];
      sum += parseFloat(moneys.replace('$',''));
    }
    else if(row.indexOf('raises') > -1) {
      moneys = this.regExMultiple(/[0-9.]+/g, row);
      moneys = moneys[moneys.length-1];
      sum += parseFloat(moneys.replace('$',''));
    }
    else if(row.indexOf('bets') > -1 || row.indexOf('call') > -1) {
      moneys = this.regExMultiple(/[0-9.]+/g, row);
      moneys = moneys[moneys.length-1];
      sum += parseFloat(moneys.replace('$',''));
    }
    else if (row.indexOf('*** HOLE CARDS ***') > -1){
      result.push(sum.toFixed(2));
    }
    else if (row.indexOf('*** FLOP ***') > -1){
      result.push(sum.toFixed(2));
    }
    else if (row.indexOf('*** TURN ***') > -1){
      result.push(sum.toFixed(2));
    }
    else if (row.indexOf('*** RIVER ***') > -1){
      result.push(sum.toFixed(2));
    }
    else if (row.indexOf('*** SHOW DOWN ***') > -1){
      result.push(sum.toFixed(2));
      break;
    }
    continue;
  }
  if(result.length < 5) {
    for(var resultidx = result.length; resultidx < 5; resultidx++) {
      result.push(result[result.length-1]);
    }
  }
  resultDic.pots = result;
  if(resultDic.is_tournament) {
    resultDic.info.blinds = 't'+small_blind+'/t'+big_blind;
  }
  else {
    resultDic.info.blinds = '$'+small_blind+'/$'+big_blind+'';
  }
  return resultDic;
};

Pokerstars.prototype.parseActions = function(rows, players) {
  var actions = [];
  for(var idx in rows) {
    var pfAction = rows[idx];
    if (pfAction.trim().length < 1) {
      continue;
    }
    pfAction = this.replacePlayerName(pfAction, players);
    if(pfAction.indexOf('Uncalled bet') > -1) {
      continue;
    }
    if(pfAction.indexOf('collected') > -1) {
      continue;
    }
    if(pfAction.indexOf('show hand') > -1) {
      continue;
    }
    actions.push({ content : this.actionConvert(pfAction, players)});
  }
  return actions;
};
Pokerstars.prototype.parseBoard = function(row) {
  var holecards = this.regExMultiple(/[0-9ATJKQ][(s|c|d|h)]/g, row);
  return holecards.join(' ');
};
Pokerstars.prototype.parse = function(history) {

  var result = {};
  result.preflop = {};
  result.flop = {};
  result.turn = {};
  result.river = {};
  result.summary = {};
  result.summary.results = [];
  result.raw = history;
  result.is_tournament = history.indexOf('Tournament') > 0;
  var dealt_text = /Dealt to .* \[/g.exec(history)[0];
  var heroname = dealt_text.substring(0,dealt_text.length-1).replace('Dealt to ','').trim();
  var smallplayer = /.*: posts small blind/g.exec(history)[0];
  smallplayer = smallplayer.substring(0,smallplayer.indexOf(':')).trim();

  var seats = this.regExMultiple(/Seat [1-9]:.*\([\$0-9.]+ in chips\)/g, history);

  var players = [];
  var postflop_txt = history.substring(history.indexOf('*** FLOP'), history.indexOf('*** SUMMARY'));
  var smallidx = -1;
  for (var seatIdx in seats) {
    var seat = seats[seatIdx];
    var player = {};
    player.stack = /[\$0-9.]+/g.exec(seat.substring(seat.lastIndexOf('('), seat.length))[0];
    player.name=seat.substring(8,seat.lastIndexOf('(')).trim();
    player.is_hero = player.name == heroname;
    if(history.indexOf('*** FLOP') > -1) {
      player.has_action = postflop_txt.indexOf(player.name) > -1; // look into other history
    }
    else {
      player.has_action = false;
    }
    players.push(player);

    if (player.name == smallplayer) {
      smallidx = seatIdx;
    }
  }

  var position = [ 'SB', 'BB', 'UTG', 'MP', 'CO', 'BN'];
  if(players.length == 2) {
    position = [ 'BN/SB', 'BB' ];
  }
  else if(players.length == 9) {
    position = [ 'SB', 'BB', 'UTG', 'UTG+1', 'MP', 'MP+1', 'MP+2', 'CO', 'BN' ];
  }
  for ( var i = 0; i < players.length; i++ ){
    var playerloop = players[(parseInt(smallidx) + parseInt(i))%players.length];
    playerloop.position = position[i];
    if(playerloop.is_hero) {
      result.preflop.hero_position = position[i];
    }
  }

  result.info = { player_number : seats.length};
  result.players = players;

  // preflop
  var preflop_txt = history.substring(history.indexOf('*** HOLE CARDS'), history.indexOf('*** ',history.indexOf('*** HOLE CARDS ***')+19));
  var preflop_rows = preflop_txt.split('\n');
  var holecards = this.regExMultiple(/[0-9ATJKQ][(s|c|d|h)]/g, preflop_rows[1]);
  result.preflop.hero_holecard = holecards.join(' ');
  result.preflop.actions = [];
  result.preflop.actions = this.parseActions(preflop_rows.slice(2,preflop_rows.length), result.players);

  // flop
  if(history.indexOf('*** FLOP') > -1) {
    var floptext = history.substring(history.indexOf('*** FLOP'), history.indexOf('***', history.indexOf('*** FLOP ***') + 12));
    var floprows = floptext.split('\n');
    result.flop.boards = this.parseBoard(floprows[0]);
    result.flop.actions = this.parseActions(floprows.slice(1,floprows.length), result.players);
  }
  // turn
  if(history.indexOf('*** TURN') > -1) {
    var turntext = history.substring(history.indexOf('*** TURN'), history.indexOf('***', history.indexOf('*** TURN ***') + 12));
    var turnrows = turntext.split('\n');
    result.turn.boards = this.parseBoard(turnrows[0]);
    result.turn.actions = this.parseActions(turnrows.slice(1,turnrows.length), result.players);
  }
  // river
  if(history.indexOf('*** RIVER') > -1) {
    var rivertext = history.substring(history.indexOf('*** RIVER'), history.indexOf('***', history.indexOf('*** RIVER ***') + 13));
    var riverrows = rivertext.split('\n');
    result.river.boards = this.parseBoard(riverrows[0]);
    result.river.actions = this.parseActions(riverrows.slice(1,riverrows.length), result.players);
  }

  result = this.parsePot(history, result, players);

  var summarytext = history.substring(history.indexOf('*** SUMMARY'), history.length);

  var summaryrows = summarytext.split('\n');
  for (var summaryIdx in summaryrows) {
    var summaryrow = summaryrows[summaryIdx];
    if(summaryrow.indexOf('won') > -1 || summaryrow.indexOf('lost') > -1 || summaryrow.indexOf('collected') > -1 ) {
      var summaryPosition;
      for(var playerIdx in result.players) {
        var summaryPlayer = result.players[playerIdx];
        if(summaryrow.indexOf(summaryPlayer.name) > 0) {
          if(summaryPlayer.is_hero) {
            summaryPosition = 'Hero';
          }
          else {
            summaryPosition = summaryPlayer.position;
          }
          break;
        }
      }
      var txt = summaryPosition + ' ';
      if(summaryrow.indexOf('won') > -1) {
        txt += summaryrow.substring(summaryrow.indexOf('won'), summaryrow.length) ;
      }
      else if(summaryrow.indexOf('lost') > -1) {
        txt += summaryrow.substring(summaryrow.indexOf('lost'), summaryrow.length) ;
      }
      else if(summaryrow.indexOf('collected') > -1) {
        txt += summaryrow.substring(summaryrow.indexOf('collected'), summaryrow.length) ;
      }
      result.summary.results.push({ content : txt.trim()});
    }
  }
  if(result.is_tournament === false) {
    result.summary.results.push({ content : this.regExMultiple(/Rake \$[0-9.]*/g, summarytext)[0] });
  }
  return result;
};

var PokerRoomDetector = function() {};
PokerRoomDetector.prototype.detect = function(rawHistory) {
  if (rawHistory.indexOf('PokerStars') > -1) {
    return new Pokerstars();
  }
  else {
    return null;
  }
};

// for node unit testing
if(module) {
  module.exports = {
    detector : new PokerRoomDetector()
  };
}
