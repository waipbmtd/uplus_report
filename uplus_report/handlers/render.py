#!/usr/bin/python
# coding=utf-8
from handlers.base import BaseHandler


class RenderHandler(BaseHandler):
    def get(self, path):
        self.render("index.html", path=path,
                    username=self.current_user.username)