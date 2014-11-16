#!/usr/bin/python
# coding=utf-8
from handlers.base import BaseHandler
import config
from models import reportConstant
from storage.mysql.database import session_manage
from utils import WebRequrestUtil, util
import json

API_HOST = config.api.host


class ShowBaseHandler(BaseHandler):
    def __init__(self, *args, **kwargs):
        super(BaseHandler, self).__init__(*args, **kwargs)
        self.args = {}

    def parse_argument(self):
        self.args = dict(
            # 被举报人id
            uid=self.get_argument("u_id", ""),
            # 秀场id
            show_id=self.get_argument("module_id"),
            # 备注：
            memo=self.get_argument("memo", ""),
            # 客服id
            cid=self.current_user.id
        )

    def v(self, key):
        return self.args.get(key)


class OpenMouthShowHandler(ShowBaseHandler):
    OPEN_MOUTH_API = config.api.show_openmouth
    """
    秀场解除禁言
    """

    def log_record_open_mouth(self):
        log_format = "%(open)s (%(uid)s)"
        content = log_format % dict(
            uid=str(self.v("uid")),
            open=reportConstant.REPORT_SHOW_OPEN_MOUTH
        )

        self.record_log(content, memo=self.v("memo"))

    def post(self):
        self.parse_argument()
        server_api = self.OPEN_MOUTH_API % dict(showId=self.v("show_id"))
        data = WebRequrestUtil.getRequest2(API_HOST,
                                           server_api,
                                           parameters=dict(
                                               uid=self.v("uid"),
                                               cid=self.current_user.id,
                                           ))
        self.log_record_open_mouth()
        return self.send_success_json(json.loads(data))


class UnlockShowHandler(ShowBaseHandler):
    UNLOCK_API = config.api.show_unlock
    """
    秀场解封
    """

    def log_record_unlock(self):
        log_format = "%(unlock)s (%(uid)s)"
        content = log_format % dict(
            uid=str(self.v("uid")),
            unlock=reportConstant.REPORT_SHOW_UNLOCK
        )

        self.record_log(content, memo=self.v("memo"))

    @util.exception_handler
    @session_manage
    def post(self):
        self.parse_argument()
        server_api = self.UNLOCK_API % dict(showId=self.v("show_id"))
        data = WebRequrestUtil.getRequest2(API_HOST,
                                           server_api,
                                           parameters=dict(
                                               cid=self.current_user.id,
                                           ))
        self.log_record_unlock()
        return self.send_success_json(json.loads(data))


