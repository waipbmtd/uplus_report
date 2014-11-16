"""
Created on Sep 13, 2012

@author: root
"""

from redis.client import Redis

import config


host = config.redis.redis_high_risk["host"]
port = int(config.redis.redis_high_risk["port"])
db = int(config.redis.redis_high_risk["db"])
redis_risk_user = Redis(host=host, port=port, db=db)

host = config.redis.redis_special_user["host"]
port = int(config.redis.redis_special_user["port"])
db = int(config.redis.redis_special_user["db"])
redis_special_user = Redis(host=host, port=port, db=db)
