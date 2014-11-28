#!/usr/bin/python
# coding=utf-8
from handlers.base import BaseHandler
import tornado
import tornado.web
from models import reportConstant


class RenderHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self, path):
        kwargs = dict(
            path=path,
            username=self.current_user.username,
            role=self.current_user.role,
            report_type=reportConstant.REPORT_TYPE_COMM
        )
        if path == "report_risk":
            kwargs.update(dict(report_type=reportConstant.REPORT_TYPE_RISK))
        if path == "report_resource":
            kwargs.update(dict(report_type=reportConstant.REPORT_TYPE_RESOURCE))
        self.render("index.html", **kwargs)

    def post(self, path):
        pass