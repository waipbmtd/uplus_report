#!/usr/bin/env python
# -*- coding:utf-8 -*-
# Admin account manager
import time
import tornado
import tornado.web
from handlers.base import BaseHandler
from models import reportConstant, redisConstant
from storage.mysql.database import session_manage
from storage.mysql.models import AdminUser
from storage.redis.redisClient import redis_risk_user, redis_special_user
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
    @tornado.web.authenticated
    def get(self):
        user_id = self.get_argument("id")
        user = self.session.query(AdminUser).get(user_id)
        self.json(user.__json__())

    @util.exception_handler
    @session_manage
    @tornado.web.authenticated
    def post(self):
        # 创建用户
        username = self.get_argument("username")
        password = self.get_argument("password")
        password = util.hash_password(password)
        user = AdminUser(username=username, password=password)
        self.session.add(user)

    @util.exception_handler
    @session_manage
    @tornado.web.authenticated
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
            csid=self.current_user.id
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
    @tornado.web.authenticated
    def post(self):
        self.parse_argument()
        server_api = self.UNLOCK_API % dict(uid=self.v("uid"))
        data = WebRequrestUtil.getRequest2(API_HOST,
                                           server_api,
                                           parameters=dict(
                                               uid=self.v("uid"),
                                               csid=self.current_user.id,
                                               msgId=self.v("msg_id"),
                                           ))
        self.log_record_unlock()
        return self.send_success_json(json.loads(data))


class UplusUserListBaseHandler(BaseHandler):
    _redis = ""
    KEY = ""

    @util.exception_handler
    @tornado.web.authenticated
    def get(self):
        users = self._redis.zrangebyscore(self.KEY, 0, "+inf", withscores=True)
        return self.send_success_json(
            dict(data=[dict(user_id=x[0], create_time=x[1]) for x in users])
        )


class UplusUserBaseHandler(BaseHandler):
    _redis = ""
    KEY = ""

    @util.exception_handler
    @tornado.web.authenticated
    def get(self):
        user_id = self.get_argument("user_id")
        score = self._redis.zscore(self.KEY, user_id)
        return self.send_success_json(
            dict(data=dict(user_id=user_id, create_time=score)))

    @util.exception_handler
    @tornado.web.authenticated
    def post(self):
        user_id = self.get_argument("user_id")
        score = int(time.time() * 1000)
        self._redis.zadd(self.KEY, user_id, score)
        return self.send_success_json(
            dict(data=dict(user_id=user_id, create_time=score)))

    @util.exception_handler
    @tornado.web.authenticated
    def delete(self):
        user_id = self.get_argument("user_id")
        self._redis.zrem(self.KEY, user_id)
        return self.send_success_json(dict(data=dict(user_id=user_id)))


class HighRiskUserListHandler(UplusUserListBaseHandler):
    _redis = redis_risk_user
    KEY = redisConstant.REDIS_HIGH_RISK_KEY


class HighRiskUserHandler(UplusUserBaseHandler):
    _redis = redis_risk_user
    KEY = redisConstant.REDIS_HIGH_RISK_KEY


class SpecialUserListHandler(UplusUserListBaseHandler):
    _redis = redis_special_user
    KEY = redisConstant.REDIS_SPECIAL_USER_KEY


class SpecialUserHandler(UplusUserBaseHandler):
    _redis = redis_special_user
    KEY = redisConstant.REDIS_SPECIAL_USER_KEY