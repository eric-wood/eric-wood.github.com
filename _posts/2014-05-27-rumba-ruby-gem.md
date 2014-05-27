---
layout: post
published: true
title: Rumba 0.1 released
---

Several years ago I wrote this weird Ruby library that speaks the Roomba protocol as part of my senior design project in college. It was pretty cool and seemed to work well.

Today, I rediscovered the code and have thrown it into a gem for all to enjoy! There are a few other alternatives to it, of course, such as [Artoo](http://artoo.io), but those are wrappers around much larger libraries, and overkill for simple tinkering! This lib is a native implementation (the protocol is dead simple), and the only dependency is the [serialport](https://rubygems.org/gems/serialport) gem. It's a lot of fun to hack on and adapt into other projects, there's no extra complexity!

Check it out: [https://rubygems.org/gems/rumba](https://rubygems.org/gems/rumba)

What are you waiting for? Go ```gem install rumba``` right away!

