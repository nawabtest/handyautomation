#!/bin/bash

# Set default values
#filenameOption="title"
urlFile="urls.txt"
x=1
y=2
outputSpecified=0
inputSpecified=0
fn_prefix=""
vars=""

# Parse parameters in the form of 'key=value'
for arg in "$@"
do
  IFS='=' read -r key value <<< "$arg"

  if [ "$key" == "output" ]; then
 #   filenameOption="$value"
    outputSpecified=1
  elif [ "$key" == "input" ]; then
    urlFile="$value"
    inputSpecified=1
  fi
done

# Get the script name without any preceding "./"
scriptName="${0#./}"

# Print instructions
if [ $inputSpecified -eq 0 ]; then
    echo -e "\nNote: You can optionally specify a file containing URLs as an input option when running this script."
    echo "Example: $scriptName input=your_urls.txt"
    echo ""
fi

if [ $outputSpecified -eq 0 ]; then
    echo -e "\nNote: You can optionally specify 'url' as an output option when running this script to save the filenames with the URL instead of the title."
    echo "Example: $scriptName output=url"
    echo ""
fi

echo -e "Parameter: input=$urlFile"
echo    "Parameter: output=$filenameOption"
echo    "Saving all screenshots in $(pwd)"
echo -e "\nRunning the script now...\n"

for line in $(cat $urlFile)
do
    if [ $x -lt 10 ]; then
        prefix="000${x}"
    elif [ $x -lt 100 ]; then
        prefix="00${x}"
    elif [ $x -lt 1000 ]; then
        prefix="0${x}"
    else
        prefix="${x}"
    fi

    filename=$(ls | grep "^${prefix}_")

    if [ -n "$filename" ]; then
        echo "Skipping index $x because file exists: $filename"
    else
        echo "$line $x"
        var=`awk 'NF>1{print $NF}' file`
        node grab_url.js $x "$line"  # pass the filename option to the Node.js script

    fi
    let "x += 1"
done

node createpdf_am.js