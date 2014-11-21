#!/usr/bin/env python
#-*- coding: utf-8 -*-
#数据库对象
#一个简单的数据库链接池

try:
    from tornado import database
except ImportError:
    import torndb as database

class connPool():
    _pools = []
    def __init__(self, host, db_name, user="", password="", connections=1, time_zone='+08:00', idle_time=5 * 3600):
        connections = int(connections)
        self._pools = []
        self._pool_size = connections
        self._db_index = 0
        init_command = 'SET time_zone="%s"' % time_zone
        for i in xrange(connections):
            #设置最大失效时间默认1年
            db = database.Connection(host, db_name, user=user, password=password, max_idle_time=idle_time)
            db.execute(init_command)
            self._pools.append(db)

    @property
    def db(self):
        if self._db_index == self._pool_size - 1:
            self._db_index = 0
        else:
            self._db_index = self._db_index + 1
        return self._pools[self._db_index]