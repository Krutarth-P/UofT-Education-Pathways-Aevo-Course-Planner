import csv
try:
    from itertools import izip 
except ImportError:
    izip = zip
from csv import reader, writer

with open('resources/minors_links.csv', 'r') as f, open('resources/minors_links_ordered.csv', 'w') as fw:
    writer(fw, delimiter=',').writerows(izip(*reader(f, delimiter=',')))

with open('resources/certs_links.csv', 'r') as f, open('resources/certs_links_ordered.csv', 'w') as fw:
    writer(fw, delimiter=',').writerows(izip(*reader(f, delimiter=',')))

#with open('resources/minors_links.csv', 'r') as csv_file: 
#    csv_reader = csv.reader(csv_file)
#    #print(csv_reader) --> Just an object in memory
#    for line in csv_reader: 
#        print(line)

        