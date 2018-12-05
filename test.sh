#!/usr/bin/env bash

rm -Rf git-test
mkdir git-test
cd git-test
git init
git config filter.git-xd-filter.clean "../bin/git-xd-filter --clean"
git config filter.git-xd-filter.smudge "../bin/git-xd-filter --smudge"
echo '*.xd filter=git-xd-filter' > .gitattributes
git add .gitattributes
git commit -m 'add attributes'
cp ../examples/example1.xd test.xd
git add test.xd
git commit -m "add xd"
cp ../examples/example2.xd test.xd
expectedDiff=$(<../examples/example.diff)
actualDiff=$(git diff)
if [ "$expectedDiff" != "$actualDiff" ]; then
    echo "Test Failed"
    echo "Diff:"
    echo "$actualDiff" | diff -Naur ../examples/example.diff -
    exit 1
fi
cd ..
rm -Rf git-test
