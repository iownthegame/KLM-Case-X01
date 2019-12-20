## KLM Case X01

* Design
    - Search Fares and Airports API
    - Request Stats API
    - Design web interface

* Back-end
    -  Python 3.7 + Django Framework
    -  Implement an API for searching fares and airports
        - use simple-travel-api-mock
          - do Basic Auth authentication
          - call fares and airports API
        - parse airport list once to get all codes
        - allow to search by keyword or code of airport
        - pagination
    - Implement an API for fetching request stats
        - add a middleware before request/response be processed
        - record api path, status code, request time, response time
    - Database
        - PostgreSQL table: request_records
	    - schema: see ```backend/mysite/db_backup``` file for more information
    -  Run
        - go to directory ```cd backend```
        - create Python virtualenv ```virtualenv -p python3 py3env```
        - activate env ```source py3env/bin/activate```
        - install packages ```pip install -r requirement.txt```
        - execute ```python manage.py runserver 0.0.0.0:8000```
	- configure ```DEBUG = True``` to switch production / development environment

* Front-end
    - React 16.12.10 + React Bootstrap
    - Implement a webpage for searching fares and airports, and fetching request stats
    - Call Back-end API
	- Searching for fares
        - autocomplete origin and destination
        - loading spinner
        - show fare results
    - Listing airports
        - default fetching airport list for 1 page
        - search by typing keywords or codes of airport
        - show airport list result in table
        - pagination
    - Request stats dashboard
        - show requests stats group by different api path in table
        - calculate #ok, #4xx, #55 status requests
        - calculate avg / min / max response time
    - Support RWD
    - Run
        - go to directory ```cd frontend/my-app```
        - install packages ```npm install```
        - set proxy in `package.json` ```"proxy": "http://localhost:8000"```
        - run dev ```npm run start```
        - run production ```npm run build```
        - open browser ```http://localhost:3000```
