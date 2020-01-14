#!/usr/bin/env bash
set -e

# Formats any *.tf files according to the hashicorp convention
files=$(git diff --cached --name-only)
for f in $files
do
  if [ -e "$f" ] && [[ $f == *.tf ]]; then
    terraform fmt $f
    git add $f
  fi
done