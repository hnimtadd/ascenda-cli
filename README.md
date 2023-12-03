# ASCENDA Command Line Application

This command-line application helps customers efficiently retrieve offers from a given input file ("./input.json").

The output will be written to the output file ("./output.json").

Usage:
Command: ./cli --checkin date [Options]

**REQUIRED**:

- `--checkin` \[string\]: Customer's check-in date in `YYYY-mm-dd` layout. \(**REQUIRED**\)

**Options**:

- `--help`: Show helper.
- `--input` \[string\]: Path to the input JSON file.
- `--output` \[string\]: Path to the output file.
- `--valid-duration` \[number\]: Number of **days** the offers need to be still valid from the check-in date.
- `--num-return` \[number\]: Number of offers returned from the application.
