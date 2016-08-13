Record Linkage Review
=====================

This tool is a record comparing tool useful for record linkage. It can be used to make a golden dataset or to validate your record linkage.

Getting started
---------------

Start with running a local static file server. This is needed to prevent issues with cross-site scripting. A few examples are listed below: 

Python 2

```shell
$ python -m SimpleHTTPServer 8000
```

Python 3

```shell
$ python -m http.server 8000
```

Node.js

```shell
$ npm install -g node-static   # install node-static
$ static -p 8000
```

Is your favorate programming language not listed above? See https://gist.github.com/willurd/5720255 for more static file servers. 

Then navigate in your browser to http://localhost:8000/review.html. Now you can start comparing records.

Reviewer
--------

Features:

- Use keyboard for classification; Right arrow is match, Left arrow is distinct. Use arrow up and down for next record pair. 
- Use buttons for classification
- Use navigation menu for changing categories. 

Developer
---------

The developer can make a use of this tool by making a json file with all information. The JSON file needs to have the following structure:

``` json
{
    "version":1,
    "analysis":"simple",
    "records":{
        "census1990":{
            "filepath":"census1990.csv",
            "type":"csv",
            "delimiter":",",
            "description":"Census data of 1990.",
            "index_column":"id"
        },
        "census2000":{
            "filepath":"census2000.csv",
            "type":"csv",
            "delimiter":",",
            "description":"Census data of 2000."
        }
    },
    "compare":[
        {
            "values":[
                {
                    "records":"census1990",
                    "label":"name",
                    "encoded":"encoded value, for example soundex (future)"
                },
                {
                    "records":"census2000",
                    "label":"firstname",
                    "encoded":"encoded value, for example soundex (future)"
                }
            ],
            "type":"data type (future)",
            "value":"comparison label (future)"
        },
        {
            "values":[
                {
                    "records":"census1990",
                    "label":"lastname"
                },
                {
                    "records":"census2000",
                    "label":"lastname"
                }
            ]
        },
        {
            "values":[
                {
                    "records":"census1990",
                    "label":"date_of_birth"
                },
                {
                    "records":"census2000",
                    "label":"dob"
                }
            ]
        },
        {
            "values":[
                {
                    "records":"census1990",
                    "label":"hometown"
                },
                {
                    "records":"census2000",
                    "label":"hometown"
                }
            ]
        },
        {
            "values":[
                {
                    "records":"census1990",
                    "label":"gender"
                },
                {
                    "records":"census2000",
                    "label":"sex"
                }
            ]
        }
    ]
}
```

License
-------

The license for this record linkage tool is GPLv3.
