import sys

subDomain = sys.argv[1]


httpsConfig = """<IfModule mod_ssl.c>
<VirtualHost *:443>
  ServerName %s.klouderp.com
  ServerAlias www.%s.klouderp.com
  ServerAdmin admin@klouderp.com

  ProxyPreserveHost On
    <Proxy *>
       Order allow,deny
        Allow from all
    </Proxy>
    ProxyPass / http://localhost:6666/
  ProxyPassReverse / http://localhost:6666/

  ErrorLog /var/www/logs/ERP.error.log
  CustomLog /var/www/logs/ERP.access.log combined
  SSLCertificateFile /etc/letsencrypt/live/%s.klouderp.com/fullchain.pem
  SSLCertificateKeyFile /etc/letsencrypt/live/%s.klouderp.com/privkey.pem
  Include /etc/letsencrypt/options-ssl-apache.conf

</VirtualHost>
</IfModule>"""%(subDomain, subDomain, subDomain, subDomain)

# print httpsConfig

httpsConfFile = open("/etc/apache2/sites-available/%s.klouderp.conf"%(subDomain) , "wt")
n = httpsConfFile.write(httpsConfig)
httpsConfFile.close()
