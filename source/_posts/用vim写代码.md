---
title: 用vim写代码
date: 2018-07-26 09:17:31
tags: [工具,vim]
---



# Using vim for writing code

Vim is a great text editor which can be much more powerful then any GUI editor or IDE. It has its learning curve, but once you are used to it you’ll never want to switch to anything else. Here’s a quick tutorial on how to use and customize vim for working with code.

<!--more-->

## Basics

Feel free to skip this first part if you are familiar with vim already.

First, let’s get the hang of moving around. You can use arrow keys or `h`, `j`, `k` and `l` to move around. Holding `Ctrl` while moving will allow you to move between words (separated by spaces, tabulation, or line breaks), holding `Shift` allows you to do so with all punctuation characters including spaces and line breaks.

Typing `:147` will get you to the line 147, `/foo` will get you to the first occurrence of foo, `/` will repeat the last search.

Hit `i` to enter insert mode and type in text. Hit `Esc` to go back. Key `a` does the same thing, but sets the cursor after the selected character. Hit `Insert` to switch between insert and replace modes.

Typing in `:w` will write changes to a file, `:q` exits the editor, `:e <filename>` opens another file.

Sometimes you need to do some copy-pasting: copy (yank) line with `Y` and paste it with `p`. You should know that vim allows you to prefix the majority of commands with a number: typing in `13Y` will yank 13 lines, `40j` will take you 40 lines down, etc.

Command `x` will delete a character, `dd` will delete a whole line. Of course, you can prefix it with a number if you need to delete more then one line.

`:%s/foo/bar` will find and replace the first occurrence of foo with bar, `:%s/foo/bar/g` will do so within the whole file.

Splitting windows is very helpful tool: `:split <filename>` will split the window horizontally, `:vsplit <filename>`will do so vertically. Hit `Ctrl + w`, and then arrow key will select an active view, `Ctrl + w, r` will swap the views. Simply type `:q` to close the window.

## Customizing

Here’s example of a `~/.vimrc` file, and the basic options necessary for editing code with vim.

```
syntax on

set tabstop=4
set shiftwidth=4
set smartindent
set autoindent
set expandtab
```

Option `syntax on` enables syntax highlight, `tabstop` sets tab width, `shiftwidth` sets tab width for auto indentation, `smartindent`, `autoindent` enables indentation (smart indentation implies adding an extra indentation level after defining function, starting a loop, etc.), optional is `expandtab`, which tells vim to treat all tabs as spaces.

If you are fan of limiting line width with n columns - add option `colorcolumn=80`, or (if your vim version is below 7.3) add the following lines:

```
highlight OverLength ctermbg=red ctermfg=white guibg=#592929
match OverLength /%80v.+/
```

That should highlight all text exceeding the 80 columns limit.

Feel free to experiment with the options and start building up your own `.vimrc`.

## Using ctags with vim

[Exuberant Ctags](http://ctags.sourceforge.net/) allows you to create “tags” for all your classes, functions, and variables to allow easily jumping between them. After installing ctags (package is also available in major repositories named `ctags`) generate tags:

```
$ cd project/
$ ctags -R *
```

Open the main project file and move your cursor over to some function call. Hit `Ctrl + ]` to move to function definition, `:tn` will move you to the next definition for the function. Hitting `Ctrl + t` will return you back.

Auto completion allows you not to bother with finishing words, variable or function names, and pretty much anything. That being said, `Ctrl + n` will finish the word for you or allow you to select the desired word from the list.

This is just a basic example of what you can do with vim, for further info you can read [vim documentation](http://www.vim.org/docs.php). I may be posting some more tips and tricks on using vim in future.