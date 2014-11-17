#!/usr/bin/python
# coding=utf-8
import json
import tornado
import tornado.web
import config
from handlers.base import BaseHandler
from models import reportConstant
from storage.mysql.database import session_manage
from utils import WebRequrestUtil, util

API_HOST = config.api.host


class ReportIndexHandler(BaseHandler):
    """
    普通消息首页
    """

    @tornado.web.authenticated
    def get(self):
        return self.render("comm_report/main.html")


class AlbumImageReportListHandler(BaseHandler):
    """
    普通举报相册图片列表
    """
    LIST_ALBUM_IMAGE = config.api.report_album_image_list

    @util.exception_handler
    @tornado.web.authenticated
    @session_manage
    def get(self):
        risk = self.get_argument("risk", reportConstant.REPORT_RISK_FALSE)
        data = WebRequrestUtil.getRequest2(API_HOST,
                                           self.LIST_ALBUM_IMAGE,
                                           parameters=dict(
                                               risk=risk,
                                               csid=self.current_user.id,
                                               size=15))
        self.record_log(content=u"获取下一批图片 " +
                                reportConstant.REPORT_RISK_ENUMS.get(
                                    int(risk)).decode('utf8'))
        return self.send_success_json(json.loads(data))

    post = get


class MessageReportNextHandler(BaseHandler):
    """
    获取下一个被举报的消息
    """
    NEXT_MESSAGE = config.api.report_message_next

    @util.exception_handler
    @tornado.web.authenticated
    @session_manage
    def get(self):
        risk = self.get_argument("risk", reportConstant.REPORT_RISK_FALSE)
        data = WebRequrestUtil.getRequest2(API_HOST,
                                           self.NEXT_MESSAGE,
                                           parameters=dict(
                                               risk=risk,
                                               csid=self.current_user.id))
        self.record_log(content=u"获取下一条消息 " +
                                reportConstant.REPORT_RISK_ENUMS.get(
                                    int(risk)).decode('utf8'))
        return self.send_success_json(json.loads(data))


class RemainReportCountHandler(BaseHandler):
    REMAIN_REPORT = config.api.report_remain_count

    @util.exception_handler
    @tornado.web.authenticated
    def get(self):
        risk = self.get_argument("risk", reportConstant.REPORT_RISK_FALSE)
        data = WebRequrestUtil.getRequest2(API_HOST,
                                           self.REMAIN_REPORT,
                                           parameters=dict(
                                               risk=risk,
                                               csid=self.current_user.id
                                           ))
        return self.send_success_json(json.loads(data))