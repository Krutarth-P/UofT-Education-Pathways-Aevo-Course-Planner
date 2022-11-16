from index import app
from cgitb import reset
import pytest
from index import app
import json

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
    
