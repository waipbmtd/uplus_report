#!/usr/bin/python
# coding=utf-8
import json

import tornado
import tornado.web

from handlers.base import BaseHandler
import config
from models import reportConstant
from utils import WebRequrestUtil, util


API_HOST = config.api.host


class PassedHandler(BaseHandler):
    PASS_API = config.api.report_pass

    def parse_argument(self):
        self.args = dict(
            # 举报人id
            reporter_id=self.get_argument("reporter"),
            # 被举报人id
            uid=self.get_argument("u_id"),
            # report记录id
            rid=self.get_argument("id"),

            # 举报入口
            mod=self.get_argument("mod"),
            # 对应的群/秀场id
            mid=self.get_argument("mid", ""),
            # 资源url
            url=self.get_argument("url", ""),
            # 资源缩略图
            thumb_url=self.get_argument("thumb_url", ""),
            # 消息ID
            msg_id=self.get_argument("msg_id", ""),
            # 文字：
            content=self.get_argument("content", ""),
            # 拥有者ID
            owner=self.get_argument("owner", ""),
            #客服id
            cid=self.current_user.id
        )

    def v(self, k):
        return self.args.get(k)

    def log_record_pass(self):
        log_format = "%(passed)s (%(uid)s)"
        content = log_format % dict(
            uid=str(self.v("uid")),
            passed=reportConstant.REPORT_PUNISH_PASSED
        )

        if self.v("content"):
            content += " " + self.v("content").encode('utf8')
        if self.v("url"):
            content += " %s" % str(self.v("url"))
        if self.v("thumb_url"):
            content += " %s" % str(self.v("thumb_url"))

        self.record_log(content, memo=self.v("memo"))


    @util.exception_handler
    @tornado.web.authenticated
    def post(self):
        self.parse_argument()
        server_api = self.PASS_API

        data = WebRequrestUtil.getRequest2(API_HOST,
                                           server_api,
                                           parameters=dict(
                                               rid=self.v("rid"),
                                               cid=self.current_user.id,
                                               msgId=self.v("msg_id"),
                                               reporter=self.v("reporter_id")
                                           ))
        self.log_record_pass()
        return self.send_success_json(json.loads(data))
