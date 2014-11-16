#!/usr/bin/env python
# -*- coding:utf-8 -*-
# Admin account manager
from handlers.base import BaseHandler
from models import reportConstant
from storage.mysql.database import session_manage
from storage.mysql.models import AdminUser
from utils import util, WebRequrestUtil
import config
import json

API_HOST = config.api.host


class UserHandler(BaseHandler):
    """
    获取用户信息
    """

    @util.exception_handler
    @session_manage
    def get(self):
        user_id = self.get_argument("id")
        user = self.session.query(AdminUser).get(user_id)
        self.json(user.__json__())

    @util.exception_handler
    @session_manage
    def post(self):
        # 创建用户
        username = self.get_argument("username")
        password = self.get_argument("password")
        password = util.hash_password(password)
        user = AdminUser(username=username, password=password)
        self.session.add(user)

    @util.exception_handler
    @session_manage
    def delete(self):
        # 删除某个用户
        userid = int(self.get_argument("userid", -1))
        if userid < 1:
            return self.send_error_json(info="用户不存在")

        user = self.session.query(AdminUser).get(userid)
        if user:
            self.session.delete(user)
            return self.send_success_json(info="删除成功")
        self.send_error_json(info="删除失败")


class UserBaseHandler(BaseHandler):
    def __init__(self, *args, **kwargs):
        super(BaseHandler, self).__init__(*args, **kwargs)
        self.args = {}

    def parse_argument(self):
        self.args = dict(
            # 被解封人id
            uid=self.get_argument("u_id", ""),
            # 备注：
            memo=self.get_argument("memo", ""),
            # 客服id
            cid=self.current_user.id
        )

    def v(self, key):
        return self.args.get(key)


class UnlockUserHandler(UserBaseHandler):
    UNLOCK_API = config.api.user_unlock
    """
    用户解封
    """

    def log_record_unlock(self):
        log_format = "%(unlock)s (%(uid)s)"
        content = log_format % dict(
            uid=str(self.v("uid")),
            unlock=reportConstant.REPORT_USER_UNLOCK
        )

        self.record_log(content, memo=self.v("memo"))

    @util.exception_handler
    @session_manage
    def post(self):
        self.parse_argument()
        server_api = self.UNLOCK_API % dict(uid=self.v("uid"))
        data = WebRequrestUtil.getRequest2(API_HOST,
                                           server_api,
                                           parameters=dict(
                                               uid=self.v("uid"),
                                               cid=self.current_user.id,
                                           ))
        self.log_record_unlock()
        return self.send_success_json(json.loads(data))