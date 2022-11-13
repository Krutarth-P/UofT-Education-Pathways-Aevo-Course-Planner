# this is the flask core

from flask import Flask, send_from_directory, jsonify, request
from flask_restful import Api,Resource, reqparse
import json
import os

import pandas as pd
df = pd.read_csv("resources/courses.csv")
minors_df = pd.read_csv("resources/eng_minor_list_dummy.csv") #TODO: WILL NEED TO BE UPDATED WITH FULL MINOR CSV
timetable_df = pd.read_csv("resources/course_times.csv")

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


# route functions

def search_course_timings(s):
        # return all the courses whose course code contains the str s
    # Use delimiter to specify search: no delimiter assumes course code but can also use ;cc:,  ;ti: means title, ;de:description
    # inclusion of delimiter assumes forced AND of search terms
    # look for delimiter
    # courseCode = ''
    # courseDesc = ''
    # courseTitle = ''
    # course_ids = []
    # if ';' in s:
    #     parsed_input = s.split(';')
    #     for term in parsed_input:
    #         if len(term) > 0: #if empty string skip it
    #             if (':' not in term or 'cc:' in term) and courseCode=='':
    #                 courseCode = term if ':' not in term else term.split(':')[-1]
    #             elif 'ti:' in term and courseTitle == '':
    #                 courseTitle = term.split(':')[-1]
    #             elif 'de:' in term and courseDesc == '':
    #                 courseDesc = term.split(':')[-1]
    #             else:
    #                 return [] # invalid use of delimiters and symbols will return nothing
    # else:
    courseCode = s

    cc_course_ids = timetable_df[timetable_df['Code'].str.contains(courseCode.upper())].index.tolist()

    # if courseDesc != '':
    #     desc_course_ids = timetable_df[timetable_df['Course Description'].str.contains(courseDesc,na=False)].index.tolist()
    # else:
    #     desc_course_ids = cc_course_ids.copy()

    # if courseTitle != '':
    #     #capitalize title term string by default since all words in course names are capitalized
    #     title_course_ids = timetable_df[timetable_df['Name'].str.contains(courseTitle.capitalize(),na=False)].index.tolist() 
    # else:
    #     title_course_ids = cc_course_ids.copy()

    # find course ids that match all input filters
    # course_ids = list(set.intersection(*map(set, [cc_course_ids, desc_course_ids, title_course_ids])))
    course_ids = cc_course_ids
    #print('returned course ids:',course_ids)
    if len(course_ids) == 0:
        return []
    if len(course_ids) > 2:
        course_ids = course_ids[:1]
    res = []
    
    for i, course_id in enumerate(course_ids):
        d = timetable_df.iloc[course_id].to_dict()
        course_activity_times = json.loads(d['course_activity_times'])
        
        res_d = {
            '_id': i,
            'code': d['Code'],
            'name': d['Name'],
            'description': d['Course Description'],
            'course_activities': course_activity_times
        }
        # for key in course_activity_times:
        #     res_d[key]= course_activity_times[key]
        res.append(res_d)
    return res
def search_course_by_code(s):
    # return all the courses whose course code contains the str s
    # Use delimiter to specify search: no delimiter assumes course code but can also use ;cc:,  ;ti: means title, ;de:description
    # inclusion of delimiter assumes forced AND of search terms
    # look for delimiter
    courseCode = ''
    courseDesc = ''
    courseTitle = ''
    course_ids = []
    if ';' in s:
        parsed_input = s.split(';')
        for term in parsed_input:
            if len(term) > 0: #if empty string skip it
                if (':' not in term or 'cc:' in term) and courseCode=='':
                    courseCode = term if ':' not in term else term.split(':')[-1]
                elif 'ti:' in term and courseTitle == '':
                    courseTitle = term.split(':')[-1]
                elif 'de:' in term and courseDesc == '':
                    courseDesc = term.split(':')[-1]
                else:
                    return [] # invalid use of delimiters and symbols will return nothing
    else:
        courseCode = s

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

    # find course ids that match all input filters
    course_ids = list(set.intersection(*map(set, [cc_course_ids, desc_course_ids, title_course_ids])))
    #print('returned course ids:',course_ids)
    if len(course_ids) == 0:
        return []
    if len(course_ids) > 10:
        course_ids = course_ids[:10]
    res = []
    minor_dict = {
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
            'syllabus': "Course syllabus here.",
            'prereq': d['Pre-requisites'],
            'coreq': d['Corequisite'],
            'exclusion': d['Exclusion'] ,
            'division': d['Division'],
            'department': d['Department'] ,
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

def export_course_timing(input): 
    #Return a list of course codes (keys) and their timings (course_code + course_activity + course_timing)
    #as first a json 
    #then csv
    if ',' in line: 
        parsed_input = input.parse(',')
        
class SearchCourse(Resource):
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

class ShowCourse(Resource):
    def get(self):
        code = request.args.get('code')
        courses = search_course_by_code(code)
        if len(courses) == 0:
            resp = jsonify({'message': f"Course {code} doesn't exist"})
            resp.status_code = 404
            return resp
        try:
            resp = jsonify({'course': courses[0]})
            resp.status_code = 200
            return resp
        except Exception as e:
            resp = jsonify({'error': 'something went wrong'})
            resp.status_code = 400
            return resp
    
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('code', required=True)
        data = parser.parse_args()
        code = data['code']
        courses = search_course_by_code(code)
        if len(courses) == 0:
            resp = jsonify({'message': f"Course {code} doesn't exist"})
            resp.status_code = 404
            return resp
        try:
            resp = jsonify({'course': courses[0]})
            resp.status_code = 200
            return resp
        except Exception as e:
            resp = jsonify({'error': 'something went wrong'})
            resp.status_code = 400
            return resp

class SearchCourseTiming(Resource):
    def get(self):
        input = request.args.get('input')
        courses = search_course_timings(input)
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
        courses = search_course_timings(input)
        if len(courses) > 0:
            try:
                resp = jsonify(courses)
                resp.status_code = 200
                return resp
            except Exception as e:
                resp = jsonify({'error': 'something went wrong'})
                resp.status_code = 400
                return resp

class ExportCourseTiming(Resource):
    def get(self):
        input = request.args.get('input')
        courses = export_course_timing(input)
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
        courses = search_course_timings(input)
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
rest_api.add_resource(SearchCourseTiming, '/timetable-helper')
rest_api.add_resource(ExportCourseTiming, '/timetable-helper')


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

    
    
