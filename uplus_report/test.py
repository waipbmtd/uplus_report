#!/usr/bin/python
# coding=utf-8
import datetime
from storage.mysql import database

from storage.mysql.models import AdminUser
from utils.util import hash_password


def testAdminuser(session):
    user1 = AdminUser(username='daixuefeng',password=hash_password('qwe123'),
                      role='admin',
                      state=True,
                      create_time=datetime.datetime.now(),
                      update_time=datetime.datetime.now())
    session.add_all([user1])
    session.commit()

def getAllAdminuser(session):
    users = session.query(AdminUser).all()
    for x in users :
        print x.__dict__





if __name__ == "__main__":
    database.init_db()
    session = database.DB_Session()

    # getAllAdminuser(session)
    testAdminuser(session)

    session.commit()
    session.close()
