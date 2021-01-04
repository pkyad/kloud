mysql -u newuser -p < setupDB.sql
python manage.py migrate
mysql -u newuser -p < apps.sql
mysql -u newuser -p < pincode.sql
mysql -u newuser -p < users.sql
