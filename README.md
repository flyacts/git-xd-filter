# git-xd-filter

A git filter to store adobe xd files in a diffable way.

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

