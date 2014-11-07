#!/usr/bin/python
# coding=utf-8
import json
import tornado
import tornado.web
import config
from handlers.base import BaseHandler
from storage.mysql.database import session_manange
from utils import WebRequrestUtil

API_HOST = config.api.host

class CommonMsgIndexHandler(BaseHandler):
    """
    普通消息首页
    """

    @tornado.web.authenticated
    def get(self):
        return self.render("comm_msg/main.html")

    @tornado.web.authenticated
    @session_manange
    def post(self):
        pass


class ImageMsgListHandler(BaseHandler):
    """
    普通消息列表
    """
    LIST_IMAGE = config.api.image_list

    @tornado.web.authenticated
    @session_manange
    def post(self):
        data = WebRequrestUtil.getRequest2(API_HOST, self.LIST_IMAGE)
        return self.json(json.loads(data))
