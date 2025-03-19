#!/bin/bash

input_file="$1"

awk -F',' '{
    if ($0 ~ /Standalone\/Consolidated/) {
        print "", "", "", "", "", "", "", "", $(NF-2), $(NF-1), $NF;
    } else {
        print $0;
    }
}' OFS="," "$input_file"