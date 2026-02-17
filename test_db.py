import MySQLdb
try:
    db = MySQLdb.connect(host="localhost", user="campus_management", passwd="akbar@27022004")
    cursor = db.cursor()
    cursor.execute("SHOW DATABASES")
    for x in cursor:
      print(x)
except Exception as e:
    print(e)
