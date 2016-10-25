CKEDITOR.plugins.add( 'handconvertor', {
    init: function( editor ) {
        // Plugin logic goes here...
	editor.addCommand( 'handconvertor', new CKEDITOR.dialogCommand( 'hcDialog' ) );
	editor.ui.addButton( 'HandConvertor', {
	label: '포커투데이 핸드 컨버터',
	command: 'handconvertor',
	icon: this.path + 'icons/pokertoday.png'
	});

  var pluginDirectory = this.path;
  editor.addContentsCss( pluginDirectory + 'styles/handconverter.css' );
	CKEDITOR.dialog.add( 'hcDialog', this.path + 'dialogs/handconvertor.js' );
    }
});
