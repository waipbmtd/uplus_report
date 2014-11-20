#!/usr/bin/python
# coding=utf-8
import datetime
from storage.mysql import database

from storage.mysql.models import AdminUser, AdminOperationLog
from utils.util import hash_password


def testAddAdminuser(session, username, password):
    user1 = AdminUser(username=username, password=hash_password(password),
                      role='admin',
                      state=True,
                      create_time=datetime.datetime.now(),
                      update_time=datetime.datetime.now())
    session.add_all([user1])
    session.commit()


def testAddEditoruser(session):
    user1 = AdminUser(username='editor01', password=hash_password('qwe123'),
                      role='editor',
                      state=True,
                      create_time=datetime.datetime.now(),
                      update_time=datetime.datetime.now())
    session.add_all([user1])
    session.commit()


def teatAddAdminLog(session):
    user1 = session.query(AdminUser).get(1)
    log = AdminOperationLog(content="禁言",
                            create_time=datetime.datetime.now(),
                            ip="192.168.1.180")
    user1.logs.append(log)


def getAllAdminuser(session):
    users = session.query(AdminUser).all()
    for x in users:
        print x.__dict__


if __name__ == "__main__":
    database.init_db()
    session = database.DB_Session()

    # getAllAdminuser(session)
    testAddAdminuser(session, 'a3', 'qwe123')
    # teatAddAdminLog(session)
    # testAddEditoruser(session)
    session.commit()
    session.close()
