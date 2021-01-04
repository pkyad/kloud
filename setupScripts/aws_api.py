accessKey = 'AKIASYEHRRSVXINEE2WL'
key = 'tZ97JMDn/1qBkbtywaimPDz88osy4rRO5l0jejnf'
import sys
subDomain = sys.argv[1]

import route53
conn = route53.connect(
    aws_access_key_id=accessKey,
    aws_secret_access_key=key
)

zone = conn.get_hosted_zone_by_id('Z0122103ZA77807EOKJT')
print zone

new_record, change_info = zone.create_a_record(
    name= subDomain + '.klouderp.com.',
    values=['3.7.55.23'],
)

print new_record , change_info
