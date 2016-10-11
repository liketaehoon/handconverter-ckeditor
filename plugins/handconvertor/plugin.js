CKEDITOR.plugins.add( 'handconvertor', {
    init: function( editor ) {
        // Plugin logic goes here...
	editor.addCommand( 'handconvertor', new CKEDITOR.dialogCommand( 'hcDialog' ) );
	editor.ui.addButton( 'HandConvertor', {
	label: 'HandConvertor',
	command: 'handconvertor',
	icon: this.path + 'icons/pokertoday.png'
	});

  var pluginDirectory = this.path;
  editor.addContentsCss( pluginDirectory + 'styles/handconverter.css' );
	CKEDITOR.dialog.add( 'hcDialog', this.path + 'dialogs/handconvertor.js' );
    }
});
