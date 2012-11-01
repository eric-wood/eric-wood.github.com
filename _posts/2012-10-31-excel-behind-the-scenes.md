--- 
layout: post
published: false
title: "Excel =&gt; LaTeX : behind the scenes"
---

The other day I threw [this](http://ericwood.org/excel2latex) together for fun. It's a bit of a hack, but there's enough going on that it's worth writing a little about!

The premise is simple: I'm writing a lab report in LaTeX, but most of the data I took was in Excel (what can I say, it's not bad for calculations...don't judge me). I want to throw a nice LaTeX table into my report but don't want to do everything by hand or save it as a CSV file and use a conversion tool.

That's where Excel =&gt; LaTeX comes into play! With the fancy new HTML5 file stuffs it's possible to parse XLSX files *in the browser* without having to run any code server-side! All you have to do is grad an XLSX file into the browser and it spews out a LaTeX table. Howcoolisthat?!

### XLSX and Office Open XML

Before we dive into the implementation, lets talk a bit about the XLSX / [Office Open XML](http://en.wikipedia.org/wiki/Office_Open_XML) formats.

Microsoft is totally down with the open standards thing, yo. They're nice enough to go as far as creating an [ECMA standard](http://www.ecma-international.org/publications/standards/Ecma-376.htm) format for all of their Office apps. Granted, the real formats expand quite a bit on OOXML, but even then they publish how those formats work. 

For poking around purposes, I created a simple Excel file:

<img src="/static/images/excel2latex/sample_spreadsheet.png" class="no-border">

First things first: XLSX files are zipped, so we need to unzip the file first. Here's the contents:

![](/static/images/excel2latex/dir.png)

What's going on here? Lots of things.

*Confession*: I didn't read the spec. I figured all of this out by poking around the XML files...so I only understand a very small subset of the format :(

The only directory we care about is <span class="pre">xl/</span>, where the data lives.

Here are the important files:
<ul>
  <li><span class="pre">xl/worksheets/sheet1.xml</span> - the data</li>
  <li><span class="pre">xl/sharedStrings.xml</span> - table of strings</li>
</ul>

Lets take a look at <span class="pre">sheet1.xml</span>:

<pre class="brush: xml">
<sheetData>
    <row r="1" spans="1:2">
        <c r="A1" t="s">
            <v>4</v>
        </c>
        <c r="B1" t="s">
            <v>3</v>
        </c>
    </row>
    <row r="2" spans="1:2">
        <c r="A2">
            <v>1</v>
        </c>
        <c r="B2" t="s">
            <v>0</v>
        </c>
    </row>
    <row r="3" spans="1:2">
        <c r="A3">
            <v>2</v>
        </c>
        <c r="B3" t="s">
            <v>1</v>
        </c>
    </row>
    <row r="4" spans="1:2">
        <c r="A4">
            <v>3</v>
        </c>
        <c r="B4" t="s">
            <v>2</v>
        </c>
    </row>
</sheetData>
</pre>

It's fairly obvious what's going on here: <span class="pre">&lt;row&gt;</span> denotes a row (with the r attribute being the number), <span class="pre">&lt;c&gt;</span> is a column, and <span class="pre">&lt;v&gt;</span> is a value.

But wait! Where are our previous letters and strings?! They certainly aren't in any of the value tags!

Calm down. They're safe and sound in <span class="pre">sharedStrings.xml</span>.

Columns have a "t" attribute which denotes the data type. In the case of strings, we see <span class="pre">t="s"</span>. This means we'll be able to find the string in the string table at the index given to us in the v tag.

So what's in <span class="pre">sharedStrings.xml</span>?

<pre class="brush: xml">
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="5" uniqueCount="5">
<si>
    <t>A</t>
</si>
<si>
    <t>B</t>
</si>
<si>
    <t>C</t>
</si>
<si>
    <t>Letters!</t>
</si>
<si>
    <t>Numbars!</t>
</si>
</sst>
</pre>

No explanation is really needed here.

### The Javascript

Now, to the actual conversion code!

#### HTML5, files, shenanigans

The main feature of this is being able to drag files into the browser for conversion. HTML5 provides a super kewl API for this sort of thing.

Everything is as simple as the <span class="pre">dragover</span> and <span class="pre">drop</span> events. Lets take a look at a sample:

<pre class="brush: js">
// hack because of jQuery shenanigans
jQuery.event.props.push('dataTransfer');

$('body').bind('dragover', function(event) {
  event.stopPropagation();
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
});

$('body').bind('drop', excelParser.handleFile);
</pre>

The <span class="pre">dragover</span> event gets triggered when the user starts dragging the file into the browser window. Most websites use this to display some kind of clue to the user that things are happening.

The real magic happens on the <span class="pre">drop</span> event. This gets fired when the file is actually dropped. As you can see, we supplied an event handler to kick off the processing.

Also note that each event has a call to <span class="pre">stopPropagation()</span> and <span class="pre">preventDefault()</span>. We want to make sure that the only actions that happened on these events were specified by us.

Now lets take a peek at the event handler:

<pre class="brush: js">
handleFile: function(event) {
  // prevent default browser behavior
  event.stopPropagation();
  event.preventDefault();

  // get file information
  var files = event.dataTransfer.files;
  if(!files.length) {
    // no files were given somehow...
    $('#latex-output').val('No files were given...try again?');
    return false;
  }
  // snip...
}
</pre>

We can grab the <span class="pre">File</span> objects passed in with the <span class="pre">dataTransfer.files</span> thingamajig. You can find more info on the <span class="pre">File</span> object in the [W3C spec](http://www.w3.org/TR/FileAPI/).

#### Unzipping

As I mentioned earlier, we can't get at the data in the XLSX file unless we pull down its zipper. This poses a little bit of a challenge, since there's no built-in way of doing this with Javascript.

Thankfully, though, someone was one step ahead of me and write [zip.js](http://gildas-lormeau.github.com/zip.js/), which takes care of all of this magic for me. It's a beautiful library.

Passing in the binary blob we got in the previous step, it spits out an array of <span class="pre">File</span> objects for us to use.

<pre class="brush: js">
// unzip and process files
zip.createReader(new zip.BlobReader(blob), function(reader) {
  reader.getEntries(function(entries) {
    if(!entries.length) { return false; }
                                                              
    // get the string table
    var stFile = $.grep(entries, function(n,i) {
      return /^xl\/sharedStrings\.xml$/.test(n.filename);
    })[0];
                                                              
    stFile.getData(new zip.TextWriter(), function(text) {
      var stringTable = excelParser.parseStringTable(text);
      excelParser.handleSheet(entries, stringTable);
    });
                                                              
  });
});
</pre>

This is all straight out of the [zip.js documentation](http://gildas-lormeau.github.com/zip.js/core-api.html#zip-reading-example) for the most part. Nothing crazy, we just give a callback for each file that gets read in.

Note that we filter out all files that aren't the worksheets or the string table.

Another thing to keep in mind: all of this file IO is *asynchronous*...you can't read the file and move on to other code that requires data from it. Structure things in such a way that all of the file handling is separated into functions that call each other rather than procedural code which expects the file reading to block.

#### Extracting the data

So now we have the text from the XML files. Awesome. 

### Conclusion


