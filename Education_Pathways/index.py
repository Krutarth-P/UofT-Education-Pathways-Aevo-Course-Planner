# this is the flask core

from flask import Flask, send_from_directory, jsonify, request
from flask_restful import Api,Resource, reqparse
import os
import logging
import simplejson as json

import pandas as pd
df = pd.read_csv("resources/courses.csv")

df_test = pd.read_csv("resources/test_courses.csv")

minors_df = pd.read_csv("resources/eng_minor_list_dummy.csv") #TODO: WILL NEED TO BE UPDATED WITH FULL MINOR CSV

#print(df_test.loc[df_test['Code'] == 'ECE972'])
#print(df_test.iloc[df_test[df_test['Code'].str.contains('TEST')].index.tolist()])

import config
app = Flask(__name__, static_folder='frontend/build')
app.config['ENV'] = 'development'
app.config['DEBUG'] = True
app.config['TESTING'] = True
# MongoDB URI
# DB_URI = "mongodb+srv://Cansin:cv190499@a-star.roe6s.mongodb.net/A-Star?retryWrites=true&w=majority"
# app.config["MONGODB_HOST"] = DB_URI

config.init_app(app)
config.init_db(app)
config.init_cors(app)

print(df_test.loc[1])

#def add_course(course):
    


#def add_course(course):
    


# route functions
def search_course_by_code(s):
    # return all the courses whose course code contains the str s
    # Use delimiter to specify search: no delimiter assumes course code but can also use ;cc:,  ;ti: means title, ;de:description
    # inclusion of delimiter assumes forced AND of search terms
    # look for delimiter
    courseCode = ''
    courseDesc = ''
    courseTitle = ''
    course_ids = []
    # Delimiter usage detection and processing
    if ';' in s:
        parsed_input = s.split(';')
        for term in parsed_input:
            if len(term) > 0: #if empty string skip it
                # now parse query using different delimiters
                if (':' not in term or 'cc:' in term) and courseCode=='': #if no delimiter used assume course code query
                    courseCode = term if ':' not in term else term.split(':')[-1]
                elif 'ti:' in term and courseTitle == '': #if title delimiter is used
                    courseTitle = term.split(':')[-1]
                elif 'de:' in term and courseDesc == '':  #if description delimiter is used
                    courseDesc = term.split(':')[-1]
                else:
                    return [] # invalid use of delimiters and symbols will return nothing
    else:
        courseCode = s #if no delimiter used assume course code search

    cc_course_ids = df[df['Code'].str.contains(courseCode.upper())].index.tolist()

    if courseDesc != '':
        desc_course_ids = df[df['Course Description'].str.contains(courseDesc,na=False)].index.tolist()
    else:
        desc_course_ids = cc_course_ids.copy()

    if courseTitle != '':
        #capitalize title term string by default since all words in course names are capitalized
        title_course_ids = df[df['Name'].str.contains(courseTitle.capitalize(),na=False)].index.tolist() 
    else:
        title_course_ids = cc_course_ids.copy()

    # find course ids that match all input filters by the intersection of the lists
    course_ids = list(set.intersection(*map(set, [cc_course_ids, desc_course_ids, title_course_ids])))
    if len(course_ids) == 0:
        return []
    if len(course_ids) > 10:
        course_ids = course_ids[:10]
    res = []
    minor_dict = {
        # Parse all course codes from csv dataframe into a list of course code strings for each corresponding minor
        # filter out NaNs with course == course
            "Artificial Intelligence": [course for course in minors_df["Artificial Intelligence"].tolist() if course == course], 
            "Robotics & Mechatronics": [course for course in minors_df["Robotics & Mechatronics"].tolist() if course == course], 
            "Advanced Manufacturing": [course for course in minors_df["Advanced Manufacturing"].tolist() if course == course], 
            "Bioengineering": [course for course in minors_df["Bioengineering"].tolist() if course == course], 
            "Environmental Engineering": [course for course in minors_df["Environmental Engineering"].tolist() if course == course], 
            "Sustainable Energy": [course for course in minors_df["Sustainable Energy"].tolist() if course == course],
            "Engineering Business": [course for course in minors_df["Engineering Business"].tolist() if course == course],
            "Global Leadership": [course for course in minors_df["Global Leadership"].tolist() if course == course],
            "Nanoengineering": [course for course in minors_df["Nanoengineering"].tolist() if course == course],
            "Music Performance":[course for course in minors_df["Music Performance"].tolist() if course == course]
        }
    for i, course_id in enumerate(course_ids):
        d = df.iloc[course_id].to_dict()
        
        res_d = {
            '_id': i,
            'code': d['Code'],
            'name': d['Name'],
            'description': d['Course Description'],
            'term': d['Term'],
            'activity': d['Activity'],
            'syllabus': "Course syllabus here.",
            'prereq': d['Pre-requisites'],
            'coreq': d['Corequisite'],
            'exclusion': d['Exclusion'] ,
            'division': d['Division'],
            'department': d['Department'] ,
            # include information about corresponding courses for each minor as part of api request for frontend use
            'minor_AI': minor_dict["Artificial Intelligence"],
            'minor_RM': minor_dict["Robotics & Mechatronics"],
            'minor_AM': minor_dict["Advanced Manufacturing"],
            'minor_Bio': minor_dict["Bioengineering"],
            'minor_Env': minor_dict["Environmental Engineering"],
            'minor_SE': minor_dict["Sustainable Energy"],
            'minor_EB': minor_dict["Engineering Business"],
            'minor_GL': minor_dict["Global Leadership"],
            'minor_NANO': minor_dict["Nanoengineering"],
            'minor_MP': minor_dict["Music Performance"]
        }
        res.append(res_d)
    return res

class SearchCourse(Resource):
    def get(self):
        input = request.args.get('input')
        courses = search_course_by_code(input)
        if len(courses) > 0:
            try:
                resp = app.response_class(
                    json.dumps(courses, ignore_nan=True),
                    mimetype='application/json'
                )
                #resp.status_code = 200
                return resp
            except Exception as e:
                resp = jsonify({'error': str(e)})
                resp.status_code = 400
                return resp

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('input', required=True)
        data = parser.parse_args()
        input = data['input']
        courses = search_course_by_code(input)
        if len(courses) > 0:
            try:
                resp = app.response_class(
                    json.dumps(courses, ignore_nan=True),
                    mimetype='application/json'
                )
                #resp.status_code = 200
                return resp
            except Exception as e:
                resp = jsonify({'error': 'something went wrong'})
                resp.status_code = 400
                return resp

class ShowCourse(Resource):
    def get(self):
        code = request.args.get('code')
        courses = search_course_by_code(code)
        if len(courses) == 0:
            #resp = jsonify({'message': f"Course {code} doesn't exist"})
            #resp.status_code = 404
            resp = app.response_class(
                    json.dumps({'message': f"Course {code} doesn't exist"}, ignore_nan=True),
                    mimetype='application/json'
                )
            return resp
        try:
            resp = app.response_class(
                    json.dumps({'course': courses[0]}, ignore_nan=True),
                    mimetype='application/json'
                )
            # jsonify({'course': courses[0]})
            # resp.status_code = 200
            return resp
        except Exception as e:
            resp = app.response_class(
                    json.dumps({'error': 'something went wrong'}, ignore_nan=True),
                    mimetype='application/json'
                )
            #resp = jsonify({'error': 'something went wrong'})
            #resp.status_code = 400
            return resp
    
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('code', required=True)
        data = parser.parse_args()
        code = data['code']
        courses = search_course_by_code(code)
        if len(courses) == 0:
            resp = app.response_class(
                    json.dumps({'message': f"Course {code} doesn't exist"}, ignore_nan=True),
                    mimetype='application/json'
            )
            #resp = jsonify({'message': f"Course {code} doesn't exist"})
            #resp.status_code = 404
            return resp
        try:
            resp = app.response_class(
                    json.dumps({'course': courses[0]}, ignore_nan=True),
                    mimetype='application/json'
            )
            #resp = jsonify({'course': courses[0]})
            #resp.status_code = 200
            return resp
        except Exception as e:
            resp = app.response_class(
                    json.dumps({'error': 'something went wrong'}, ignore_nan=True),
                    mimetype='application/json'
            )
            #resp = jsonify({'error': 'something went wrong'})
            #resp.status_code = 400
            return resp


def addNewCourse(input):

    code=input['course_code'].upper()
    name=input['course_name']
    division=input['division']
    department=input['department']
    description=input['course_description']
    prereq=input['prerequisites'].upper()
    coreq=input['corequisites'].upper()
    exclusion=input['exclusions'].upper()

    global df_test



    exists=df_test['Code'].str.contains(code).any()
    if(exists):
        error_code = 0 #course already exists
        res = ''
        return error_code, res 
    else:
        prereq = prereq.split(",")
        coreq = coreq.split(",")
        exclusion = exclusion.split(",")

        new_course = {'Code': code, 'Name': name, 'Division': division, 'Department': department, 'Course Description': description, 
        'Pre-requisites': prereq, 'Corequisite': coreq, 'Exclusion': exclusion}
        df_test = pd.concat([df_test , pd.DataFrame([new_course])],ignore_index=True)

        error_code = 1 # new course successfully added
        res = new_course

        df_test.to_csv("resources/test_courses.csv", index=False)

        return error_code, res


class AdminAdd(Resource):
    def get(self):
        input = request.args.get('input')
        
        courses = search_course_by_code(input)

        if len(courses) > 0:
            try:
                resp = jsonify(courses)
                resp.status_code = 200
                return resp
            except Exception as e:
                resp = jsonify({'error': str(e)})
                resp.status_code = 400
                return resp

    def post(self):

        data = request.get_json(force=True)

        input = data['input']

        if(input["action"]=="add"):
            error, new_course = addNewCourse(input)
            
            print("inpost:",new_course)
            if len(new_course) > 0:
                try:
                    resp = jsonify(new_course)
                    resp.status_code = 200
                    return resp
                except Exception as e:
                    resp = jsonify({'error': 'something went wrong'})
                    resp.status_code = 400
                    return resp
            elif(error == 0):
                resp = jsonify({'error': 'course already exists'})
                resp.status_code = 400
                return resp
        
        else:
            resp = jsonify({'error': 'something went wrong'})
            resp.status_code = 400
            return resp


def editCourse(input):

    index=input['index']
    code=input['course_code'].upper()
    name=input['course_name']
    division=input['division']
    department=input['department']
    description=input['course_description']
    prereq=input['prerequisites'].upper()
    coreq=input['corequisites'].upper()
    exclusion=input['exclusions'].upper()

    print(df_test.loc[1])

    matching_index = df_test.index[df_test['Code']==code].tolist()

    exists = False
    for i in matching_index:
        if i != index:
            exists = True

    #exists=df_test['Code'].str.contains(code).any()
    
    if(exists):
        error_code = 0 #course already exists
        res = ''
        return error_code, res 
    else:
        prereq = prereq.split(",")
        coreq = coreq.split(",")
        exclusion = exclusion.split(",")

        new_course = {'Code': code, 'Name': name, 'Division': division, 'Department': department, 'Course Description': description, 
        'Pre-requisites': prereq, 'Corequisite': coreq, 'Exclusion': exclusion}

        df_test.at[index, 'Code'] = code
        df_test.at[index, 'Name'] = name
        df_test.at[index, 'Division'] = division
        df_test.at[index, 'Department'] = department
        df_test.at[index, 'Course Description'] = description
        df_test.at[index, 'Pre-requisites'] = prereq
        df_test.at[index, 'Corequisites'] = coreq
        df_test.at[index, 'Exclusions'] = exclusion

        error_code = 1 # new course successfully added
        res = new_course

        df_test.to_csv("resources/test_courses.csv", index=False)

        return error_code, res



class AdminEdit(Resource):
    def get(self):
        input = request.args.get('input')
        
        courses = search_course_by_code(input)

        if len(courses) > 0:
            try:
                resp = jsonify(courses)
                resp.status_code = 200
                return resp
            except Exception as e:
                resp = jsonify({'error': str(e)})
                resp.status_code = 400
                return resp

    def post(self):

        data = request.get_json(force=True)
        input = data['input']

        if(input["action"]=="edit"):
            error, new_course = editCourse(input)
            
            print("inpost:",new_course)
            if len(new_course) > 0:
                try:
                    resp = jsonify(new_course)
                    resp.status_code = 200
                    return resp
                except Exception as e:
                    resp = jsonify({'error': 'something went wrong'})
                    resp.status_code = 400
                    return resp
            elif(error == 0):
                resp = jsonify({'error': 'another course with same new course code already exists'})
                resp.status_code = 400
                return resp
        
        else:
            resp = jsonify({'error': 'something went wrong'})
            resp.status_code = 400
            return resp


def admin_search(input):
    courseCode = input

    course_ids = df_test[df_test['Code'].str.contains(courseCode.upper())].index.tolist()

    if len(course_ids) == 0:
        return []
    if len(course_ids) > 10:
        course_ids = course_ids[:10]

    res = []
    for i in course_ids:
        d = df_test.iloc[i].to_dict()
        res_d = {
            'iloc_index': i,
            'code': d['Code'],
            'name': d['Name'],
            'description': d['Course Description'],
            'syllabus': "Course syllabus here.",
            'prereq': d['Pre-requisites'],
            'coreq': d['Corequisite'],
            'exclusion': d['Exclusion'] ,
            'division': d['Division'],
            'department': d['Department'] ,
        }
        res.append(res_d)
    
    return res



class AdminSearch(Resource):
    def get(self):
        input = request.args.get('input')
        courses = admin_search(input)
        #courses=search_course_by_code(input)
        if len(courses) > 0:
            try:
                resp = jsonify(courses)
                resp.status_code = 200
                return resp
            except Exception as e:
                resp = jsonify({'error': str(e)})
                resp.status_code = 400
                return resp

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('input', required=True)
        data = parser.parse_args()
        input = data['input']
        courses = search_course_by_code(input)
        if len(courses) > 0:
            try:
                resp = jsonify(courses)
                resp.status_code = 200
                return resp
            except Exception as e:
                resp = jsonify({'error': 'something went wrong'})
                resp.status_code = 400
                return resp


def addNewCourse(input):

    code=input['course_code'].upper()
    name=input['course_name']
    division=input['division']
    department=input['department']
    description=input['course_description']
    prereq=input['prerequisites'].upper()
    coreq=input['corequisites'].upper()
    exclusion=input['exclusions'].upper()

    global df_test

    print(df_test.loc[1])

    exists=df_test['Code'].str.contains(code).any()
    if(exists):
        error_code = 0 #course already exists
        res = ''
        return error_code, res 
    else:
        prereq = prereq.split(",")
        coreq = coreq.split(",")
        exclusion = exclusion.split(",")

        new_course = {'Code': code, 'Name': name, 'Division': division, 'Department': department, 'Course Description': description, 
        'Pre-requisites': prereq, 'Corequisite': coreq, 'Exclusion': exclusion}
        df_test = pd.concat([df_test , pd.DataFrame([new_course])],ignore_index=True)

        print(df_test.loc[df_test['Code'] == code])
        error_code = 1 # new course successfully added
        res = new_course

        df_test.to_csv("resources/test_courses.csv", index=False)

        return error_code, res


class AdminAdd(Resource):
    def get(self):
        input = request.args.get('input')
        
        courses = search_course_by_code(input)

        if len(courses) > 0:
            try:
                resp = jsonify(courses)
                resp.status_code = 200
                return resp
            except Exception as e:
                resp = jsonify({'error': str(e)})
                resp.status_code = 400
                return resp

    def post(self):

        #input = request.args.get('input')
        #parser = reqparse.RequestParser()
        #parser.add_argument('input', required=True)
        data = request.get_json(force=True)
        #data = parser.parse_args()
        input = data['input']
        print(type(input))
        print(input)

        if(input["action"]=="add"):
            error, new_course = addNewCourse(input)
            
            print("inpost:",new_course)
            if len(new_course) > 0:
                try:
                    resp = jsonify(new_course)
                    resp.status_code = 200
                    return resp
                except Exception as e:
                    resp = jsonify({'error': 'something went wrong'})
                    resp.status_code = 400
                    return resp
            elif(error == 0):
                resp = jsonify({'error': 'course already exists'})
                resp.status_code = 400
                return resp
        
        else:
            resp = jsonify({'error': 'something went wrong'})
            resp.status_code = 400
            return resp


def editCourse(input):

    index=input['index']
    code=input['course_code'].upper()
    name=input['course_name']
    division=input['division']
    department=input['department']
    description=input['course_description']
    prereq=input['prerequisites'].upper()
    coreq=input['corequisites'].upper()
    exclusion=input['exclusions'].upper()

    matching_index = df_test.index[df_test['Code']==code].tolist()

    exists = False
    for i in matching_index:
        if i != index:
            exists = True

    #exists=df_test['Code'].str.contains(code).any()
    
    if(exists):
        error_code = 0 #course already exists
        res = ''
        return error_code, res 
    else:
        prereq = prereq.split(",")
        coreq = coreq.split(",")
        exclusion = exclusion.split(",")

        new_course = {'Code': code, 'Name': name, 'Division': division, 'Department': department, 'Course Description': description, 
        'Pre-requisites': prereq, 'Corequisite': coreq, 'Exclusion': exclusion}
        #df_test = pd.concat([df_test , pd.DataFrame([new_course])])

        df_test.at[index, 'Code'] = code
        df_test.at[index, 'Name'] = name
        df_test.at[index, 'Division'] = division
        df_test.at[index, 'Department'] = department
        df_test.at[index, 'Course Description'] = description
        df_test.at[index, 'Pre-requisites'] = prereq
        df_test.at[index, 'Corequisite'] = coreq
        df_test.at[index, 'Exclusion'] = exclusion

        #print(df_test.loc[df_test['Code'] == code])

        error_code = 1 # new course successfully modified
        res = new_course

        df_test.to_csv("resources/test_courses.csv", index=False)
        print(df_test.loc[df_test['Code'] == code])
        return error_code, res




class AdminEdit(Resource):
    def get(self):
        input = request.args.get('input')
        
        courses = search_course_by_code(input)

        if len(courses) > 0:
            try:
                resp = jsonify(courses)
                resp.status_code = 200
                return resp
            except Exception as e:
                resp = jsonify({'error': str(e)})
                resp.status_code = 400
                return resp

    def post(self):

        #input = request.args.get('input')
        #parser = reqparse.RequestParser()
        #parser.add_argument('input', required=True)
        data = request.get_json(force=True)
        #data = parser.parse_args()
        input = data['input']
        print(type(input))
        print(input)

        if(input["action"]=="edit"):
            error, new_course = editCourse(input)
            
            print("inpost:",new_course)
            if len(new_course) > 0:
                try:
                    resp = jsonify(new_course)
                    resp.status_code = 200
                    return resp
                except Exception as e:
                    resp = jsonify({'error': 'something went wrong'})
                    resp.status_code = 400
                    return resp
            elif(error == 0):
                resp = jsonify({'error': 'another course with same new course code already exists'})
                resp.status_code = 400
                return resp
        
        else:
            resp = jsonify({'error': 'something went wrong'})
            resp.status_code = 400
            return resp


def deleteCourse(input):

    index=input['index']
    code=input['course_code'].upper()
    name=input['course_name']
    division=input['division']
    department=input['department']
    description=input['course_description']
    prereq=input['prerequisites'].upper()
    coreq=input['corequisites'].upper()
    exclusion=input['exclusions'].upper()

    new_course = {'Code': code, 'Name': name, 'Division': division, 'Department': department, 'Course Description': description, 
    'Pre-requisites': prereq, 'Corequisite': coreq, 'Exclusion': exclusion}

    global df_test

    print('before drop',df_test.loc[index])
    df_test = df_test.drop(index)
    #print('after drop',df_test.loc[index])

    error_code = 1 # new course successfully added
    res = new_course

    df_test.to_csv("resources/test_courses.csv", index=False)

    return error_code, res

class AdminDelete(Resource):
    def get(self):
        input = request.args.get('input')
        
        courses = search_course_by_code(input)

        if len(courses) > 0:
            try:
                resp = jsonify(courses)
                resp.status_code = 200
                return resp
            except Exception as e:
                resp = jsonify({'error': str(e)})
                resp.status_code = 400
                return resp

    def post(self):

        #input = request.args.get('input')
        #parser = reqparse.RequestParser()
        #parser.add_argument('input', required=True)
        data = request.get_json(force=True)
        #data = parser.parse_args()
        input = data['input']
        print(type(input))
        print(input)

        if(input["action"]=="delete"):
            error, new_course = deleteCourse(input)
            
            print("inpost:",new_course)
            if len(new_course) > 0:
                try:
                    resp = jsonify(new_course)
                    resp.status_code = 200
                    return resp
                except Exception as e:
                    resp = jsonify({'error': 'something went wrong'})
                    resp.status_code = 400
                    return resp
            elif(error == 0):
                resp = jsonify({'error': 'something went wrong'})
                resp.status_code = 400
                return resp
        
        else:
            resp = jsonify({'error': 'something went wrong'})
            resp.status_code = 400
            return resp

def admin_search(input):
    courseCode = input

    course_ids = df_test[df_test['Code'].str.contains(courseCode.upper())].index.tolist()

    if len(course_ids) == 0:
        return []
    if len(course_ids) > 10:
        course_ids = course_ids[:10]

    res = []
    for i in course_ids:
        d = df_test.iloc[i].to_dict()
        res_d = {
            'iloc_index': i,
            'code': d['Code'],
            'name': d['Name'],
            'description': d['Course Description'],
            'syllabus': "Course syllabus here.",
            'prereq': d['Pre-requisites'],
            'coreq': d['Corequisite'],
            'exclusion': d['Exclusion'] ,
            'division': d['Division'],
            'department': d['Department'] ,
        }
        res.append(res_d)
    
    #print(res)
    return res
    #print(df_test.iloc[course_ids])

    #for i in course_ids:
        #print(df_test.loc[i])



class AdminSearch(Resource):
    def get(self):
        input = request.args.get('input')
        courses = admin_search(input)
        #courses=search_course_by_code(input)
        if len(courses) > 0:
            try:
                resp = jsonify(courses)
                resp.status_code = 200
                return resp
            except Exception as e:
                resp = jsonify({'error': str(e)})
                resp.status_code = 400
                return resp

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('input', required=True)
        data = parser.parse_args()
        input = data['input']
        courses = search_course_by_code(input)
        if len(courses) > 0:
            try:
                resp = jsonify(courses)
                resp.status_code = 200
                return resp
            except Exception as e:
                resp = jsonify({'error': 'something went wrong'})
                resp.status_code = 400
                return resp


# API Endpoints
rest_api = Api(app)
# rest_api.add_resource(controller.SearchCourse, '/searchc')
rest_api.add_resource(SearchCourse, '/searchc')
# rest_api.add_resource(controller.ShowCourse, '/course/details')
rest_api.add_resource(ShowCourse, '/course/details')

rest_api.add_resource(AdminAdd, '/admin/add')
rest_api.add_resource(AdminEdit, '/admin/edit')
rest_api.add_resource(AdminDelete, '/admin/delete')
rest_api.add_resource(AdminSearch, '/admin/search')


@app.route("/", defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    # app.run(host='0.0.0.0', port=5000, extra_files=['app.py', 'controller.py', 'model.py'])

    app.run(threaded=True, port=5050) # USE PORT 5050 CUZ 5000 IS BUGGY
    # with open("test.json") as f:
    #     data = json.load(f)
    # for i in range(75):
    #     i = str(i)
    #     Course(name=data["name"][i], code=data["code"][i], description=data["description"][i], prereq=data["prereq"][i], coreq=data["coreq"][i], exclusion=data["exclusion"][i]).save()

    
    
