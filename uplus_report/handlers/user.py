#!/usr/bin/env python
#-*- coding:utf-8 -*-
# Admin account manager
from handlers.base import BaseHandler
from storage.mysql.database import session_manange
from storage.mysql.models import AdminUser
from utils.util import hash_password


class UserHandler(BaseHandler):
    "获取用户信息"
    @session_manange
    def get(self):
        user_id = self.get_argument("id")
        user = self.session.query(AdminUser).get(user_id)
        self.json(user.__json__())

    "创建用户"
    @session_manange
    def post(self):
        username = self.get_argument("username")
        password = self.get_argument("password")
        password = hash_password(password)
        user = AdminUser(username=username, password=password)
        self.session.add(user)

    "更新用户"
    @session_manange
    def put(self):
        pass

    "删除用户"
    @session_manange
    def delete(self):
        "删除某个用户"
        userid = int(self.get_argument("userid",-1))
        if userid < 1 :
            return self.send_error_json("用户不存在")

        user = self.session.query(AdminUser).get(userid)
        if user :
            self.session.delete(user)
            return self.send_success_json("删除成功")
        self.send_error_json("删除失败")
