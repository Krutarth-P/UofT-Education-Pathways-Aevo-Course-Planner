from index import app
from cgitb import reset
import pytest
from index import app, addNewCourse
import json
import csv

# Unit test to ensure entries are being added to CSVs properly by Priscilla Deng
@pytest.mark.parametrize("input", [{
    "course_code":"ECE4444",
    "course_name":"TESTinggggg",
    "division":"TESTDIV",
    "department":"",
    "course_description":"BLEH",
    "prerequisites":"",
    "corequisites":"",
    "exclusions":""}])

def test_course_add_csv(input):
    with open('resources/test_courses.csv', 'r+') as fp:
        addNewCourse(input)
        csvReader = list(csv.reader(fp, delimiter=","))
        assert("ECE4444" in csvReader[-1][1])
        assert("TESTinggggg" in csvReader[-1][2])
        assert("TESTDIV" in csvReader[-1][3])
        assert('BLEH' in csvReader[-1][4])
        assert("test" not in csvReader[-1])
    

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
    
