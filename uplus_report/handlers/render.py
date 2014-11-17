#!/usr/bin/python
# coding=utf-8
from handlers.base import BaseHandler
import tornado
import tornado.web


class RenderHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self, path):
        kwargs = dict(
            path=path,
            username=self.current_user.username,
            risk=0
        )
        if path == "report_risk":
            kwargs.update(dict(risk=1))
        self.render("index.html", **kwargs)