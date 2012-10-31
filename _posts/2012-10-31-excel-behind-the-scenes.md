--- 
layout: post
published: true
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

#### HTML5, files, shenanigans

#### Unzipping

#### Extracting the data

### Conclusion


