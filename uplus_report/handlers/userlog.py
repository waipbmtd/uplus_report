#!/usr/bin/python
# coding=utf-8
from handlers.base import BaseHandler
from storage.mysql.database import session_manage, sqlalchemy_json
from storage.mysql.models import AdminOperationLog
from utils import util
import tornado
import tornado.web


class UserLogListHandler(BaseHandler):
    @util.exception_handler
    @tornado.web.authenticated
    @session_manage
    def get(self):
        # 获取指定客服日志列表详细信息
        csid = self.get_argument("csid", "")
        if not self.is_admin():
            csid = self.current_user.id

        if csid:
            logs = self.session.query(AdminOperationLog) \
                .filter_by(admin_user_id=csid)
        else:
            logs = self.session.query(AdminOperationLog).all()
        js_logs = [sqlalchemy_json(x) for x in logs]
        return self.send_success_json(dict(data=js_logs))


class UserLogHandler(BaseHandler):
    @util.exception_handler
    @tornado.web.authenticated
    @session_manage
    def get(self):
        # 获取日志列表详细信息
        id = int(self.get_argument("id"))
        logs = self.session.query(AdminOperationLog).get(id)
        return self.send_success_json(dict(data=sqlalchemy_json(logs)))