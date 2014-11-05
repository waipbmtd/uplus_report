#!/usr/bin/python
# coding=utf-8
import tornado
import tornado.web
from handlers.base import BaseHandler
from storage.mysql.database import session_manange


class CommonMsgHandler(BaseHandler):
    """
    管理成员账号登陆
    """

    @tornado.web.authenticated
    def get(self):
        return self.render("comm_msg/main.html")

    @tornado.web.authenticated
    @session_manange
    def post(self):
        pass