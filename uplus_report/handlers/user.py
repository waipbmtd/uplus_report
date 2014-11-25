#!/usr/bin/env python
# -*- coding:utf-8 -*-
# Admin account manager
import time
import tornado
import tornado.web
from handlers.base import BaseHandler
from models import reportConstant, redisConstant, userConstant
from storage.mysql.database import session_manage, sqlalchemy_json
from storage.mysql.models import AdminUser
from storage.redis.redisClient import redis_risk_user, redis_special_user
from utils import util, WebRequrestUtil
import config
import json

API_HOST = config.api.host


class UserListHandler(BaseHandler):
    """
    获取所有用户列表
    """

    @util.exception_handler
    @session_manage
    @tornado.web.authenticated
    def get(self):
        if self.is_admin():
            users = self.session.query(AdminUser).all()
        else:
            users = self.session.query(AdminUser).filter(
                AdminUser.id == self.current_user.id)
        data = self.send_success_json(
            dict(data=[sqlalchemy_json(x) for x in users]))
        self.record_log(u" 获取系统用户列表 ")
        return data


class UserNameIdListHandler(BaseHandler):
    """
    获取所有用户列表
    """

    @util.exception_handler
    @session_manage
    @tornado.web.authenticated
    def get(self):
        if self.is_admin():
            users = self.session.query(AdminUser.username, AdminUser.id).all()
        else:
            users = self.session.query(AdminUser.username,
                                       AdminUser.id).\
                filter(AdminUser.id == self.current_user.id)
        data = self.send_success_json(
            dict(data=[sqlalchemy_json(x) for x in users]))
        self.record_log(u" 获取系统用户名称和编号列表 ")
        return data


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
        role = self.get_argument("role", userConstant.USER_ROLE_EDITOR)
        real_name = self.get_argument("real_name", "")
        state = int(self.get_argument("state", 0)) == 1

        password = util.hash_password(password)
        user = AdminUser(username=username, password=password, role=role,
                         real_name=real_name, state=state)
        self.session.add(user)
        self.record_log(u"创建用户 " + username.encode("utf8"))
        return self.send_success_json()

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
            self.record_log(u"删除用户 " + user.username.encode("utf8"))
            self.session.delete(user)
            return self.send_success_json(info="删除成功")
        self.send_error_json(info="删除失败")



class UplusUserBaseHandler(BaseHandler):
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


class UnlockUplusUserHandler(UplusUserBaseHandler):
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
    TYPE = ""

    @util.exception_handler
    @tornado.web.authenticated
    def get(self):
        users = self._redis.zrangebyscore(self.KEY, 0, "+inf", withscores=True)
        self.record_log(content=self.TYPE.decode('utf8') + u" 获取列表")
        return self.send_success_json(
            dict(data=[dict(user_id=x[0], create_time=x[1]) for x in users])
        )


class UplusUserRedisBaseHandler(BaseHandler):
    _redis = ""
    KEY = ""
    TYPE = ""

    @util.exception_handler
    @tornado.web.authenticated
    def get(self):
        user_id = self.get_argument("user_id")
        score = self._redis.zscore(self.KEY, user_id)
        self.record_log(content=self.TYPE.decode('utf8') + u" 获取用户 " + user_id)
        return self.send_success_json(
            dict(data=dict(user_id=user_id, create_time=score)))

    @util.exception_handler
    @tornado.web.authenticated
    def post(self):
        user_id = self.get_argument("user_id")
        score = int(time.time() * 1000)
        self._redis.zadd(self.KEY, user_id, score)
        self.record_log(content=self.TYPE.decode('utf8') + u" 添加用户 " + user_id)
        return self.send_success_json(
            dict(data=dict(user_id=user_id, create_time=score)))

    @util.exception_handler
    @tornado.web.authenticated
    def delete(self):
        user_id = self.get_argument("user_id")
        self._redis.zrem(self.KEY, user_id)
        self.record_log(content=self.TYPE.decode('utf8') + u" 删除用户 " + user_id)
        return self.send_success_json(dict(data=dict(user_id=user_id)))


class HighRiskUplusUserListHandler(UplusUserListBaseHandler):
    _redis = redis_risk_user
    KEY = redisConstant.REDIS_HIGH_RISK_KEY
    TYPE = reportConstant.USER_HIGH_RISK


class HighRiskUplusUserHandler(UplusUserRedisBaseHandler):
    _redis = redis_risk_user
    KEY = redisConstant.REDIS_HIGH_RISK_KEY
    TYPE = reportConstant.USER_HIGH_RISK


class SpecialUplusUserListHandler(UplusUserListBaseHandler):
    _redis = redis_special_user
    KEY = redisConstant.REDIS_SPECIAL_USER_KEY
    TYPE = reportConstant.USER_SPECIAL


class SpecialUplusUserHandler(UplusUserRedisBaseHandler):
    _redis = redis_special_user
    KEY = redisConstant.REDIS_SPECIAL_USER_KEY
    TYPE = reportConstant.USER_SPECIAL