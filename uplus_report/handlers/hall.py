#!/usr/bin/python
# coding=utf-8
from handlers.base import BaseHandler
import config
from models import reportConstant
from utils import WebRequrestUtil
import json

API_HOST = config.api.host


class OpenMouthHallHandler(BaseHandler):
    OPEN_MOUTH_API = config.api.hall_openmouth
    """
    解除禁言
    """

    def parse_argument(self):
        self.args = dict(
            # 被举报人id
            uid=self.get_argument("u_id"),
            # 备注：
            memo=self.get_argument("memo", ""),
            # 消息ID
            msg_id=self.get_argument("msg_id", ""),
            # 客服id
            csid=self.current_user.id
        )

    def v(self, key):
        return self.args.get(key)

    def log_record_open_mouth(self):
        log_format = "%(passed)s (%(uid)s)"
        content = log_format % dict(
            uid=str(self.v("uid")),
            passed=reportConstant.REPORT_HALL_OPEN_MOUTH
        )

        self.record_log(content, memo=self.v("memo"))

    def post(self):
        self.parse_argument()
        server_api = self.OPEN_MOUTH_API
        data = WebRequrestUtil.getRequest2(API_HOST,
                                           server_api,
                                           parameters=dict(
                                               uid=self.v("uid"),
                                               msgId=self.v("msg_id"),
                                               csid=self.current_user.id,
                                           ))
        return self.send_success_json(json.loads(data))

    def on_finish(self):
        self.log_record_open_mouth()