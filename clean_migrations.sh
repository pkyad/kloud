find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc"  -delete
mysql -u newuser -ptitan@1234 < setupDB.sql
python manage.py makemigrations
python manage.py migrate
mysql -u newuser -ptitan@1234 < apps.sql
mysql -u newuser -ptitan@1234 < pincode.sql
mysql -u newuser -ptitan@1234 < users.sql
mysql -u newuser -ptitan@1234 < website_uielementtemplate.sql
mysql -u newuser -ptitan@1234 < ERP_appsettingsfield.sql
mysql -u newuser -ptitan@1234 < organization_companyholidays.sql
