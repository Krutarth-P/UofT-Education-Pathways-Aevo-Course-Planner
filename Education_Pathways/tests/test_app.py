from index import app
from cgitb import reset
import pytest
from index import app, addNewCourse, editCourse, deleteCourse
import json
import csv
import pandas as pd
import sys

maxInt = sys.maxsize

while True:
    # decrease the maxInt value by factor 10 
    # as long as the OverflowError occurs.
    try:
        csv.field_size_limit(maxInt)
        break
    except OverflowError:
        maxInt = int(maxInt/10)


# Unit test to ensure entries are being added to CSVs properly by Priscilla Deng
@pytest.mark.parametrize("input", [{
    "course_code":"ECE4444",
    "course_name":"TESTinggggg",
    "division":"TESTDIV",
    "department": "",
    "course_description":"BLEH",
    "prerequisites": "",
    "corequisites": "",
    "exclusions": ""
    }])

def test_course_add_csv(input):
    with open('resources/courses.csv', 'r+', encoding="utf-8") as fp:
        addNewCourse(input)
        csvReader = list(csv.reader(fp, delimiter=","))
        assert("ECE4444" in csvReader[-1][1])
        assert("TESTinggggg" in csvReader[-1][2])
        assert("TESTDIV" in csvReader[-1][3])
        assert('BLEH' in csvReader[-1][4])
        assert("test" not in csvReader[-1])
    


# Unit test to ensure edited courses are being added to CSVs properly by Krutarth Patel
@pytest.mark.parametrize("edit_input", [{
    "index": 0,
    "course_code":"ECE4444",
    "course_name":"TESTinggggg Course Name",
    "division":"TESTDIV",
    "department":"Testing Department",
    "course_description":"BLEH BLEH BLEH",
    "prerequisites":"",
    "corequisites":"",
    "exclusions":""}])

def test_course_edit_csv(edit_input):

    df_test = pd.read_csv("resources/courses.csv")
    rows=len(df_test)
    edit_input["index"]=rows-1 #set index of the newest added course

    with open('resources/courses.csv', 'r+', encoding="utf-8") as fp:

        editCourse(edit_input)

        csvReader = list(csv.reader(fp, delimiter=","))

        assert("ECE4444" in csvReader[-1][1]) #check course code
        assert("TESTinggggg Course Name" in csvReader[-1][2]) #check course name
        assert("TESTDIV" in csvReader[-1][3]) #check course division
        assert("BLEH BLEH BLEH" in csvReader[-1][4]) #check course description
        assert("Testing Department" in csvReader[-1][5]) #check course department
        assert("test" not in csvReader[-1]) #check not in any course info


# Unit test function to test the delete course feature by Nafio Miah
@pytest.mark.parametrize("input", [{
    "course_code":"ECE4444",
    "course_name":"TESTinggggg",
    "division":"TESTDIV",
    "department":"",
    "course_description":"BLEH",
    "prerequisites":"",
    "corequisites":"",
    "exclusions":""}])


def test_delete_course_csv(input):
    # read CSV file
    test_courses = pd.read_csv("resources/courses.csv")
    last_element = len(test_courses) -1 
    input["index"] = last_element
    deleteCourse(input)
    with open('resources/courses.csv', 'r+', encoding="utf-8") as fp:
        csvReader = list(csv.reader(fp, delimiter=","))
        assert("ECE4444" not in csvReader[-1][1])
        assert("TESTinggggg Course Name" not in csvReader[-1][2]) #check course name
        assert("TESTDIV" not in csvReader[-1][3]) #check course division
        


# Unit test function to test search bar functionalities by Jayce Wang
@pytest.mark.parametrize("course_query", [
                                        ("ECE;ti:computer;de:circuit")
                                        ])
def test_search_bar(course_query):
    tester = app.test_client()
    resp = tester.get(f"/searchc?input={course_query}")

    assert(resp.status == '200 OK')
    resp_data = json.loads(resp.data.decode('utf-8'))
    assert(len(resp_data)>0)  # Check that results are not none
    # Check that delimiters works as planned
    for i in range(len(resp_data)):
        assert('ECE' in resp_data[i]['code'])
        assert('computer' in resp_data[i]['name'].lower())
        assert('circuit' in resp_data[i]['description'].lower())
    
# Unit test to ensure that the appropriate minor link exists in the relevant file to be redirected from by Fahim Talukder
@pytest.mark.parametrize("input", [("https://undergrad.engineering.utoronto.ca/academics-registration/minors-certificates/undergraduate-engineering-minors/advanced-manufacturing-minor/")])

def test_correct_minor_link():
    test_minor_links = pd.read_csv('resources/minors_links.csv')
    length = len(test_minor_links) #different columns of the csv file

    with open('resources/courses.csv', 'r', encoding="utf-8") as fp:
        csvREADER = csv.reader(fp, delimiter=",")
        for col in len(test_minor_links): 
            if ("https://undergrad.engineering.utoronto.ca/academics-registration/minors-certificates/undergraduate-engineering-minors/advanced-manufacturing-minor/" == col[:][0]):
                assert("https://undergrad.engineering.utoronto.ca/academics-registration/minors-certificates/undergraduate-engineering-minors/advanced-manufacturing-minor/"==col[:][0])
