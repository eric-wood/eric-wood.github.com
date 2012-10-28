--- 
layout: post
published: true
title: My Toolchain
---

I run into quite a few articles on people's blogs about the tools they use at their jobs. To me, it's fascinating, since everyone takes a different approach, and more often than not I'll walk away knowing about some new tool or trick that makes my life easier. I've always wanted to write one of these posts myself.

This whole post will probably get updated in the future as I continue tweaking things.

Over the years, I've put waaaaaaay too much time into my development environment. I justify the lost time by saying something along the lines of "if I'm going to be staring at it all day, it had better look nice, damnit," or I pretend I hadn't just spent the last hour tweaking my .vimrc to fix some minor annoyance rather than getting work done.

### Config Files

I like to keep all of my config files in a [Github repo](http://github.com/eric-wood/dotfiles) for easy access. From any machine with git installed, I can simply clone the repository and run bootstrap.sh to have everything set up for me. The bootstrapping script backs up any duplicate dotfiles, and symlinks mine into my homedir.

My bash_profile and zshrc files, however, stay put and instead a line is appended to the beginning of the existing bash_profile or zshrc files to source the ones in the repo. This allows me to have system-specific settings in the file in my homedir along with my other customizations. Modularity is the name of the game!

### Vim

Vim is awesome. After using it for a few years, I don't think I can go back to other editors (unless they have a Vi mode, of course). I could probably do a separate blog post on my vimrc, but that's not really necessary yet. You can take a peek at it [here](https://github.com/eric-wood/dotfiles/blob/master/.vimrc) if you'd like to get into the details, but I'll give a brief overview of my customizations.

Before anything else, though, here's a bitchin screenshot of my config in action:

<a href="/static/toolchain/images/vim_demo.png"><img src="/static/images/toolchain/vim_demo.png"></a>

Now lets dig into the config a bit...

#### Colorschemes

My tastes in colorschemes changes pretty often, so here's a few of my favorites:
* [tomorrow-night-eighties](https://github.com/chriskempson/tomorrow-theme) - my current fave
* [Solarized](http://ethanschoonover.com/solarized) - I have a keybinding to switch to the light version when I'm in the sun or have the brightness down
* [Railscasts](http://www.vim.org/scripts/script.php?script_id=2175) - an old favorite, I come back to it from time to time
* [Molokai](https://github.com/tomasr/molokai) - also pretty neat

#### Plugins

First things first, I'd like to give a shout-out to [Vundle](https://github.com/gmarik/vundle). It's essentially a package manager for Vim plugins; you can search, install, and remove plugins from the comfort of Vim. It handles the messy stuff and makes it effortless to try out new plugins. I cannot recommend it enough.

Since I'm on OS X most of the time, I use [MacVim](https://github.com/b4winckler/macvim) for everything. It's wonderful and feels much better than gVim.

Quick note about terminal vs. gVim - when I can get my hands on it, I prefer gVim, *however* I do everything I can to make my vimrc work equally as well in both. The easiest way to do this is toggling functionality with an if statement. Some people prefer to have a separate gvimrc file with their gVim-specific settings (lame).

So here's a list of some of my favorite plugins:
* [Indent Guides](https://github.com/nathanaelkane/vim-indent-guides) - little marks to help keep track of indents
* [Vimroom](http://projects.mikewest.org/vimroom/) - a Vim imitation of [Writeroom](http://www.hogbaysoftware.com/products/writeroom)
* [CtrlP](http://www.vim.org/scripts/script.php?script_id=3736) - fuzzy searching of buffers, filenames, etc.
* [NERDTree](http://www.vim.org/scripts/script.php?script_id=1658) - the classic Vim file browser

#### Other Customizations

Everything else you see in my vimrc is just handy little keystrokes (mostly using &lt;leader&gt;) for toggling things.

Like all hardcore Vim users, I've remapped the arrow keys to do nothing. HJKL or die! ;)

### Terminal

Like many \*nix users, I spend a lot of my time in the terminal. Since I'm mostly using OS X, [iTerm2](http://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&ved=0CB8QFjAA&url=http%3A%2F%2Fwww.iterm2.com%2F&ei=MFaNUPriOsjXqgGM04DYDA&usg=AFQjCNG7IStoNOzSPwdmFLWs4251hvTXvA) is my terminal emulator of choice. It's more flexible than Terminal.app, and can do things like splits and a cool FPS-style dropdown window.

I use the [tomorrow-night-eighties](https://github.com/chriskempson/tomorrow-theme) iTerm2 colorscheme to match my Vim colorscheme.

#### Zsh

Recently I made the switch from bash to zsh. The reason? I had heard that zsh a Vi mode that *doesn't* suck. I tried using Vi mode with bash for a while, but there was no way to figure out what state I was in. Zsh, however, lets you change the prompt accordingly.

Like all good zsh users, I've tricked out my prompt. Here it is in action:

<a href="/static/images/toolchain/zsh.png"><img class="no-border" src="/static/images/toolchain/zsh.png"></a>

The important parts:
* Hostname is in blue
* Current Git branch is in the square brackets
* The lightning bolt: yellow = insert mode; blue = normal mode (for the Vi stuff)
* Branch name changes from green to red when there are uncommitted changes
* The red bar on the right helps me find my place when reading through scrollback


