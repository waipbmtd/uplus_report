#!/usr/bin/python
# coding=utf-8
import logging
import traceback
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

from config import database as db_config


statistics_db = db_config.uplus_admin

db_name = statistics_db.get("db_name")
dialect = statistics_db.get("dialect")
user = statistics_db.get("user")
host = statistics_db.get("host")
password = statistics_db.get("password")
charset = statistics_db.get("charset")
echo = str(statistics_db.get) == "True"

db_path = "%s://%s:%s@%s/%s?charset=%s" % (
    dialect, user, password, host, db_name, charset)
engine = create_engine(db_path, echo=echo, pool_size=10, max_overflow=20,
                       pool_recycle=7200)

DB_Session = sessionmaker(bind=engine)

Base = declarative_base()


# 给Base添加__json__方法 使输出JSON数据
def sqlalchemy_json(self):
    obj_dict = self.__dict__
    return dict(
        (key, obj_dict[key]) for key in obj_dict if
        not key.startswith("_") and key != 'metadata')


Base.__json__ = sqlalchemy_json


def session_manage(fn):
    def wrapper(*args, **kwargs):
        cls = args[0]
        cls.session = DB_Session()
        try:
            result = fn(*args, **kwargs)
            cls.session.commit()
            return result
        except Exception, e:
            cls.session.rollback()
            logging.error("database exception is %s" % traceback.format_exc())
            raise e
        finally:
            cls.session.close()

    return wrapper


def init_db():
    Base.metadata.create_all(bind=engine)
