# git-xd-filter

A Git filter for Adobe xd files. This filter stores xd files which are actualy
zip files in a git digestable way.

## Install

Install the binary:

``` shell
$ npm install -g git-xd-filter
```

Change to the repository where you want to configure your filter. Then set the
following config:

``` shell
$ git config filter.git-xd-filter.clean "git-xd-filter --clean"
$ git config filter.git-xd-filter.smudge "git-xd-filter --smudge"
```

Then create a `.gitattributes`-File:

``` 
*.xd filter=git-xd-filter
```

