#!/usr/bin/env python
# -*- coding: utf-8 -*-

import time
import datetime
import tornado
import tornado.web

from base import BaseHandler
from storage.mysql.database import session_manage
import config
from storage.mysql import models
from utils import util


class LoginHandler(BaseHandler):
    """
    管理成员账号登陆
    """

    @property
    def get(self):
        if self.current_user:
            self.redirect('/')
            return 0
        return self.render("login.html", next=self.get_argument(
            'next', default="/"), name="hello", report_type=0)

    @session_manage
    def post(self):
        if self.current_user:
            self.redirect('/')

        username = self.get_argument("username", default=None)
        password = self.get_argument("password", default=None)

        username = username.lower()
        hash_password = util.hash_password(password)
        user = self.session.query(models.AdminUser).filter_by(
            username=username, password=hash_password).first()

        if not user:
            self.record_log(content=u"登录失败：" + username)
            return self.redirect("/")

        self.record_log(content=u"登录成功：" + username)
        self.session.query(models.AdminUser).filter_by(id=user.id). \
            update({"update_time": datetime.datetime.now()})

        now = time.time()
        expire_time = now + int(config.app.max_idle_time)
        self.set_secure_cookie("r_u_a_e", u'{}'.format(expire_time))
        self.set_secure_cookie("r_u_a", u'{}'.format(user.id))
        return self.redirect(self.get_argument("next", default="/"))


class LogoutHandler(BaseHandler):
    """
    管理成员账号登出
    """

    @tornado.web.authenticated
    def get(self):
        self.clear_cookie('r_u_a')
        self.clear_cookie('r_u_a_e')
        self.record_log(content=u"用户登出：" + self.current_user.username)
        return self.redirect('/')
