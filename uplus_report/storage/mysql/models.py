#!/usr/bin/python
# coding=utf-8
import datetime

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, \
    ForeignKey
from sqlalchemy.orm import relationship

from storage.mysql.database import Base


class AdminUser(Base):
    __tablename__ = "admin_user"

    id = Column("csid", Integer, primary_key=True, nullable=False)
    username = Column('name', String(20), nullable=False, unique=True)
    password = Column('password', String(50))
    role = Column('role', Enum('admin', 'editor'))
    realname = Column('realname', String(50))
    state = Column('state', Boolean(True), default=True)
    create_time = Column('create_time', DateTime,
                         default=datetime.datetime.now())
    update_time = Column('update_time', DateTime,
                         default=datetime.datetime.now())
    logs = relationship("AdminOperationLog", backref="admin_user")

    def __repr__(self):
        return "AdminUser<name: %s  role: %s>" % (self.username, self.role)


class AdminOperationLog(Base):
    __tablename__ = "admin_operation_log"

    id = Column(Integer, primary_key=True, nullable=False)
    csid = Column("csid", ForeignKey('admin_user.csid'))
    content = Column('content', String(1000))
    create_time = Column('create_time', DateTime)
    ip = Column('ip', String(50))

    def __repr__(self):
        return "admin_operation_log<content: %s ip: %s>" % (self.content,
                                                            self.ip)
