Record Linkage Review
=====================

This tool is a record comparing tool useful for record linkage. It can be used to make a golden dataset or to validate your record linkage.

Getting started
---------------

.. code:: 

    python rl-review.py

Reviewer
--------

Features:

- Use keyboard for classification; Right arrow is match, Left arrow is distinct. Use arrow up and down for next record pair. 
- Use buttons for classification
- Use navigation menu for changing categories. 

Developer
---------

The developer can make a use of this tool by making a json file with all information. The JSON file needs to have the following structure:

.. code:: 

    {
        "forest": {
            "tree": [
                {
                    "records": [{
                            "field": {
                                "name":{
                                    "_description": "Name",
                                    "value": "Bart"
                                },
                                "lastname":{
                                    "_description": "Last Name",
                                    "value": "Smith"
                                },
                                "dob":{
                                    "_description": "Date of birth",
                                    "value": "07-02-1999"
                                },
                                "income":{
                                    "_description": "Income",
                                    "value": "50k"
                                },
                                "tax": {
                                    "_description": "Tax",
                                    "value": 20000                                
                                }
                            },
                            "_document": "documentA",
                            "_id": "1"
                        },
                        {
                            "field": {
                                "name":{
                                    "_description": "Name",
                                    "value": "Bart"
                                },
                                "lastname":{
                                    "_description": "Last Name",
                                    "value": "Smit"
                                },
                                "dob":{
                                    "_description": "Date of birth",
                                    "value": "02-07-1999"
                                },
                                "income":{
                                    "_description": "Income",
                                    "value": 50000
                                }
                            },
                            "_document": "documentB",
                            "_id": "1"
                        }
                    ],
                    "links": [
                        {
                            "compare": [
                                {
                                    "_target": "name",
                                    "_source": "name",
                                    "_type": "string",
                                    "value": "agree"
                                },
                                {
                                    "_target": "lastname",
                                    "_source": "lastname",
                                    "_type": "string",
                                    "value": "agree"
                                },
                                {
                                    "_target": "dob",
                                    "_source": "dob",
                                    "_type": "dateofbirth",
                                    "value": "agree"
                                },
                                {
                                    "_target": "income",
                                    "_source": "income",
                                    "_type": "number",
                                    "value": "agree"
                                },
                                {
                                    "_target": "tax",
                                    "_type": "number"
                                }                   
                            ],

                            "target": {
                                "_document": "documentA",
                                "_id":"1"
                                },

                            "source": {
                                "_document": "documentB",
                                "_id": "1"
                                },

                            "_match": null
                        }
                    ]
                },
                {
                    "records": [{
                            "field": {
                                "name":{
                                    "_description": "Name",
                                    "value": "Bob"
                                },
                                "lastname":{
                                    "_description": "Last Name",
                                    "value": "Valid"
                                },
                                "dob":{
                                    "_description": "Date of birth",
                                    "value": "01-01-1900"
                                },
                                "income":{
                                    "_description": "Income",
                                    "value": "60k"
                                },
                                "tax": {
                                    "_description": "Tax",
                                    "value": 1000                                
                                }
                            },
                            "_document": "documentA",
                            "_id": "1"
                        },
                        {
                            "field": {
                                "name":{
                                    "_description": "Name",
                                    "value": "Bob"
                                },
                                "lastname":{
                                    "_description": "Last Name",
                                    "value": "Invalid"
                                },
                                "dob":{
                                    "_description": "Date of birth",
                                    "value": "03-12-1989"
                                },
                                "income":{
                                    "_description": "Income",
                                    "value": 40000
                                }
                            },
                            "_document": "documentB",
                            "_id": "1"
                        }
                    ],
                    "links": [
                        {
                            "compare": [
                                {
                                    "_target": "name",
                                    "_source": "name",
                                    "_type": "string",
                                    "value": "agree"
                                },
                                {
                                    "_target": "lastname",
                                    "_source": "lastname",
                                    "_type": "string",
                                    "value": "agree"
                                },
                                {
                                    "_target": "dob",
                                    "_source": "dob",
                                    "_type": "dateofbirth",
                                    "value": "agree"
                                },
                                {
                                    "_target": "income",
                                    "_source": "income",
                                    "_type": "number",
                                    "value": "agree"
                                },
                                {
                                    "_target": "tax",
                                    "_type": "number"
                                }                   
                            ],

                            "target": {
                                "_document": "documentA",
                                "_id":"1"
                                },

                            "source": {
                                "_document": "documentB",
                                "_id": "1"
                                },

                            "_match": null
                        }
                    ]
                },
                {
                    "records": [{
                            "field": {
                                "name":{
                                    "_description": "Name",
                                    "value": "Katie"
                                },
                                "lastname":{
                                    "_description": "Last Name",
                                    "value": "Perry"
                                },
                                "dob":{
                                    "_description": "Date of birth",
                                    "value": null
                                },
                                "income":{
                                    "_description": "Income",
                                    "value": null
                                },
                                "tax": {
                                    "_description": "Tax",
                                    "value": null                               
                                }
                            },
                            "_document": "documentA",
                            "_id": "1"
                        },
                        {
                            "field": {
                                "name":{
                                    "_description": "Name",
                                    "value": "Katie"
                                },
                                "lastname":{
                                    "_description": "Last Name",
                                    "value": "Perry"
                                },
                                "dob":{
                                    "_description": "Date of birth",
                                    "value": "25-10-1984"
                                },
                                "income":{
                                    "_description": "Income",
                                    "value": "35M"
                                }
                            },
                            "_document": "documentB",
                            "_id": "1"
                        }
                    ],
                    "links": [
                        {
                            "compare": [
                                {
                                    "_target": "name",
                                    "_source": "name",
                                    "_type": "string",
                                    "value": "agree"
                                },
                                {
                                    "_target": "lastname",
                                    "_source": "lastname",
                                    "_type": "string",
                                    "value": "agree"
                                },
                                {
                                    "_target": "dob",
                                    "_source": "dob",
                                    "_type": "dateofbirth",
                                    "value": "agree"
                                },
                                {
                                    "_target": "income",
                                    "_source": "income",
                                    "_type": "number",
                                    "value": "agree"
                                },
                                {
                                    "_target": "tax",
                                    "_type": "number"
                                }                   
                            ],

                            "target": {
                                "_document": "documentA",
                                "_id":"1"
                                },

                            "source": {
                                "_document": "documentB",
                                "_id": "1"
                                },

                            "_match": null
                        }
                    ]
                }
            ]
        }
    }


Installation and license
------------------------


The license for this record linkage tool is GPLv3.
