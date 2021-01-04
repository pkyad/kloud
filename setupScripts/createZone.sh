python aws_api.py $1
sleep 5
certbot certonly --apache --agree-tos -d $1.klouderp.com
python certbot_api.py $1
a2ensite $1.klouderp.conf
sleep 2
service apache2 reload
