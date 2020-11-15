/*eslint strict: ["error", "global"]*/
'use strict';

//=======================================================
// Include kss
//=======================================================
var kss = require('kss');

//=======================================================
// Include Our Plugins
//=======================================================
var path = require('path');

// Export our tasks.
module.exports = {

  // Generate the style guide using the top level
  // directory name passed in as a parameter.
  generate: function(dirname) {

    return kss({
      source: [
        dirname + '/src/global',
        dirname + '/src/components'
      ],
      destination: dirname + '/dist',
      builder: dirname + '/src/style-guide/builder',
      namespace: 'a11y_style_guide:' + dirname + '/src/components/',
      // The css and js paths are URLs, like '/misc/jquery.js'.
      // The following paths are relative to the generated style guide.
      // The all.css file is for the style guide ONLY so you don't have to
      // keep adding the file here everytime you add a new component.
      css: [
        path.relative(
          dirname + '/style-guide/',
          dirname + '/all/all.css'
        )
      ],
      js: [
      ],
      homepage: 'style-guide.md',
      title: 'Przewodnik stylów'
    });
  }
};
