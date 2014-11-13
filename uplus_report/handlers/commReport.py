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

class CommonReportIndexHandler(BaseHandler):
    """
    普通消息首页
    """

    @tornado.web.authenticated
    def get(self):
        return self.render("comm_report/main.html")

    @tornado.web.authenticated
    @session_manange
    def post(self):
        pass


class AlbumImageReportListHandler(BaseHandler):
    """
    普通举报相册图片列表
    """
    LIST_ALBUM_IMAGE = config.api.report_album_image_list

    @tornado.web.authenticated
    @session_manange
    def get(self):
        data = WebRequrestUtil.getRequest2(API_HOST,
                                           self.LIST_ALBUM_IMAGE,
                                           parameters=dict(
                                           csid=self.current_user.id,
                                           size=20))
        return self.send_success_json(json.loads(data))

    post=get


class AlbumImageHandler(BaseHandler):
    """
    普通举报相册图片
    """
    ALBUM_IMAGE = config.api.report_album_image
    @tornado.web.authenticated
    @session_manange
    def get(self):
        data = WebRequrestUtil.getRequest2(API_HOST,
                                           self.ALBUM_IMAGE)
        return self.send_success_json(json.loads(data))


class MessageReportNextHandler(BaseHandler):
    """
    获取下一个被举报的消息
    """
    NEXT_MESSAGE = config.api.report_message_next

    @tornado.web.authenticated
    @session_manange
    def get(self):
        data = WebRequrestUtil.getRequest2(API_HOST,
                                           self.NEXT_MESSAGE,
                                           parameters=dict(
                                           csid=self.current_user.id))
        return self.send_success_json(json.loads(data))