#!/usr/bin/python
# coding=utf-8
import tornado
import tornado.web

from handlers.base import BaseHandler
from storage.mysql.database import session_manage, sqlalchemy_json
from storage.mysql.models import AdminOperationLog
from utils import util
import math


class UserLogListHandler(BaseHandler):
    @util.exception_handler
    @tornado.web.authenticated
    @session_manage
    def get(self):
        # 获取指定客服日志列表详细信息
        csid = self.get_argument("csid", "")

        current = int(self.get_argument("current", 1))
        per = int(self.get_argument("per", 15))

        total = 0

        if not self.is_admin():
            csid = self.current_user.id

        if csid:
            logs = self.session.query(AdminOperationLog) \
                .filter_by(admin_user_id=csid).order_by(
                AdminOperationLog.create_time.desc()).limit(per).offset(
                per * (current-1))
            total = self.session.query(AdminOperationLog) \
                .filter_by(admin_user_id=csid).count()
        else:
            logs = self.session.query(AdminOperationLog).order_by(
                AdminOperationLog.create_time.desc()).limit(per).offset(
                per * (current-1))
            total = self.session.query(AdminOperationLog).count()
        js_logs = [
            dict(sqlalchemy_json(x), **dict(
                username=x.admin_user and x.admin_user.username or None)) for x
            in logs]
        self.record_log(u"获取指定客服日志列表详细信息 " + str(csid))
        return self.send_success_json(dict(
            data=dict(data=js_logs,
                      current=current,
                      user_id=self.current_user.id,
                      total=math.ceil(float(total) / per))))


class UserLogHandler(BaseHandler):
    @util.exception_handler
    @tornado.web.authenticated
    @session_manage
    def get(self):
        # 获取日志详细信息
        id = int(self.get_argument("id"))
        logs = self.session.query(AdminOperationLog).get(id)
        self.record_log(u"获取日志详细信息 ")
        return self.send_success_json(dict(data=sqlalchemy_json(logs)))