#!/usr/bin/python
# coding=utf-8
from handlers.base import BaseHandler
import tornado
import tornado.web


class RenderHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self, path):
        self.render("index.html", path=path,
                    username=self.current_user.username)