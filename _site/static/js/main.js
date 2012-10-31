$(function() {
  SyntaxHighlighter.autoloader(
    'js jscript javascript /static/js/syntaxhighlighter/shBrushJScript.js',
    'xml xhtml xslt html   /static/js/syntaxhighlighter/shBrushXml.js',
    'text plain            /static/js/syntaxhighlighter/shBrushPlain.js',
    'css                   /static/js/syntaxhighlighter/shBrushCss.js',
    'ruby rails ror rb     /static/js/syntaxhighlighter/shBrushRuby.js'
  );

  SyntaxHighlighter.all();
});
