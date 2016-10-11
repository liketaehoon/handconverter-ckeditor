function createElement(editor, tagName, className, text, parent) {
  var element = editor.document.createElement(tagName);
  if(className){
    element.addClass(className);
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



  var section = createElement(editor, 'div', 'section', null, mainDom);
  var titleBlock = createElement(editor, 'div', 'title-block', null, section);
  var gameTitle = createElement(editor, 'span', 'game-title', null, titleBlock);
  createElement(editor, 'span', 'game-blinds', 'Blinds: ' + blind, gameTitle);
  gameTitle.appendText(' (6 Players)');
  createElement(editor, 'span', 'seat-name', 'BN: $127.57', titleBlock);
  createElement(editor, 'br', null, null, titleBlock);
  createElement(editor, 'span', 'seat-name', 'SB: $207.99', titleBlock);
  createElement(editor, 'br', null, null, titleBlock);
  createElement(editor, 'span', 'seat-name', '<strong>BB: $169.50</strong>', titleBlock);
  createElement(editor, 'br', null, null, titleBlock);
  createElement(editor, 'span', 'seat-name', '<strong>UTG: $486.95 (Hero)</strong>', titleBlock);
  createElement(editor, 'br', null, null, titleBlock);
  createElement(editor, 'span', 'seat-name', 'MP: $145.42', titleBlock);
  createElement(editor, 'br', null, null, titleBlock);
  createElement(editor, 'span', 'seat-name', 'CO: $107.90', titleBlock);
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
            label: 'Raw 핸드 히스토리',
            validate: CKEDITOR.dialog.validate.notEmpty( "핸드를 입력해주세요." ),
            style:'height:500px',
            'default' : 'PokerStars Zoom Hand #159780720453:  Omaha Pot Limit ($0.05/$0.10) - 2016/10/11 22:21:36 JST [2016/10/11 9:21:36 ET] \n'+
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
'Seat 6: justtme folded on the Turn '

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
      var historyRaw = dialog.getValueOf( 'main', 'history' ).trim();
      var historyRows = { raw : historyRaw , rows : dialog.getValueOf( 'main', 'history' ).trim().split('\n'), proccessed : 0 };
      generateGameTitle(editor,historyRows, handHistory);
      editor.insertElement( main );
    }
  };
});


/* HAND SAMPLE PokerStars PLO

PokerStars Zoom Hand #159780720453:  Omaha Pot Limit ($0.05/$0.10) - 2016/10/11 22:21:36 JST [2016/10/11 9:21:36 ET]
Table 'Eulalia' 6-max Seat #1 is the button
Seat 1: Odintsov Spb ($10 in chips)
Seat 2: bengozoli ($3.75 in chips)
Seat 3: liketaehoon ($11.24 in chips)
Seat 4: gordo chuno ($28.31 in chips)
Seat 5: ARMPOKER ($10 in chips)
Seat 6: justtme ($3.82 in chips)
bengozoli: posts small blind $0.05
liketaehoon: posts big blind $0.10
*** HOLE CARDS ***
Dealt to liketaehoon [4c 3d 6s 5d]
gordo chuno: raises $0.25 to $0.35
ARMPOKER: folds
justtme: calls $0.35
Odintsov Spb: folds
bengozoli: folds
liketaehoon: calls $0.25
*** FLOP *** [Ad 7d 3c]
liketaehoon: checks
gordo chuno: bets $0.40
justtme: calls $0.40
liketaehoon: calls $0.40
*** TURN *** [Ad 7d 3c] [6h]
liketaehoon: bets $2.20
gordo chuno: calls $2.20
justtme: folds
*** RIVER *** [Ad 7d 3c 6h] [9d]
liketaehoon: checks
gordo chuno: bets $6.42
liketaehoon: calls $6.42
*** SHOW DOWN ***
gordo chuno: shows [As 9h Ah 4s] (three of a kind, Aces)
liketaehoon: shows [4c 3d 6s 5d] (a flush, Ace high)
liketaehoon collected $18.71 from pot
*** SUMMARY ***
Total pot $19.54 | Rake $0.83
Board [Ad 7d 3c 6h 9d]
Seat 1: Odintsov Spb (button) folded before Flop (didn't bet)
Seat 2: bengozoli (small blind) folded before Flop
Seat 3: liketaehoon (big blind) showed [4c 3d 6s 5d] and won ($18.71) with a flush, Ace high
Seat 4: gordo chuno showed [As 9h Ah 4s] and lost with three of a kind, Aces
Seat 5: ARMPOKER folded before Flop (didn't bet)
Seat 6: justtme folded on the Turn



*/
