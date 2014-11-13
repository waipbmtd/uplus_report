#!/usr/bin/env python
# -*- coding: utf-8 -*-

import time

from base import BaseHandler
from storage.mysql.database import session_manange
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
            'next', default="/"))

    @session_manange
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
            return self.redirect("/")

        now = time.time()
        expire_time = now + int(config.app.max_idle_time)
        self.set_secure_cookie("r_u_a_e", u'{}'.format(expire_time))
        self.set_secure_cookie("r_u_a", u'{}'.format(user.id))
        return self.redirect(self.get_argument("next", default="/"))


class LogoutHandler(BaseHandler):
    """
    管理成员账号登出
    """

    def get(self):
        self.clear_cookie('u_a')
        self.clear_cookie('u_a_e')
        return self.redirect("/")
